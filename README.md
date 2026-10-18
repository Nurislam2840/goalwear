# GoalWear — Premium Football E-commerce Theme

A production-ready, feature-rich e-commerce theme for football gear, built with Next.js 16, Supabase, and Stripe.

![GoalWear](https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop)

[![Version](https://img.shields.io/badge/version-1.0.0-CCFF00?style=flat-square)](https://themes-store.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

### 🛍️ Storefront
- Modern, mobile-first responsive design
- Dark & Light mode
- Hero slider with dynamic countdown offers
- **Brand logos & dedicated brand sections**
- Product search with smart suggestions
- Advanced filters (price, brand, category)
- **Product variants** (Home / Away / Third / Goalkeeper)
- Quick view modal
- Wishlist
- Cart with quantity controls & live stock updates
- Coupon system (percent / fixed / shipping)
- Stripe card payments + Cash on Delivery
- Order tracking with status timeline
- User accounts (Supabase Auth)
- **Real product reviews with image upload support**
- **Dynamic delivery time estimates per product**
- Recently viewed products
- Instagram gallery
- Newsletter signup
- WhatsApp floating button

### 🎛️ Admin Panel (13 Sections)
- **Dashboard** with revenue chart & top products
- **Products** — full CRUD with advanced fields (including Delivery Time)
- **Orders** — status management
- **Reviews** — moderate customer reviews & delete inappropriate ones
- **Hero Slider** — homepage carousel with image upload
- **Offers** — flash sales with countdown
- **Categories** — product categories with images
- **Brands** — brand management with logo upload
- **Teams** — popular teams
- **Testimonials** — customer reviews
- **Features** — feature badges
- **Coupons** — discount codes
- **Site Settings** — name, logo, contact, social, **New Arrivals selector**

### 🔒 Security
- Cookie-based admin session (HttpOnly, Secure)
- Rate limiting on login (5 attempts / 15 min)
- Server-side price verification on checkout
- **Automatic stock reduction upon successful order**
- IDOR protection on orders (no header spoofing)
- Supabase Auth (bcrypt password hashing)
- Environment-based credentials (no hardcoded secrets)

### ⚙️ Technical
- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth)
- Stripe (Checkout + Coupons)
- IPv4-first DNS (mobile network support)
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