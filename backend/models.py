from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid


# Product Models
class ProductPlan(BaseModel):
    duration: str  # "1m", "3m", "12m"
    price: float
    original_price: Optional[float] = None
    savings: Optional[float] = None


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str  # URL-friendly identifier
    description: str
    short_description: Optional[str] = None
    category: Optional[str] = None  # e.g., "streaming", "productivity", "entertainment"
    
    # Pricing
    plans: List[ProductPlan]
    currency: str = "USD"
    
    # Visual
    icon: str  # Icon name or URL
    images: List[str] = []  # Multiple product images
    color: Optional[str] = None  # Brand color
    
    # Features
    features: List[str] = []
    
    # Status
    is_active: bool = True
    is_popular: bool = False
    in_stock: bool = True
    stock_count: Optional[int] = None
    
    # SEO
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: List[str] = []
    
    # Custom fields for flexibility
    custom_fields: Dict[str, Any] = {}
    
    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    display_order: int = 0


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str
    short_description: Optional[str] = None
    category: Optional[str] = None
    plans: List[ProductPlan]
    currency: str = "USD"
    icon: str
    images: List[str] = []
    color: Optional[str] = None
    features: List[str] = []
    is_active: bool = True
    is_popular: bool = False
    in_stock: bool = True
    stock_count: Optional[int] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: List[str] = []
    custom_fields: Dict[str, Any] = {}
    display_order: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category: Optional[str] = None
    plans: Optional[List[ProductPlan]] = None
    currency: Optional[str] = None
    icon: Optional[str] = None
    images: Optional[List[str]] = None
    color: Optional[str] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_popular: Optional[bool] = None
    in_stock: Optional[bool] = None
    stock_count: Optional[int] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    display_order: Optional[int] = None


# Discount/Deal Models
class DealPopup(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    discount_code: Optional[str] = None
    discount_percentage: Optional[float] = None
    
    # Visual
    image_url: Optional[str] = None
    background_color: Optional[str] = "#00FF66"
    text_color: Optional[str] = "#000000"
    
    # Popup behavior
    is_active: bool = True
    show_once_per_session: bool = True
    show_delay_seconds: int = 3  # Delay before showing
    show_frequency_days: int = 1  # Show again after X days
    
    # Scheduling
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    
    # CTA
    cta_text: str = "Shop Now"
    cta_link: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    views_count: int = 0
    clicks_count: int = 0


class DealPopupCreate(BaseModel):
    title: str
    description: str
    discount_code: Optional[str] = None
    discount_percentage: Optional[float] = None
    image_url: Optional[str] = None
    background_color: Optional[str] = "#00FF66"
    text_color: Optional[str] = "#000000"
    is_active: bool = True
    show_once_per_session: bool = True
    show_delay_seconds: int = 3
    show_frequency_days: int = 1
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    cta_text: str = "Shop Now"
    cta_link: Optional[str] = None


class DealPopupUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    discount_code: Optional[str] = None
    discount_percentage: Optional[float] = None
    image_url: Optional[str] = None
    background_color: Optional[str] = None
    text_color: Optional[str] = None
    is_active: Optional[bool] = None
    show_once_per_session: Optional[bool] = None
    show_delay_seconds: Optional[int] = None
    show_frequency_days: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None


# Testimonial Models
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    avatar: Optional[str] = None
    rating: float = 5.0
    text: str
    product_purchased: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    display_order: int = 0


class TestimonialCreate(BaseModel):
    name: str
    avatar: Optional[str] = None
    rating: float = 5.0
    text: str
    product_purchased: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    display_order: int = 0


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    rating: Optional[float] = None
    text: Optional[str] = None
    product_purchased: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


# Order Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    plan: str
    price: float
    quantity: int


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_email: str
    customer_name: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    discount: float = 0.0
    total: float
    status: str = "pending"  # pending, completed, failed
    payment_method: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    customer_email: str
    customer_name: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    discount: float = 0.0
    total: float
    payment_method: Optional[str] = None


# Site Settings Models
class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "site_settings"
    site_name: str = "GetSub"
    site_tagline: str = "Unlock Premium Streaming for Less"
    primary_color: str = "#00FF66"
    secondary_color: str = "#000000"
    currency: str = "USD"
    support_email: str = "support@streamvault.com"
    support_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    show_whatsapp_button: bool = False
    
    # Trust indicators
    total_deliveries: int = 180000
    average_rating: float = 4.9
    delivery_time_seconds: int = 60
    uptime_percentage: float = 99.97
    
    # Social links
    social_links: Dict[str, str] = {}
    
    # SEO
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    
    # Custom
    custom_settings: Dict[str, Any] = {}
    
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    site_tagline: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    currency: Optional[str] = None
    support_email: Optional[str] = None
    support_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    show_whatsapp_button: Optional[bool] = None
    total_deliveries: Optional[int] = None
    average_rating: Optional[float] = None
    delivery_time_seconds: Optional[int] = None
    uptime_percentage: Optional[float] = None
    social_links: Optional[Dict[str, str]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    custom_settings: Optional[Dict[str, Any]] = None
