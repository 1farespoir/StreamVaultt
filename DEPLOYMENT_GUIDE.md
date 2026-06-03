# 🚀 StreamVault Deployment Guide - Go Live Checklist

## ✅ Pre-Deployment Checklist (Completed)

Your app passed all deployment checks:
- ✅ No hardcoded URLs or secrets
- ✅ Environment variables properly configured
- ✅ CORS configured correctly
- ✅ Database ready for production
- ✅ No compilation errors

---

## 📋 Step-by-Step Deployment Process

### **STEP 1: Save Your Code to GitHub** ⭐ MOST IMPORTANT

Your code is currently only in the Emergent preview environment. To deploy and keep your work safe:

1. **Save to GitHub** (Recommended - FREE):
   - Look for the **"Save to GitHub"** button in your Emergent chat interface
   - OR use the **GitHub icon** in the left sidebar
   - Click it and follow the prompts to:
     - Create a new repository OR
     - Push to existing repository
   - This will save all your code to your GitHub account

2. **What Gets Saved**:
   - All your code (frontend + backend)
   - Configuration files
   - Everything except `.env` files (for security)

**⚠️ CRITICAL**: Do this BEFORE deployment. If you don't save to GitHub, you might lose your work!

---

### **STEP 2: Set Up Production Database (MongoDB Atlas)**

Your current MongoDB is local. For production, use MongoDB Atlas (FREE tier available):

1. **Create MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required for free tier)

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select a cloud provider and region (choose closest to your users)
   - Cluster name: `streamvault-prod`
   - Click "Create"

3. **Set Up Database Access**:
   - Go to "Database Access" (left menu)
   - Click "Add New Database User"
   - Username: `streamvault_admin`
   - Password: Generate a strong password (SAVE THIS!)
   - Database User Privileges: "Atlas Admin"
   - Click "Add User"

4. **Set Up Network Access**:
   - Go to "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://streamvault_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - SAVE THIS CONNECTION STRING - You'll need it!

---

### **STEP 3: Get Production Payment API Keys**

#### Razorpay Production Keys:

1. **Complete KYC on Razorpay**:
   - Log into https://dashboard.razorpay.com
   - Complete business verification
   - Submit required documents

2. **Switch to Live Mode**:
   - Toggle from "Test Mode" to "Live Mode" in dashboard
   - Go to Settings → API Keys → "Generate Live Keys"
   - Copy your **Live Key ID** and **Live Key Secret**

3. **Setup Live Webhooks**:
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/razorpay/webhook`
   - Copy the webhook secret

#### Bitpay Production Setup:

1. **Complete Merchant Onboarding**:
   - Log into https://bitpay.com (NOT test.bitpay.com)
   - Complete merchant verification
   - Submit business documentation

2. **Get Production Token**:
   - Go to "Payment Tools" → "API Tokens"
   - Create a new "Point of Sale" token
   - Copy the token

---

### **STEP 4: Deploy on Emergent (Recommended - Easiest)**

Emergent provides built-in deployment:

1. **Look for "Deploy" Button**:
   - Check your Emergent interface for a "Deploy" or "Go Live" button
   - OR ask in chat: "I want to deploy this app"

2. **Follow Deployment Wizard**:
   - Choose your domain (e.g., `streamvault.yourdomain.com`)
   - Or use Emergent subdomain initially (e.g., `streamvault.emergent.app`)

3. **Add Environment Variables**:
   During deployment, you'll be asked to set these:

   ```bash
   # Database
   MONGO_URL=your_mongodb_atlas_connection_string
   DB_NAME=streamvault

   # Backend
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

   # Razorpay (PRODUCTION)
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

   # Bitpay (PRODUCTION)
   BITPAY_TOKEN=YOUR_PRODUCTION_TOKEN
   BITPAY_BASE_URL=https://bitpay.com
   BITPAY_NOTIFICATION_URL=https://yourdomain.com/api/payments/bitpay/webhook

   # Frontend
   REACT_APP_BACKEND_URL=https://yourdomain.com/api
   ```

4. **Complete Deployment**:
   - Click "Deploy"
   - Wait 5-10 minutes for deployment
   - You'll get a live URL!

---

### **STEP 5: Alternative Deployment Options**

If you prefer other platforms:

#### **Option A: Vercel (Frontend) + Railway (Backend)**

**Frontend on Vercel**:
1. Go to https://vercel.com
2. Import from GitHub
3. Select your repo
4. Root directory: `/frontend`
5. Build command: `yarn build`
6. Environment variables: Add `REACT_APP_BACKEND_URL`
7. Deploy!

**Backend on Railway**:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Add `/backend` as root
5. Add all environment variables
6. Deploy!

#### **Option B: Full Stack on Railway**
1. Deploy both frontend and backend as separate services
2. Link them via environment variables

#### **Option C: AWS/DigitalOcean/Other Cloud**
- Requires more technical setup
- Need to configure: Nginx, SSL, PM2/Gunicorn, MongoDB, etc.
- Not recommended unless you have DevOps experience

---

### **STEP 6: Connect Your Custom Domain**

After deployment:

1. **Buy a Domain** (if you don't have one):
   - Namecheap, GoDaddy, Google Domains, etc.
   - Recommended: `streamvault.com` or similar

2. **Configure DNS**:
   - Add A record or CNAME pointing to your deployment
   - Your hosting platform (Emergent/Vercel/Railway) will provide DNS settings

3. **Wait for DNS Propagation** (15 mins - 48 hours)

4. **Enable SSL/HTTPS**:
   - Usually automatic on modern platforms
   - Your site should use `https://`

