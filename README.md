# ShopNest

A full-featured e-commerce web app built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

**Live Demo:** [https://shop-nest-frui.vercel.app](https://shop-nest-frui.vercel.app)

---

## How to Run Locally

**Requirements:** Node.js 18+ and npm

```bash
# 1. Go into the project folder
cd ecommerce-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> No `.env` file needed. Uses the free DummyJSON API — no API keys required.


---


## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework — SSR + dynamic rendering |
| TypeScript | Full type safety |
| Tailwind CSS | Utility-first styling |
| Zustand + persist | Cart & Wishlist state with localStorage |
| react-hot-toast | Toast notifications |
| react-icons | Icon library |
| DummyJSON API | Free, reliable product data (no API key needed) |

---

## Features

| Feature | Details |
|---|---|
| Product Listing | Browse with category filter + live search |
| Product Detail | Full info, ratings, add to cart & wishlist |
| Shopping Cart | Add, remove, update qty, free shipping over $50, localStorage persisted |
| Wishlist | Toggle save, move to cart, localStorage persisted |
| Checkout | Form validation, order summary sidebar |
| Order Success | Confirmation page |
| Error Handling | Skeletons, empty states, error boundary, 404 page |
| Responsive | Mobile, tablet, desktop |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Homepage (SSR)
│   ├── not-found.tsx
│   ├── products/
│   │   ├── page.tsx              # Product listing (client — search/filter)
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx          # Product detail (SSR)
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
│   └── useHydration.ts
├── store/
│   ├── cartStore.ts
│   └── wishlistStore.ts
├── lib/
│   ├── api.ts                    # DummyJSON API functions
│   └── utils.ts
└── types/index.ts
```

---

## API Reference

**Base URL:** `https://dummyjson.com`

| Endpoint | Used For |
|---|---|
| `GET /products?limit=100` | All products |
| `GET /products/:id` | Single product detail |
| `GET /products/category-list` | All category names |
| `GET /products/category/:name` | Products by category |

No authentication. No rate limits. Works on all cloud platforms.

---

## Scripts

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm start        # Run production build
npm run lint     # ESLint check
```
