# ShopNest

A full-featured e-commerce web app built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

**Live Demo:** [https://shop-nest-frui.vercel.app](https://shop-nest-frui.vercel.app)

---

## How to Run Locally

**Requirements:** Node.js 18+ and npm

```bash
# 1. Unzip the project and go into the folder
cd ecommerce-app

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> No `.env` file needed. The app uses the free public Fake Store API — no API keys required.

---

## How to Build for Production

```bash
npm run build    # Creates optimised production build
npm start        # Runs the production build locally
```

---

## Git Commands (Push to GitHub)

```bash
# Inside the ecommerce-app folder:

git init
git add .
git commit -m "feat: initial shopnest ecommerce app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shopnest.git
git push -u origin main
```

After pushing — import the repo on [vercel.com/new](https://vercel.com/new) and click **Deploy**. No config needed.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework — SSR + dynamic rendering |
| TypeScript | Full type safety across all files |
| Tailwind CSS | Utility-first CSS styling |
| Zustand + persist | Cart & Wishlist state, persisted to localStorage |
| react-hot-toast | Toast notifications |
| react-icons | Icon library |
| Fake Store API | Free public product data source |

---

## Features

| Feature | Details |
|---|---|
| Product Listing | Browse all products with category filter + live search |
| Product Detail | Full product info, star rating, add to cart & wishlist |
| Shopping Cart | Add, remove, update quantity, free shipping over $50, localStorage persisted |
| Wishlist | Toggle save, move to cart, localStorage persisted |
| Checkout | Form with full validation (name, email, address) + order summary |
| Order Success | Confirmation page after placing order |
| Error Handling | Loading skeletons, empty states, error boundary, 404 page |
| Responsive | Works on mobile, tablet, and desktop |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — Navbar, Footer, Toaster
│   ├── page.tsx                    # Homepage — hero, perks, featured products
│   ├── not-found.tsx               # 404 page
│   ├── products/
│   │   ├── page.tsx                # Product listing (search + category filter)
│   │   ├── loading.tsx             # Skeleton loading state
│   │   ├── error.tsx               # Error boundary
│   │   └── [id]/
│   │       ├── page.tsx            # Product detail page (dynamic SSR)
│   │       └── ProductActions.tsx  # Client — add to cart / wishlist buttons
│   ├── cart/
│   │   └── page.tsx                # Cart page
│   ├── wishlist/
│   │   └── page.tsx                # Wishlist page
│   ├── checkout/
│   │   └── page.tsx                # Checkout page
│   └── order-success/
│       └── page.tsx                # Order confirmation page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky navbar with cart + wishlist badge counts
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx         # Product card with wishlist toggle + add to cart
│   │   ├── ProductGrid.tsx         # Grid wrapper with skeleton + empty state
│   │   └── CategoryFilter.tsx      # Category pill filter buttons
│   ├── cart/
│   │   ├── CartItemRow.tsx         # Cart row — image, qty controls, remove
│   │   └── CartSummary.tsx         # Order summary — subtotal, shipping, total
│   ├── checkout/
│   │   └── CheckoutForm.tsx        # Checkout form with validation
│   ├── wishlist/
│   │   └── WishlistCard.tsx        # Wishlist item with move-to-cart
│   └── ui/
│       ├── button.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       └── star-rating.tsx
│
├── hooks/
│   └── useHydration.ts             # Prevents SSR/localStorage hydration mismatch
│
├── store/
│   ├── cartStore.ts                # Zustand cart store (persisted to localStorage)
│   └── wishlistStore.ts            # Zustand wishlist store (persisted to localStorage)
│
├── lib/
│   ├── api.ts                      # All Fake Store API fetch functions
│   └── utils.ts                    # cn(), formatPrice(), truncate()
│
└── types/
    └── index.ts                    # TypeScript interfaces: Product, CartItem, etc.
```

---

## API Reference

**Base URL:** `https://fakestoreapi.com`

| Endpoint | Used For |
|---|---|
| `GET /products` | Fetch all products (homepage + listing page) |
| `GET /products/:id` | Fetch single product for detail page |
| `GET /products/categories` | Fetch category list for filter |
| `GET /products/category/:name` | Fetch products filtered by category |

No authentication. No API key. Completely free.

---

## Available Scripts

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
```
