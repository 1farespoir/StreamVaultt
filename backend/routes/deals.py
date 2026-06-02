from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models import DealPopup, DealPopupCreate, DealPopupUpdate
from server import db
from datetime import datetime, timezone

router = APIRouter(prefix="/deals", tags=["deals"])


@router.get("", response_model=List[DealPopup])
async def get_deals():
    """Get all deals"""
    deals = await db.deals.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps
    for deal in deals:
        for field in ['created_at', 'updated_at', 'start_date', 'end_date']:
            if deal.get(field) and isinstance(deal[field], str):
                deal[field] = datetime.fromisoformat(deal[field])
    
    return deals


@router.get("/active", response_model=Optional[DealPopup])
async def get_active_deal():
    """Get the currently active deal for popup display"""
    now = datetime.now(timezone.utc)
    
    # Find active deal within date range
    deals = await db.deals.find({"is_active": True}, {"_id": 0}).to_list(1000)
    
    for deal in deals:
        # Convert ISO strings
        for field in ['created_at', 'updated_at', 'start_date', 'end_date']:
            if deal.get(field) and isinstance(deal[field], str):
                deal[field] = datetime.fromisoformat(deal[field])
        
        # Check if deal is within valid date range
        start_ok = not deal.get('start_date') or deal['start_date'] <= now
        end_ok = not deal.get('end_date') or deal['end_date'] >= now
        
        if start_ok and end_ok:
            return DealPopup(**deal)
    
    return None


@router.get("/{deal_id}", response_model=DealPopup)
async def get_deal(deal_id: str):
    """Get a single deal by ID"""
    deal = await db.deals.find_one({"id": deal_id}, {"_id": 0})
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Convert ISO strings
    for field in ['created_at', 'updated_at', 'start_date', 'end_date']:
        if deal.get(field) and isinstance(deal[field], str):
            deal[field] = datetime.fromisoformat(deal[field])
    
    return deal


@router.post("", response_model=DealPopup)
async def create_deal(deal_data: DealPopupCreate):
    """Create a new deal"""
    deal_dict = deal_data.model_dump()
    deal_obj = DealPopup(**deal_dict)
    
    # Convert to dict and serialize datetime
    doc = deal_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc.get('start_date'):
        doc['start_date'] = doc['start_date'].isoformat()
    if doc.get('end_date'):
        doc['end_date'] = doc['end_date'].isoformat()
    
    await db.deals.insert_one(doc)
    return deal_obj


@router.put("/{deal_id}", response_model=DealPopup)
async def update_deal(deal_id: str, deal_data: DealPopupUpdate):
    """Update a deal"""
    existing_deal = await db.deals.find_one({"id": deal_id}, {"_id": 0})
    
    if not existing_deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Convert existing timestamps
    for field in ['created_at', 'updated_at', 'start_date', 'end_date']:
        if existing_deal.get(field) and isinstance(existing_deal[field], str):
            existing_deal[field] = datetime.fromisoformat(existing_deal[field])
    
    # Update only provided fields
    update_data = deal_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc)
    
    # Merge with existing data
    existing_deal.update(update_data)
    updated_deal = DealPopup(**existing_deal)
    
    # Convert to dict and serialize datetime
    doc = updated_deal.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc.get('start_date'):
        doc['start_date'] = doc['start_date'].isoformat()
    if doc.get('end_date'):
        doc['end_date'] = doc['end_date'].isoformat()
    
    await db.deals.update_one({"id": deal_id}, {"$set": doc})
    
    return updated_deal


@router.delete("/{deal_id}")
async def delete_deal(deal_id: str):
    """Delete a deal"""
    result = await db.deals.delete_one({"id": deal_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return {"message": "Deal deleted successfully"}


@router.post("/{deal_id}/track-view")
async def track_deal_view(deal_id: str):
    """Track when a deal popup is viewed"""
    await db.deals.update_one(
        {"id": deal_id},
        {"$inc": {"views_count": 1}}
    )
    return {"message": "View tracked"}


@router.post("/{deal_id}/track-click")
async def track_deal_click(deal_id: str):
    """Track when a deal popup CTA is clicked"""
    await db.deals.update_one(
        {"id": deal_id},
        {"$inc": {"clicks_count": 1}}
    )
    return {"message": "Click tracked"}
