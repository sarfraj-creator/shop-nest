"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiHeart, FiMenu, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useState } from "react";
import { useCartStore, selectCartItemCount } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHydration } from "@/hooks/useHydration";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHydration();

  const cartCount = useCartStore(selectCartItemCount);
  const wishCount = useWishlistStore((s) => s.items.length);

  // Before hydration, don't render badges — they'd mismatch SSR (which sees 0)
  const showCartBadge = hydrated && cartCount > 0;
  const showWishBadge = hydrated && wishCount > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HiOutlineShoppingBag className="h-7 w-7 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Shop<span className="text-indigo-600">Nest</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-indigo-600",
                pathname === l.href ? "text-indigo-600" : "text-slate-600"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
          >
            <FiHeart className="h-5 w-5 text-slate-700" />
            {showWishBadge && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
          >
            <FiShoppingCart className="h-5 w-5 text-slate-700" />
            {showCartBadge && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold leading-none text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block py-2.5 text-sm font-medium transition-colors hover:text-indigo-600",
                pathname === l.href ? "text-indigo-600" : "text-slate-700"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
