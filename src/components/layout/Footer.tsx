import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";

// Use a fixed year or suppress hydration warning with suppressHydrationWarning
// The cleanest approach: compute year server-side in a server component (this is one)
const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <HiOutlineShoppingBag className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold text-slate-900">
              Shop<span className="text-indigo-600">Nest</span>
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link
              href="/"
              className="transition-colors hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-indigo-600"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="transition-colors hover:text-indigo-600"
            >
              Cart
            </Link>
            <Link
              href="/wishlist"
              className="transition-colors hover:text-indigo-600"
            >
              Wishlist
            </Link>
          </nav>

          <p className="text-sm text-slate-400">
            © {year} ShopNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
