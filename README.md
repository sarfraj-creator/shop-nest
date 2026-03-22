# ShopNest — Next.js E-Commerce App

A full-featured e-commerce web application built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

---

## ⚡ Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/shopnest.git
git push -u origin main
```

### Step 2 — Import on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework will auto-detect as **Next.js**
4. Root Directory: `./` (leave as default)
5. **No environment variables needed** — click Deploy ✓

That's it. The app uses only the free public Fake Store API — no API keys required.

---

## 🔑 Environment Variables

**None required.** This project uses [Fake Store API](https://fakestoreapi.com) which is completely public and free.

If you add a payment gateway later:
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key (optional) |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional) |

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework with SSG + ISR |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Zustand + persist | State with localStorage persistence |
| react-hot-toast | Toast notifications |
| react-icons | Icons |
| Fake Store API | Product data source |

---

## Features

| Feature | Details |
|---|---|
| Product Listing | Browse with category filter + live search |
| Product Detail | Full info, ratings, SSG pre-built at deploy |
| Shopping Cart | Add/remove/qty, free shipping >$50, persisted |
| Wishlist | Toggle save, move to cart, persisted |
| Checkout | Form validation, order summary |
| Order Success | Confirmation page |
| Error Handling | Loading skeletons, empty states, error boundaries |
| Responsive | Mobile, tablet, desktop |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx
│   ├── products/
│   │   ├── page.tsx            # Product listing (client — search/filter)
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx        # Product detail (SSG)
│   │       └── ProductActions.tsx
│   ├── cart/page.tsx
│   ├── wishlist/page.tsx
│   ├── checkout/page.tsx
│   └── order-success/page.tsx
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── product/                # ProductCard, ProductGrid, CategoryFilter
│   ├── cart/                   # CartItemRow, CartSummary
│   ├── checkout/               # CheckoutForm
│   ├── wishlist/               # WishlistCard
│   └── ui/                     # Button, Badge, Input, Label, Skeleton, StarRating
├── hooks/
│   └── useHydration.ts         # Prevents SSR/localStorage hydration mismatch
├── store/
│   ├── cartStore.ts            # Zustand cart (persisted)
│   └── wishlistStore.ts        # Zustand wishlist (persisted)
├── lib/
│   ├── api.ts                  # Fetch helpers
│   └── utils.ts                # cn(), formatPrice(), truncate()
└── types/index.ts
```

---

## API Reference

**Base URL:** `https://fakestoreapi.com`

| Endpoint | Used For |
|---|---|
| `GET /products` | All products (homepage + listing) |
| `GET /products/:id` | Single product detail |
| `GET /products/categories` | Category filter list |
| `GET /products/category/:name` | Filter by category |

No authentication. No rate limits for normal usage.

---

## Build

```bash
npm run build   # Production build
npm start       # Start production server
npm run lint    # ESLint check
```
