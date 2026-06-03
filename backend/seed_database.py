"""
Seed script to populate initial data for GetSub
Run this once to migrate existing products and testimonials to the database
"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


async def seed_products():
    """Seed initial products"""
    print("🌱 Seeding products...")
    
    # Check if products already exist
    count = await db.products.count_documents({})
    if count > 0:
        print(f"  ℹ️  Products already exist ({count} found). Skipping...")
        return
    
    products = [
        {
            "id": "spotify-premium",
            "name": "Spotify Premium",
            "slug": "spotify-premium",
            "description": "Ad-free music listening with unlimited skips, offline downloads, and high-quality audio. Works on all devices.",
            "short_description": "Ad-free music, anywhere.",
            "category": "Music Streaming",
            "plans": [
                {"duration": "1m", "price": 4.99, "original_price": 11.99, "savings": 7.00},
                {"duration": "3m", "price": 12.99, "original_price": 35.97, "savings": 22.98},
                {"duration": "12m", "price": 39.99, "original_price": 143.88, "savings": 103.89}
            ],
            "currency": "USD",
            "icon": "spotify",
            "images": ["https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800"],
            "color": "#1DB954",
            "features": [
                "Ad-free music listening",
                "Offline downloads",
                "High-quality audio (320 kbps)",
                "Unlimited skips & on-demand",
                "Works on all devices"
            ],
            "is_active": True,
            "is_popular": True,
            "in_stock": True,
            "seo_title": "Spotify Premium - Save 70% | StreamVault",
            "seo_description": "Get Spotify Premium at huge discounts. Ad-free music, offline downloads, and more.",
            "seo_keywords": ["spotify", "spotify premium", "music streaming", "ad-free music"],
            "custom_fields": {"badge": "Best Seller"},
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "display_order": 1
        },
        {
            "id": "netflix-premium",
            "name": "Netflix Premium",
            "slug": "netflix-premium",
            "description": "Stream unlimited movies and TV shows in 4K Ultra HD on 4 screens simultaneously. Download on 6 devices. No ads.",
            "short_description": "4K Ultra HD on 4 screens.",
            "category": "Video Streaming",
            "plans": [
                {"duration": "1m", "price": 7.99, "original_price": 22.99, "savings": 15.00},
                {"duration": "3m", "price": 21.99, "original_price": 68.97, "savings": 46.98},
                {"duration": "12m", "price": 69.99, "original_price": 275.88, "savings": 205.89}
            ],
            "currency": "USD",
            "icon": "netflix",
            "images": ["https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800"],
            "color": "#E50914",
            "features": [
                "4K Ultra HD streaming",
                "Watch on 4 screens at once",
                "Unlimited movies & TV shows",
                "Download on 6 devices",
                "No ads, no interruptions"
            ],
            "is_active": True,
            "is_popular": True,
            "in_stock": True,
            "seo_title": "Netflix Premium 4K - Save 70% | StreamVault",
            "seo_description": "Netflix Premium at discounted prices. 4K streaming on 4 screens simultaneously.",
            "seo_keywords": ["netflix", "netflix premium", "4k streaming", "video streaming"],
            "custom_fields": {"badge": "Hot Deal"},
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "display_order": 2
        },
        {
            "id": "youtube-premium",
            "name": "YouTube Premium",
            "slug": "youtube-premium",
            "description": "Ad-free YouTube videos with background play, offline downloads, and YouTube Music Premium included. Access to YouTube Originals.",
            "short_description": "Ad-free videos & YouTube Music.",
            "category": "Video Streaming",
            "plans": [
                {"duration": "1m", "price": 3.99, "original_price": 13.99, "savings": 10.00},
                {"duration": "3m", "price": 10.99, "original_price": 41.97, "savings": 30.98},
                {"duration": "12m", "price": 34.99, "original_price": 167.88, "savings": 132.89}
            ],
            "currency": "USD",
            "icon": "youtube",
            "images": ["https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800"],
            "color": "#FF0000",
            "features": [
                "Ad-free YouTube videos",
                "Background play on mobile",
                "YouTube Music Premium included",
                "Offline downloads",
                "YouTube Originals access"
            ],
            "is_active": True,
            "is_popular": False,
            "in_stock": True,
            "seo_title": "YouTube Premium - Save 70% | GetSub",
            "seo_description": "YouTube Premium at huge discounts. Ad-free videos and YouTube Music included.",
            "seo_keywords": ["youtube", "youtube premium", "ad-free youtube", "youtube music"],
            "custom_fields": {"badge": "Save 70%"},
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "display_order": 3
        }
    ]
    
    await db.products.insert_many(products)
    print(f"  ✅ Seeded {len(products)} products")


async def seed_testimonials():
    """Seed initial testimonials"""
    print("🌱 Seeding testimonials...")
    
    # Check if testimonials already exist
    count = await db.testimonials.count_documents({})
    if count > 0:
        print(f"  ℹ️  Testimonials already exist ({count} found). Skipping...")
        return
    
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "name": "Marcus Chen",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDI5MjIzMnww&ixlib=rb-4.1.0&q=85",
            "rating": 5.0,
            "text": "Got my Spotify Premium key in less than 2 minutes. Genuinely the smoothest checkout I've ever experienced. Saved $84 a year — no joke.",
            "product_purchased": "Spotify Premium",
            "is_active": True,
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "display_order": 1
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sofia Reyes",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDI5MjIzMnww&ixlib=rb-4.1.0&q=85",
            "rating": 5.0,
            "text": "Netflix Premium at a third of the price and it just works. Already gifted two subscriptions to my family. GetSub is the real deal.",
            "product_purchased": "Netflix Premium",
            "is_active": True,
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "display_order": 2
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Daniel Okafor",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDI5MjIzMnww&ixlib=rb-4.1.0&q=85",
            "rating": 5.0,
            "text": "I was skeptical at first — prices looked too good. But the support team is sharp, deliveries are instant, and renewals are seamless. 10/10.",
            "product_purchased": "YouTube Premium",
            "is_active": True,
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "display_order": 3
        }
    ]
    
    await db.testimonials.insert_many(testimonials)
    print(f"  ✅ Seeded {len(testimonials)} testimonials")


async def seed_settings():
    """Seed initial site settings"""
    print("🌱 Seeding site settings...")
    
    # Check if settings already exist
    existing = await db.settings.find_one({"id": "site_settings"})
    if existing:
        print("  ℹ️  Settings already exist. Skipping...")
        return
    
    settings = {
        "id": "site_settings",
        "site_name": "GetSub",
        "site_tagline": "Unlock Premium Streaming for Less",
        "primary_color": "#00FF66",
        "secondary_color": "#000000",
        "currency": "USD",
        "support_email": "support@streamvault.com",
        "support_phone": None,
        "whatsapp_number": None,
        "show_whatsapp_button": False,
        "total_deliveries": 180000,
        "average_rating": 4.9,
        "delivery_time_seconds": 60,
        "uptime_percentage": 99.97,
        "social_links": {
            "twitter": "https://twitter.com/streamvault",
            "facebook": "https://facebook.com/streamvault",
            "instagram": "https://instagram.com/streamvault"
        },
        "seo_title": "GetSub - Premium Subscriptions at Discount Prices",
        "seo_description": "Get Spotify, Netflix, YouTube Premium and more at up to 70% off. Instant delivery, lifetime warranty.",
        "custom_settings": {},
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.settings.insert_one(settings)
    print("  ✅ Seeded site settings")


async def main():
    print("\n🚀 Starting GetSub database seeding...\n")
    
    try:
        await seed_products()
        await seed_testimonials()
        await seed_settings()
        
        print("\n✨ Database seeding completed successfully!\n")
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}\n")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
