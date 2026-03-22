"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, truncate } from "@/lib/utils";

interface WishlistCardProps {
  product: Product;
}

export function WishlistCard({ product }: WishlistCardProps) {
  const remove = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.addItem);

  function handleRemove() {
    remove(product.id);
    toast.success("Removed from wishlist");
  }

  function handleMoveToCart() {
    addToCart(product);
    remove(product.id);
    toast.success("Moved to cart!");
  }

  return (
    <div className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
      {/* Product image */}
      <Link
        href={`/products/${product.id}`}
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2"
      >
        <Image
          src={product.image}
          alt={product.title}
          width={80}
          height={80}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${product.id}`}
              className="text-sm font-semibold leading-snug text-slate-800 transition-colors hover:text-indigo-600"
            >
              {truncate(product.title, 60)}
            </Link>
            <p className="mt-0.5 text-xs capitalize text-slate-500">
              {product.category}
            </p>
            <StarRating
              rating={product.rating.rate}
              count={product.rating.count}
              size="sm"
              className="mt-1"
            />
          </div>
          <button
            onClick={handleRemove}
            aria-label="Remove from wishlist"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-bold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" onClick={handleMoveToCart} className="gap-1.5">
            <FiShoppingCart className="h-3.5 w-3.5" />
            Move to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
