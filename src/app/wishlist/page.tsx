"use client";

import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHydration } from "@/hooks/useHydration";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const hydrated = useHydration();
  const items = useWishlistStore((s) => s.items);

  // Show skeleton until localStorage is read
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <FiHeart className="h-9 w-9 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Your wishlist is empty
        </h2>
        <p className="text-sm text-slate-500">
          Tap the heart icon on any product to save it here for later.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/products">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          My Wishlist{" "}
          <span className="text-base font-normal text-slate-500">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Items you've saved for later
        </p>
      </div>

      <div className="space-y-3">
        {items.map((product) => (
          <WishlistCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
