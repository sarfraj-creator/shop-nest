"use client";

import Link from "next/link";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useHydration } from "@/hooks/useHydration";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const hydrated = useHydration();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  function handleClearCart() {
    clearCart();
    toast.success("Cart cleared");
  }

  // Show loading skeleton until store is hydrated from localStorage
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-slate-200 lg:col-span-1" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <FiShoppingCart className="h-9 w-9 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Your cart is empty
        </h2>
        <p className="text-sm text-slate-500">
          Looks like you haven't added anything yet. Start exploring our
          products!
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Shopping Cart{" "}
          <span className="text-base font-normal text-slate-500">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-red-500"
        >
          <FiTrash2 className="h-4 w-4" />
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items list */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
