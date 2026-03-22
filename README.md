# ShopNest — Next.js E-Commerce App

A full-featured e-commerce web application built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand + persist | Cart & Wishlist state with localStorage |
| react-hot-toast | Toast notifications |
| react-icons | Icons |
| Fake Store API | Product data |

---

## Features

- **Product Listing** — Browse all products with category filter + live search
- **Product Detail** — Full product info, ratings, add to cart & wishlist
- **Shopping Cart** — Add/remove/update quantity, persisted in localStorage, subtotal + shipping + total
- **Wishlist** — Save products, move to cart, persisted in localStorage
- **Checkout** — Form with validation (name, email, address), order summary sidebar
- **Order Success** — Confirmation page after placing order
- Loading skeletons, error states, empty states, 404 page
- Fully responsive — mobile, tablet, desktop
- Free shipping progress bar (free over $50)

---

## Getting Started

### 1. Clone / unzip the project

```bash
cd shopnest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

---

## API

This app uses the **[Fake Store API](https://fakestoreapi.com)** — a free, open REST API for e-commerce prototypes.

| Endpoint | Usage |
|---|---|
| `GET /products` | Fetch all products |
| `GET /products/:id` | Fetch single product |
| `GET /products/categories` | Fetch all categories |
| `GET /products/category/:name` | Fetch products by category |

No API key required.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar, Footer, Toaster)
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # 404 page
│   ├── products/
│   │   ├── page.tsx            # Product listing with search + filter
│   │   ├── loading.tsx         # Skeleton loading UI
│   │   ├── error.tsx           # Error boundary
│   │   └── [id]/
│   │       ├── page.tsx        # Product detail (SSG)
│   │       └── ProductActions.tsx  # Client: add to cart / wishlist
│   ├── cart/
│   │   └── page.tsx            # Cart page
│   ├── wishlist/
│   │   └── page.tsx            # Wishlist page
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   └── order-success/
│       └── page.tsx            # Order confirmation
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky navbar with cart/wishlist badge
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx     # Product card with wishlist + add to cart
│   │   ├── ProductGrid.tsx     # Grid wrapper with skeleton/empty states
│   │   └── CategoryFilter.tsx  # Category pill filter buttons
│   ├── cart/
│   │   ├── CartItemRow.tsx     # Cart row with qty controls + remove
│   │   └── CartSummary.tsx     # Order summary (reused in cart + checkout)
│   ├── checkout/
│   │   └── CheckoutForm.tsx    # Checkout form with validation
│   ├── wishlist/
│   │   └── WishlistCard.tsx    # Wishlist item card
│   └── ui/                     # Base UI components (shadcn-style)
│       ├── button.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       └── star-rating.tsx
│
├── store/
│   ├── cartStore.ts            # Zustand cart store (localStorage persisted)
│   └── wishlistStore.ts        # Zustand wishlist store (localStorage persisted)
│
├── lib/
│   ├── api.ts                  # All API fetch functions
│   └── utils.ts                # cn(), formatPrice(), truncate()
│
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## Deploy on Vercel

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to a GitHub repo
2. Import the repo on Vercel
3. Click Deploy — no environment variables needed

---

## Notes

- Cart and wishlist data persists in the browser's localStorage automatically
- Product pages are statically generated at build time (`generateStaticParams`)
- Free shipping applies automatically on orders over $50
