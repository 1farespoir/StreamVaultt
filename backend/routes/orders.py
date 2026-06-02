from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from models import Order, OrderCreate
from server import db
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=List[Order])
async def get_orders(limit: int = 100, status: str = None):
    """Get all orders"""
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders


@router.get("/statistics", response_model=Dict[str, Any])
async def get_order_statistics():
    """Get order statistics for admin dashboard"""
    now = datetime.now(timezone.utc)
    
    # Total orders
    total_orders = await db.orders.count_documents({})
    
    # Orders today
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    orders_today = await db.orders.count_documents({
        "created_at": {"$gte": today_start.isoformat()}
    })
    
    # Orders this week
    week_start = now - timedelta(days=7)
    orders_this_week = await db.orders.count_documents({
        "created_at": {"$gte": week_start.isoformat()}
    })
    
    # Orders this month
    month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    orders_this_month = await db.orders.count_documents({
        "created_at": {"$gte": month_start.isoformat()}
    })
    
    # Calculate total revenue
    all_orders = await db.orders.find({}, {"_id": 0, "total": 1}).to_list(10000)
    total_revenue = sum(order.get("total", 0) for order in all_orders)
    
    # Revenue today
    orders_today_data = await db.orders.find({
        "created_at": {"$gte": today_start.isoformat()}
    }, {"_id": 0, "total": 1}).to_list(1000)
    revenue_today = sum(order.get("total", 0) for order in orders_today_data)
    
    # Revenue this week
    orders_week_data = await db.orders.find({
        "created_at": {"$gte": week_start.isoformat()}
    }, {"_id": 0, "total": 1}).to_list(1000)
    revenue_this_week = sum(order.get("total", 0) for order in orders_week_data)
    
    # Revenue this month
    orders_month_data = await db.orders.find({
        "created_at": {"$gte": month_start.isoformat()}
    }, {"_id": 0, "total": 1}).to_list(1000)
    revenue_this_month = sum(order.get("total", 0) for order in orders_month_data)
    
    # Top products
    all_orders_with_items = await db.orders.find({}, {"_id": 0, "items": 1}).to_list(10000)
    product_counts = {}
    for order in all_orders_with_items:
        for item in order.get("items", []):
            product_name = item.get("product_name")
            if product_name:
                product_counts[product_name] = product_counts.get(product_name, 0) + item.get("quantity", 1)
    
    top_products = sorted(product_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_orders": total_orders,
        "orders_today": orders_today,
        "orders_this_week": orders_this_week,
        "orders_this_month": orders_this_month,
        "total_revenue": round(total_revenue, 2),
        "revenue_today": round(revenue_today, 2),
        "revenue_this_week": round(revenue_this_week, 2),
        "revenue_this_month": round(revenue_this_month, 2),
        "top_products": [{"name": name, "count": count} for name, count in top_products],
    }


@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get a single order by ID"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return order


@router.post("", response_model=Order)
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    order_dict = order_data.model_dump()
    order_obj = Order(**order_dict)
    
    # Convert to dict and serialize datetime
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.orders.insert_one(doc)
    return order_obj


@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    """Update order status"""
    if status not in ["pending", "completed", "failed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated successfully"}
