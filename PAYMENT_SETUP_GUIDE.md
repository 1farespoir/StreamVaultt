# 💳 Payment Gateway Integration Guide - StreamVault

This document explains how to configure Razorpay (for international fiat payments) and Bitpay (for cryptocurrency payments) in your StreamVault application.

## 🎯 Overview

Your StreamVault app now supports TWO payment methods:
- **Razorpay**: International payments via credit/debit cards, UPI, wallets, net banking
- **Bitpay**: Cryptocurrency payments (Bitcoin, Ethereum, etc.)

---

## 🔧 Step 1: Get Your API Credentials

### Razorpay Setup (International Fiat Payments)

1. **Create a Razorpay Account**
   - Go to https://dashboard.razorpay.com/signup
   - Complete the signup process
   - Verify your business details

2. **Get API Keys**
   - Go to https://dashboard.razorpay.com/app/keys
   - You'll see:
     - `Key ID` (looks like: `rzp_test_xxxxx` or `rzp_live_xxxxx`)
     - `Key Secret` (click "Generate Test Key" if needed)

3. **Get Webhook Secret (Optional but Recommended)**
   - Go to https://dashboard.razorpay.com/app/webhooks
   - Click "Add New Webhook"
   - Enter your webhook URL: `https://your-domain.com/api/payments/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`
   - Click "Create Webhook"
   - Copy the "Webhook Secret"

### Bitpay Setup (Cryptocurrency Payments)

1. **Create a Bitpay Account**
   - **For Testing**: Go to https://test.bitpay.com/dashboard/signup
   - **For Production**: Go to https://bitpay.com/dashboard/signup
   - Complete the merchant onboarding

2. **Get POS Token**
   - Log into your Bitpay Dashboard
   - Go to "Payment Tools" → "API Tokens"
   - Click "Add New Token"
   - Select "Point of Sale" facade
   - Copy the generated token

3. **Configure Webhook URL**
   - The webhook URL will be: `https://your-domain.com/api/payments/bitpay/webhook`
   - This is automatically sent when creating invoices

---

## 📝 Step 2: Add API Keys to Your Application

### Backend Configuration

Open `/app/backend/.env` and update with your actual API keys:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE

# Bitpay Configuration
BITPAY_TOKEN=YOUR_BITPAY_POS_TOKEN_HERE
BITPAY_BASE_URL=https://test.bitpay.com  # Use https://bitpay.com for production
BITPAY_NOTIFICATION_URL=https://your-domain.com/api/payments/bitpay/webhook
```

**Important Notes:**
- Replace `YOUR_KEY_ID_HERE`, `YOUR_SECRET_KEY_HERE`, etc. with your actual credentials
- For testing, use Razorpay test keys (starting with `rzp_test_`)
- For testing Bitpay, use `https://test.bitpay.com`
- Never commit `.env` file to Git (it's in `.gitignore` by default)

### Frontend Configuration

Add Razorpay script to `/app/frontend/public/index.html` in the `<head>` section:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="https://bitpay.com/bitpay.min.js"></script>
```

---

## 🚀 Step 3: Restart Services

After adding your API keys:

```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

---

## 💻 How It Works

### User Checkout Flow

1. **User selects a subscription** (e.g., Spotify Premium - 3 months)

2. **User chooses payment method:**
   - 💳 **Pay with Card/UPI** (Razorpay) - for fiat currency
   - ₿ **Pay with Crypto** (Bitpay) - for Bitcoin, Ethereum, etc.

3. **Payment Processing:**
   
   **Razorpay Flow:**
   - Backend creates Razorpay order
   - Frontend opens Razorpay checkout modal
   - User completes payment
   - Payment is verified via signature
   - Order status updated to "completed"

   **Bitpay Flow:**
   - Backend creates Bitpay invoice
   - User redirected to Bitpay payment page (or modal)
   - User sends cryptocurrency
   - Bitpay webhook notifies backend when payment confirmed
   - Order status updated to "completed"

### Backend API Endpoints

Created endpoints:
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/razorpay/webhook` - Razorpay webhook handler
- `POST /api/payments/bitpay/create-invoice` - Create Bitpay invoice
- `GET /api/payments/bitpay/invoice/{id}` - Get Bitpay invoice status
- `POST /api/payments/bitpay/webhook` - Bitpay IPN handler

---

## 🧪 Testing Your Integration

### Test Razorpay Payments

1. **Use Test Cards** (in test mode):
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - OTP: `123456` or any 6 digits

2. **Test UPI**:
   - UPI ID: `success@razorpay`

More test credentials: https://razorpay.com/docs/payments/payments/test-card-details/

### Test Bitpay Payments

1. **Get Testnet Bitcoin**:
   - Create a testnet wallet (BitPay wallet supports testnet)
   - Get free testnet BTC from: https://faucet.testnet4.dev/

2. **Make Test Payment**:
   - Create an invoice through your app
   - Use testnet Bitcoin to pay the invoice
   - Invoice status will update from `new` → `paid` → `confirmed` → `complete`

---

## 🔒 Security Best Practices

1. **Never expose secrets in frontend code**
   - API secrets stay in backend `.env` only
   - Frontend only gets `RAZORPAY_KEY_ID` (public key)

2. **Verify all payments on backend**
   - Razorpay: Verify signature before fulfilling order
   - Bitpay: Always re-fetch invoice status (IPNs are not signed)

3. **Use HTTPS in production**
   - Required for webhooks
   - Required for PCI compliance

4. **Implement idempotent webhook handlers**
   - Webhooks may be sent multiple times
   - Check order status before updating

---

## 📊 Database Collections

Payment records are stored in MongoDB:

```javascript
// payments collection
{
  order_id: "uuid",
  payment_gateway: "razorpay" | "bitpay",
  
  // Razorpay fields
  razorpay_order_id: "order_xxx",
  razorpay_payment_id: "pay_xxx",
  
  // Bitpay fields
  bitpay_invoice_id: "xxx",
  bitpay_url: "https://bitpay.com/invoice?id=xxx",
  
  amount: 12.99,
  currency: "USD",
  status: "created" | "paid" | "confirmed" | "complete" | "failed",
  customer_email: "user@example.com",
  created_at: "ISO timestamp",
  updated_at: "ISO timestamp"
}
```

---

## 🛠️ Next Steps for Full Frontend Integration

To complete the integration, you'll need to:

1. **Update Checkout Component** to show payment method selection
2. **Integrate Razorpay Checkout** modal
3. **Integrate Bitpay** payment flow
4. **Handle payment callbacks** and show success/failure messages

I can help you implement these frontend components once you've added your API keys!

---

## ❓ Troubleshooting

### "Razorpay not configured" error
- Make sure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `/app/backend/.env`
- Restart backend: `sudo supervisorctl restart backend`

### "Bitpay not configured" error
- Make sure `BITPAY_TOKEN` is set in `/app/backend/.env`
- Restart backend: `sudo supervisorctl restart backend`

### Razorpay test payments not working
- Verify you're using test keys (starting with `rzp_test_`)
- Use test card details from Razorpay documentation

### Bitpay invoices not creating
- Check if `BITPAY_BASE_URL` is correct (`https://test.bitpay.com` for testing)
- Verify token is valid in Bitpay dashboard

---

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Bitpay Docs**: https://developer.bitpay.com/
- **Razorpay Support**: support@razorpay.com
- **Bitpay Support**: https://support.bitpay.com/

---

**Status**: ✅ Backend payment infrastructure ready! Add your API keys and I'll help you complete the frontend integration.
