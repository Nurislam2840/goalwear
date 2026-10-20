# GoalWear — Premium Football E-commerce Theme

A production-ready, feature-rich e-commerce theme for football gear, built with Next.js 16, Supabase, and Stripe.

![GoalWear](https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop)

[![Version](https://img.shields.io/badge/version-1.1.0-CCFF00?style=flat-square)](https://themes-store.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

### 🛍️ Storefront
- Modern, mobile-first responsive design
- Dark & Light mode
- Dynamic Hero slider with countdown offers
- **Brand logos & dedicated brand sections**
- Product search with smart suggestions
- Advanced filters (price, brand, category)
- **Product variants** (Home / Away / Third / Goalkeeper)
- Quick view modal
- Wishlist
- Cart with quantity controls & live stock updates
- Coupon system (percent / fixed / shipping)
- **Stripe Card Payments + Cash on Delivery (COD)**
- **Secure Stripe Webhook integration**
- **3D Animated Order Tracking System** (Truck, Plane, Ship)
- User accounts (Supabase Auth with Cookie-based sessions)
- **Real product reviews with image upload support**
- **Admin Review Moderation** (Approve/Delete)
- **Dynamic delivery time estimates per product**
- Recently viewed products
- Instagram gallery
- Newsletter signup
- WhatsApp floating button

### 🎛️ Admin Panel (13 Sections)
- **Dashboard** with revenue chart & top products
- **Products** — full CRUD with advanced fields (including Delivery Time)
- **Orders** — status management & shipping method selection
- **Reviews** — moderate customer reviews (Approve/Pending)
- **Hero Slider** — homepage carousel with image upload
- **Offers** — flash sales with countdown
- **Categories** — product categories (Includes Cricket Jersey)
- **Brands** — brand management with logo upload
- **Teams** — popular teams
- **Testimonials** — customer reviews
- **Features** — feature badges
- **Coupons** — discount codes
- **Site Settings** — name, logo, contact, social, **New Arrivals selector**

### 🔒 Security & Performance
- **Supabase Row Level Security (RLS)** enabled on all tables
- **Secure Cookie-based Admin Session** (HttpOnly, Secure)
- **Rate limiting** on admin login
- **Server-side price & stock verification** on checkout
- **Atomic Stock Reduction** via PostgreSQL Functions
- **IDOR protection** on orders (no header spoofing)
- **Timing-safe password comparison**
- **Supabase Storage** integration for image uploads (replaces Base64)
- Optimized database indexing for fast data fetching
- IPv4-first DNS (mobile network support)

### ⚙️ Technical Stack
- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (Checkout + Webhooks)
- SEO optimized (sitemap, robots, OpenGraph)
- Vercel-ready

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in .env.local with your credentials
# (see Documentation.html for detailed instructions)

# 4. Run development server
npm run dev

# 5. Open http://127.0.0.1:3000