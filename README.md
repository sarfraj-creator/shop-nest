# ShopNest — Next.js E-Commerce App

A full-featured e-commerce web application built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

---

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Step 1 — Push to GitHub

```bash
# Inside the ecommerce-app folder:

git init
git add .
git commit -m "feat: initial shopnest ecommerce app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shopnest.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `shopnest` repo
3. Leave all settings as default — Vercel auto-detects Next.js
4. **No environment variables needed** — leave that section empty
5. Click **Deploy**

---

## Vercel Settings (leave all as default)

| Setting | Value |
|---|---|
| Framework Preset | Next.js (auto-detected) |
| Root Directory | `./` |
| Build Command | `next build` (default) |
| Output Directory | Next.js default |
| Install Command | `npm install` (default) |
| Environment Variables | **None required** |

---

## Environment Variables

**None needed.** This project uses [Fake Store API](https://fakestoreapi.com) — completely free and public, no API key required.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand + persist | Cart & Wishlist state (localStorage) |
| react-hot-toast | Toast notifications |
| react-icons | Icons |
| Fake Store API | Product data |

---

## Features

- Product listing with category filter + search
- Product detail page (SSG pre-built at deploy time)
- Shopping cart — add, remove, update qty, free shipping over $50
- Wishlist — toggle, move to cart
- Checkout form with validation
- Order success confirmation
- Full localStorage persistence for cart and wishlist
- Loading skeletons, error states, empty states, 404 page
- Fully responsive (mobile, tablet, desktop)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Homepage
│   ├── not-found.tsx
│   ├── products/
│   │   ├── page.tsx              # Product listing
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx          # Product detail (SSG)
│   │       └── ProductActions.tsx
│   ├── cart/page.tsx
│   ├── wishlist/page.tsx
│   ├── checkout/page.tsx
│   └── order-success/page.tsx
├── components/
│   ├── layout/                   # Navbar, Footer
│   ├── product/                  # ProductCard, ProductGrid, CategoryFilter
│   ├── cart/                     # CartItemRow, CartSummary
│   ├── checkout/                 # CheckoutForm
│   ├── wishlist/                 # WishlistCard
│   └── ui/                       # Button, Badge, Input, Label, Skeleton, StarRating
├── hooks/
│   └── useHydration.ts           # Fixes SSR/localStorage hydration mismatch
├── store/
│   ├── cartStore.ts              # Zustand cart (persisted to localStorage)
│   └── wishlistStore.ts          # Zustand wishlist (persisted to localStorage)
├── lib/
│   ├── api.ts                    # Fake Store API fetch functions
│   └── utils.ts                  # cn(), formatPrice(), truncate()
└── types/index.ts
```

---

## API

**Base URL:** `https://fakestoreapi.com`

| Endpoint | Used For |
|---|---|
| `GET /products` | All products |
| `GET /products/:id` | Single product detail |
| `GET /products/categories` | Category list for filter |
| `GET /products/category/:name` | Products by category |

No authentication or API key required.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```
