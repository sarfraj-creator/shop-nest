"use client";

import Link from "next/link";
import {
  useCartStore,
  selectSubtotal,
  selectTotal,
  selectShipping,
} from "@/store/cartStore";
import { useHydration } from "@/hooks/useHydration";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  showCheckoutBtn?: boolean;
}

export function CartSummary({ showCheckoutBtn = true }: CartSummaryProps) {
  const hydrated = useHydration();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const total = useCartStore(selectTotal);
  const shipping = useCartStore(selectShipping);

  // Total item count
  const itemQty = items.reduce((s, i) => s + i.quantity, 0);
  const freeShippingLeft = subtotal >= 50 ? 0 : 50 - subtotal;
  const progressPct = Math.min((subtotal / 50) * 100, 100);

  // Show skeleton until hydrated — prevents mismatch on dynamic numbers
  if (!hydrated) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-px w-full bg-slate-100" />
          <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
        </div>
        {showCheckoutBtn && (
          <div className="mt-5 h-11 w-full animate-pulse rounded-lg bg-slate-200" />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Order Summary
      </h2>

      {/* Free shipping progress */}
      {freeShippingLeft > 0 && (
        <div className="mb-4 rounded-lg bg-indigo-50 p-3">
          <p className="text-xs text-indigo-700">
            Add{" "}
            <span className="font-semibold">
              {formatPrice(freeShippingLeft)}
            </span>{" "}
            more for free shipping!
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {subtotal >= 50 && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-700">
            🎉 You qualify for free shipping!
          </p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>
            Subtotal ({itemQty} {itemQty === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-slate-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span
            className={
              shipping === 0
                ? "font-medium text-emerald-600"
                : "font-medium text-slate-800"
            }
          >
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>

        <div className="my-3 border-t border-slate-100" />

        <div className="flex justify-between text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {showCheckoutBtn && (
        <>
          <Button asChild className="mt-5 w-full" size="lg">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="mt-2 w-full text-slate-500"
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </>
      )}
    </div>
  );
}
