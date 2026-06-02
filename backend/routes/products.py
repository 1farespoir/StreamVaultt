from fastapi import APIRouter, HTTPException
from typing import List
from models import Product, ProductCreate, ProductUpdate
from server import db
from datetime import datetime, timezone

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[Product])
async def get_products(active_only: bool = False):
    """Get all products"""
    query = {"is_active": True} if active_only else {}
    products = await db.products.find(query, {"_id": 0}).sort("display_order", 1).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
        if isinstance(product.get('updated_at'), str):
            product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    return products


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Convert ISO string timestamps
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    if isinstance(product.get('updated_at'), str):
        product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    return product


@router.post("", response_model=Product)
async def create_product(product_data: ProductCreate):
    """Create a new product"""
    # Check if slug already exists
    existing = await db.products.find_one({"slug": product_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    
    product_dict = product_data.model_dump()
    product_obj = Product(**product_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.products.insert_one(doc)
    return product_obj


@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate):
    """Update a product"""
    existing_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Convert existing timestamps
    if isinstance(existing_product.get('created_at'), str):
        existing_product['created_at'] = datetime.fromisoformat(existing_product['created_at'])
    if isinstance(existing_product.get('updated_at'), str):
        existing_product['updated_at'] = datetime.fromisoformat(existing_product['updated_at'])
    
    # Update only provided fields
    update_data = product_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc)
    
    # Merge with existing data
    existing_product.update(update_data)
    updated_product = Product(**existing_product)
    
    # Convert to dict and serialize datetime
    doc = updated_product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.products.update_one({"id": product_id}, {"$set": doc})
    
    return updated_product


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}
