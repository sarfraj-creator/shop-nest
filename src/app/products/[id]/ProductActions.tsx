"use client";

import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore, selectIsWishlisted } from "@/store/wishlistStore";
import { useHydration } from "@/hooks/useHydration";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const hydrated = useHydration();
  const addToCart = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore(selectIsWishlisted(product.id));

  // Only show filled heart after hydration to avoid SSR mismatch
  const showFilledHeart = hydrated && isWishlisted;

  function handleAddToCart() {
    addToCart(product);
    toast.success("Added to cart!");
  }

  function handleWishlist() {
    toggle(product);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Saved to wishlist"
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button size="lg" onClick={handleAddToCart} className="flex-1 gap-2">
        <FiShoppingCart className="h-5 w-5" />
        Add to Cart
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleWishlist}
        className="gap-2"
      >
        {showFilledHeart ? (
          <>
            <FaHeart className="h-4 w-4 text-rose-500" />
            <span className="text-rose-500">Wishlisted</span>
          </>
        ) : (
          <>
            <FiHeart className="h-4 w-4" />
            Save to Wishlist
          </>
        )}
      </Button>
    </div>
  );
}