---

### **STEP 7: Seed Production Database**

After deployment, seed your products:

1. **SSH into your backend** (if available) OR
2. **Run seed script via admin panel**:
   - Access: `https://yourdomain.com/admin`
   - Or manually add your first products via admin panel

3. **Verify Data**:
   - Go to `/admin/products`
   - Check if products loaded
   - If not, add them manually

---

### **STEP 8: Test Everything in Production**

**Payment Testing**:
1. Test Razorpay with real card (small amount)
2. Test Bitpay with small crypto amount
3. Verify webhooks are working
4. Check order creation in database

**User Flow Testing**:
1. Browse products
2. Add to cart
3. Complete checkout with both payment methods
4. Verify email delivery (if configured)

**Admin Panel Testing**:
1. Access `/admin`
2. Add a new product
3. Create a deal popup
4. Add testimonial
5. Check orders page

---

### **STEP 9: Monitor and Maintain**

**Set Up Monitoring**:
- Check your hosting platform's logs
- Monitor payment webhook logs
- Set up error alerts

**Database Backups**:
- MongoDB Atlas has automatic backups
- Configure backup schedule in Atlas

**Regular Maintenance**:
- Check for failed payments
- Monitor orders
- Update products via admin panel

---

## 🎯 Quick Start (Recommended Path)

**For Fastest Deployment:**

1. ✅ **Save to GitHub** (5 minutes)
   - Click "Save to GitHub" in Emergent

2. ✅ **Setup MongoDB Atlas** (10 minutes)
   - Free account → Create cluster → Get connection string

3. ✅ **Deploy on Emergent** (10 minutes)
   - Click "Deploy" → Add environment variables → Go live!

4. ✅ **Test** (5 minutes)
   - Visit your live site
   - Test a purchase

**Total Time: ~30 minutes to go live! 🚀**

---

## 📞 Support Resources

**Emergent Support**:
- Ask in chat: "How do I deploy?"
- Support email: support@emergent.sh

**Payment Gateways**:
- Razorpay: support@razorpay.com
- Bitpay: https://support.bitpay.com

**Database**:
- MongoDB Atlas: https://support.mongodb.com

---

## ⚠️ Important Security Notes

**Before Going Live:**
- ✅ Use production API keys (not test keys)
- ✅ Enable HTTPS/SSL
- ✅ Set proper CORS origins (not `*`)
- ✅ Never commit `.env` to Git
- ✅ Use strong database passwords
- ✅ Enable webhook signature verification
- ✅ Regularly update dependencies

---

## 🎉 You're Ready!

Your StreamVault app is fully built and deployment-ready. Just follow these steps and you'll be live!

**Need help with any step? Just ask! 💪**
