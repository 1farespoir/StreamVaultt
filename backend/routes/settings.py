from fastapi import APIRouter, HTTPException
from models import SiteSettings, SiteSettingsUpdate
from server import db
from datetime import datetime, timezone

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SiteSettings)
async def get_settings():
    """Get site settings"""
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    
    if not settings:
        # Return default settings if none exist
        default_settings = SiteSettings()
        # Save default settings
        doc = default_settings.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.settings.insert_one(doc)
        return default_settings
    
    if isinstance(settings.get('updated_at'), str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    
    return settings


@router.put("", response_model=SiteSettings)
async def update_settings(settings_data: SiteSettingsUpdate):
    """Update site settings"""
    existing_settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    
    if not existing_settings:
        # Create new settings if none exist
        default_settings = SiteSettings()
        existing_settings = default_settings.model_dump()
    
    if isinstance(existing_settings.get('updated_at'), str):
        existing_settings['updated_at'] = datetime.fromisoformat(existing_settings['updated_at'])
    
    # Update only provided fields
    update_data = settings_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc)
    
    # Merge with existing data
    existing_settings.update(update_data)
    updated_settings = SiteSettings(**existing_settings)
    
    # Convert to dict and serialize datetime
    doc = updated_settings.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.settings.update_one(
        {"id": "site_settings"},
        {"$set": doc},
        upsert=True
    )
    
    return updated_settings
