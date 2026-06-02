from fastapi import APIRouter, HTTPException
from typing import List
from models import Testimonial, TestimonialCreate, TestimonialUpdate
from server import db
from datetime import datetime, timezone

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.get("", response_model=List[Testimonial])
async def get_testimonials(active_only: bool = False, featured_only: bool = False):
    """Get all testimonials"""
    query = {}
    if active_only:
        query["is_active"] = True
    if featured_only:
        query["is_featured"] = True
    
    testimonials = await db.testimonials.find(query, {"_id": 0}).sort("display_order", 1).to_list(1000)
    
    # Convert ISO string timestamps
    for testimonial in testimonials:
        if isinstance(testimonial.get('created_at'), str):
            testimonial['created_at'] = datetime.fromisoformat(testimonial['created_at'])
    
    return testimonials


@router.get("/{testimonial_id}", response_model=Testimonial)
async def get_testimonial(testimonial_id: str):
    """Get a single testimonial by ID"""
    testimonial = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    if isinstance(testimonial.get('created_at'), str):
        testimonial['created_at'] = datetime.fromisoformat(testimonial['created_at'])
    
    return testimonial


@router.post("", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Create a new testimonial"""
    testimonial_dict = testimonial_data.model_dump()
    testimonial_obj = Testimonial(**testimonial_dict)
    
    # Convert to dict and serialize datetime
    doc = testimonial_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.testimonials.insert_one(doc)
    return testimonial_obj


@router.put("/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial_data: TestimonialUpdate):
    """Update a testimonial"""
    existing = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    if isinstance(existing.get('created_at'), str):
        existing['created_at'] = datetime.fromisoformat(existing['created_at'])
    
    # Update only provided fields
    update_data = testimonial_data.model_dump(exclude_unset=True)
    
    # Merge with existing data
    existing.update(update_data)
    updated_testimonial = Testimonial(**existing)
    
    # Convert to dict and serialize datetime
    doc = updated_testimonial.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": doc})
    
    return updated_testimonial


@router.delete("/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    return {"message": "Testimonial deleted successfully"}
