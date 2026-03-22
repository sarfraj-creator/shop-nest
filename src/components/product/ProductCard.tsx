"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore, selectIsWishlisted } from "@/store/wishlistStore";
import { useHydration } from "@/hooks/useHydration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hydrated = useHydration();
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  // Use the selector factory — safe for zustand
  const isWishlisted = useWishlistStore(selectIsWishlisted(product.id));

  // Before hydration show the outline heart so SSR and client match
  const showFilledHeart = hydrated && isWishlisted;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    toast.success("Added to cart");
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          aria-label={showFilledHeart ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-transform hover:scale-110"
        >
          {showFilledHeart ? (
            <FaHeart className="h-3.5 w-3.5 text-rose-500" />
          ) : (
            <FiHeart className="h-3.5 w-3.5 text-slate-500" />
          )}
        </button>

        {/* Image */}
        <div className="flex h-52 items-center justify-center bg-white p-6">
          <Image
            src={product.image}
            alt={product.title}
            width={180}
            height={180}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
          <Badge variant="secondary" className="mb-2 w-fit capitalize">
            {product.category}
          </Badge>

          <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-800">
            {product.title}
          </h3>

          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {product.description}
          </p>

          <StarRating
            rating={product.rating.rate}
            count={product.rating.count}
            size="sm"
          />

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-base font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            <Button size="sm" onClick={handleAddToCart} className="gap-1.5">
              <FiShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
