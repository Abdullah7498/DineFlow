# 🍽️ DineFlow

> Modern multi-tenant restaurant SaaS platform powering POS, QR ordering, kitchen workflow, realtime operations, loyalty rewards, and analytics.

---

## ✨ Overview

DineFlow is a complete cloud-native restaurant ecosystem designed for:

* Restaurants
* Cafes
* Hotels
* Fast Food Chains
* Multi-branch Food Businesses

The platform enables restaurants to manage orders, POS billing, kitchen operations, QR ordering, loyalty systems, inventory, and realtime communication from a single unified system.

---

# 🚀 Core Features

## 📱 Customer Ordering

* QR Code Menu
* Mobile Ordering
* Web Ordering
* Table-based Ordering
* Live Order Tracking
* Cashback & Loyalty Coins

---

## 🧾 POS System

* Dine-in Billing
* Walk-in Orders
* Split Payments
* Merge Tables
* Tax Management
* Receipt Printing
* Refund Support
* Offline Mode

---

## 👨‍🍳 Kitchen Display System (KDS)

* Live Incoming Orders
* Preparation Workflow
* Priority Orders
* Multiple Kitchen Sections
* Preparation Timers
* Realtime Status Updates

---

## 🏪 Restaurant Management

* Multi-branch Support
* Staff Management
* Role-based Access
* Table Management
* Menu Management
* Business Analytics

---

## 📦 Inventory System

* Ingredient Tracking
* Low Stock Alerts
* Inventory Consumption
* Purchase Management

---

## 🎁 Loyalty System

* Coins & Cashback
* Referral Rewards
* Campaign Promotions
* Redeemable Discounts

---

# 🏗️ Architecture

```txt
Frontend Layer
 ├── Admin Dashboard
 ├── POS System
 ├── Kitchen Display
 ├── Customer App
 └── Customer Web Ordering

Backend Layer
 ├── API Gateway
 ├── Authentication Service
 ├── Order Service
 ├── Loyalty Service
 ├── Inventory Service
 ├── Notification Service
 └── Payment Service

Infrastructure
 ├── MongoDB
 ├── Redis
 ├── Socket.IO
 ├── Firebase
 ├── Docker
 └── NGINX
```

---

# ⚡ Tech Stack

| Layer         | Technology               |
| ------------- | ------------------------ |
| Frontend      | React + TailwindCSS      |
| Mobile        | React Native Expo        |
| Backend       | NestJS                   |
| Database      | MongoDB                  |
| Queue         | Redis                    |
| Realtime      | Socket.IO                |
| Notifications | Firebase Cloud Messaging |
| Deployment    | Docker + NGINX           |

---

# 🧠 Monorepo Structure

```txt
apps/
  admin-dashboard/
  customer-app/
  kitchen-display/
  pos-system/
  customer-web/

packages/
  ui/
  shared-types/
  api-sdk/
  utils/

backend/
  auth/
  orders/
  menu/
  inventory/
  loyalty/
  payments/
  notifications/
```

---

# 🔄 Ordering Workflow

```txt
Customer scans QR
↓
Menu opens
↓
Customer places order
↓
POS receives order
↓
Kitchen receives order
↓
Chef starts preparation
↓
Chef marks prepared
↓
Waiter notified
↓
Order served
↓
Payment completed
↓
Loyalty coins awarded
```

---

# 🔐 Security

* JWT Authentication
* Role-Based Permissions
* Password Hashing
* Audit Logs
* Rate Limiting
* API Encryption

---

# 🌐 Multi-Tenant SaaS

Each restaurant acts as a separate tenant with:

* Separate Branches
* Separate Staff
* Separate Customers
* Separate Menus
* Separate Reports
* Separate Inventory

---

# 📡 Realtime Communication

```txt
POS ↔ Socket.IO ↔ Kitchen Display
             ↕
       Mobile Notifications
```

Every order update syncs instantly across all connected systems.

---

# ✅ Current Backend Progress

The backend currently uses Express, MongoDB/Mongoose, Socket.IO, Redis/BullMQ, JWT auth, tenant-isolated databases, and AWS S3 asset uploads.

## AWS S3 Uploads

Configure these values in `backend/.env`:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=your-dineflow-assets-bucket
AWS_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
```

Available upload APIs:

```txt
POST /api/upload
POST /api/upload/presigned-url
```

## Implemented API Modules

```txt
POST /api/auth/superadmin/setup
POST /api/auth/superadmin/login
POST /api/auth/tenant/register
POST /api/auth/owner/login
POST /api/auth/employee/register
POST /api/auth/employee/login
POST /api/auth/customer/register
POST /api/auth/customer/login

GET  /api/restaurant/branches
POST /api/restaurant/branches
GET  /api/restaurant/tables
POST /api/restaurant/tables
PATCH /api/restaurant/tables/:id/status

GET  /api/menu
POST /api/menu/categories
POST /api/menu/items
PATCH /api/menu/items/:id/availability

POST /api/orders
GET  /api/orders/live
PATCH /api/orders/:id/status

POST /api/pos/create-bill
POST /api/pos/refund

GET  /api/inventory
POST /api/inventory
PATCH /api/inventory/:id/adjust

GET  /api/analytics/dashboard
GET  /api/loyalty/wallet
```

Socket clients should join branch rooms with:

```txt
join_branch(branchId)
```

---

# 📈 Future Roadmap

## Phase 1

* POS
* QR Ordering
* Kitchen Display
* Realtime Orders

## Phase 2

* Loyalty System
* Inventory
* Analytics

## Phase 3

* AI Forecasting
* ERP Integrations
* WhatsApp Ordering
* Self Checkout Kiosks
* Voice Ordering

---

# 🛠️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/dineflow.git
cd dineflow
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

```env
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
FIREBASE_SERVER_KEY=
CLOUDINARY_URL=
```

---

## Run Development Server

```bash
npm run dev
```

---

# 🐳 Docker

```bash
docker-compose up -d
```

---

# 📌 Recommended Infrastructure

* Ubuntu 24.04
* NGINX
* PM2
* MongoDB
* Redis
* Docker
* Cloudflare

---

# 🎨 Branding Direction

| Element         | Recommendation              |
| --------------- | --------------------------- |
| Primary Color   | #2563EB                     |
| Secondary Color | #0F172A                     |
| Accent          | #38BDF8                     |
| Font            | Inter / Satoshi             |
| UI Style        | Modern SaaS + Glassmorphism |

---

# 👨‍💻 Author

Built with ❤️ for modern restaurants and scalable food businesses.
