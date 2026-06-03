from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from typing import Optional
import razorpay
import httpx
import hmac
import hashlib
import os
from datetime import datetime, timezone
from server import db

router = APIRouter(prefix="/payments", tags=["payments"])

# Initialize Razorpay client
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID', '')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET', '')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret)) if razorpay_key_id and razorpay_key_secret else None

# Bitpay configuration
bitpay_token = os.environ.get('BITPAY_TOKEN', '')
bitpay_base_url = os.environ.get('BITPAY_BASE_URL', 'https://test.bitpay.com')
bitpay_notification_url = os.environ.get('BITPAY_NOTIFICATION_URL', '')


# ==================== REQUEST/RESPONSE MODELS ====================

class RazorpayOrderCreate(BaseModel):
    amount: float  # Amount in USD/currency
    currency: str = "USD"
    order_id: str
    customer_email: str
    customer_name: Optional[str] = None


class RazorpayVerifyPayment(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str


class BitpayInvoiceCreate(BaseModel):
    amount: float
    currency: str = "USD"
    order_id: str
    customer_email: str
    redirect_url: str = "https://your-domain.com/checkout/complete"


# ==================== RAZORPAY ROUTES ====================

@router.post("/razorpay/create-order")
async def create_razorpay_order(order_data: RazorpayOrderCreate):
    """Create a Razorpay order for payment"""
    
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env")
    
    try:
        # Convert amount to paise (smallest currency unit for Razorpay)
        amount_paise = int(order_data.amount * 100)
        
        # Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": order_data.currency,
            "receipt": order_data.order_id,
            "payment_capture": 1
        })
        
        # Store payment record in database
        payment_doc = {
            "order_id": order_data.order_id,
            "payment_gateway": "razorpay",
            "razorpay_order_id": razorpay_order["id"],
            "amount": order_data.amount,
            "currency": order_data.currency,
            "status": "created",
            "customer_email": order_data.customer_email,
            "customer_name": order_data.customer_name,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payments.insert_one(payment_doc)
        
        return {
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key_id": razorpay_key_id,
            "amount": amount_paise,
            "currency": order_data.currency,
            "order_id": order_data.order_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")


@router.post("/razorpay/verify")
async def verify_razorpay_payment(payment_data: RazorpayVerifyPayment):
    """Verify Razorpay payment signature and update order status"""
    
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay not configured")
    
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': payment_data.razorpay_order_id,
            'razorpay_payment_id': payment_data.razorpay_payment_id,
            'razorpay_signature': payment_data.razorpay_signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Update payment record
        await db.payments.update_one(
            {"order_id": payment_data.order_id},
            {
                "$set": {
                    "status": "paid",
                    "razorpay_payment_id": payment_data.razorpay_payment_id,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Update order status
        await db.orders.update_one(
            {"id": payment_data.order_id},
            {"$set": {"status": "completed", "payment_status": "paid"}}
        )
        
        return {
            "success": True,
            "message": "Payment verified successfully",
            "order_id": payment_data.order_id
        }
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")


@router.post("/razorpay/webhook")
async def razorpay_webhook(request: Request, x_razorpay_signature: Optional[str] = Header(None)):
    """Handle Razorpay webhook notifications"""
    
    body = await request.body()
    webhook_secret = os.environ.get('RAZORPAY_WEBHOOK_SECRET', '')
    
    if webhook_secret and x_razorpay_signature:
        # Verify webhook signature
        expected_signature = hmac.new(
            webhook_secret.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if expected_signature != x_razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")
    
    payload = await request.json()
    event = payload.get('event')
    
    if event == 'payment.captured':
        payment_entity = payload.get('payload', {}).get('payment', {}).get('entity', {})
        order_id = payment_entity.get('notes', {}).get('order_id')
        
        if order_id:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"status": "completed", "payment_status": "paid"}}
            )
    
    return {"status": "ok"}


# ==================== BITPAY ROUTES ====================

@router.post("/bitpay/create-invoice")
async def create_bitpay_invoice(invoice_data: BitpayInvoiceCreate):
    """Create a Bitpay invoice for cryptocurrency payment"""
    
    if not bitpay_token:
        raise HTTPException(status_code=500, detail="Bitpay not configured. Please add BITPAY_TOKEN to .env")
    
    try:
        url = f"{bitpay_base_url}/invoices"
        
        payload = {
            "token": bitpay_token,
            "price": invoice_data.amount,
            "currency": invoice_data.currency,
            "orderId": invoice_data.order_id,
            "notificationURL": bitpay_notification_url,
            "redirectURL": invoice_data.redirect_url,
            "buyer": {
                "email": invoice_data.customer_email
            }
        }
        
        headers = {
            "content-type": "application/json",
            "x-accept-version": "2.0.0"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            bitpay_invoice = response.json()
        
        # Store payment record
        payment_doc = {
            "order_id": invoice_data.order_id,
            "payment_gateway": "bitpay",
            "bitpay_invoice_id": bitpay_invoice["data"]["id"],
            "amount": invoice_data.amount,
            "currency": invoice_data.currency,
            "status": "new",
            "customer_email": invoice_data.customer_email,
            "bitpay_url": bitpay_invoice["data"]["url"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payments.insert_one(payment_doc)
        
        return {
            "invoice_id": bitpay_invoice["data"]["id"],
            "invoice_url": bitpay_invoice["data"]["url"],
            "status": bitpay_invoice["data"]["status"],
            "order_id": invoice_data.order_id
        }
        
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Bitpay API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Bitpay invoice: {str(e)}")


@router.get("/bitpay/invoice/{invoice_id}")
async def get_bitpay_invoice_status(invoice_id: str):
    """Get Bitpay invoice status"""
    
    if not bitpay_token:
        raise HTTPException(status_code=500, detail="Bitpay not configured")
    
    try:
        url = f"{bitpay_base_url}/invoices/{invoice_id}"
        params = {"token": bitpay_token}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            invoice = response.json()
        
        return invoice["data"]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch invoice: {str(e)}")


@router.post("/bitpay/webhook")
async def bitpay_webhook(request: Request):
    """Handle Bitpay IPN (Instant Payment Notifications)"""
    
    try:
        payload = await request.json()
        invoice_id = payload.get('id')
        
        if not invoice_id:
            return {"status": "ok"}
        
        # Fetch actual invoice status from Bitpay (IPNs are not signed, so we verify)
        url = f"{bitpay_base_url}/invoices/{invoice_id}"
        params = {"token": bitpay_token}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            invoice = response.json()
        
        invoice_data = invoice["data"]
        status = invoice_data.get("status")
        order_id = invoice_data.get("orderId")
        
        # Update payment record
        await db.payments.update_one(
            {"bitpay_invoice_id": invoice_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Update order status based on invoice status
        if status in ["confirmed", "complete"]:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"status": "completed", "payment_status": "paid"}}
            )
        elif status == "expired":
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"status": "expired", "payment_status": "failed"}}
            )
        
        return {"status": "ok"}
        
    except Exception as e:
        print(f"Bitpay webhook error: {e}")
        return {"status": "error", "message": str(e)}
