"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { useHydration } from "@/hooks/useHydration";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CartSummary } from "@/components/cart/CartSummary";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const hydrated = useHydration();
  const items = useCartStore((s) => s.items);
  const router = useRouter();

  // Only redirect after hydration — items is [] during SSR regardless
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items, router]);

  // Loading state while hydrating
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 h-6 w-28 animate-pulse rounded bg-slate-200" />
        <div className="mb-8 h-8 w-32 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // After hydration, if still empty the redirect above fires
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-indigo-600"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-slate-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          {/* Item list */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Your Items ({items.length})
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-2 text-xs text-slate-600"
                >
                  <span className="flex-1 leading-relaxed">
                    {item.title}{" "}
                    <span className="text-slate-400">× {item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-slate-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <CartSummary showCheckoutBtn={false} />
        </div>
      </div>
    </div>
  );
}
