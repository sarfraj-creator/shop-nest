"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { CartItem } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, truncate } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  function handleRemove() {
    removeItem(item.id);
    toast.success("Item removed");
  }

  return (
    <div className="flex gap-4 py-5">
      {/* Thumbnail */}
      <Link
        href={`/products/${item.id}`}
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-2"
      >
        <Image
          src={item.image}
          alt={item.title}
          width={80}
          height={80}
          className="h-full w-full object-contain"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${item.id}`}
              className="text-sm font-semibold leading-snug text-slate-800 transition-colors hover:text-indigo-600"
            >
              {truncate(item.title, 60)}
            </Link>
            <p className="mt-0.5 text-xs capitalize text-slate-500">
              {item.category}
            </p>
          </div>
          <button
            onClick={handleRemove}
            aria-label="Remove item"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Qty + price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiMinus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 select-none text-center text-sm font-semibold text-slate-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-slate-600 transition-colors hover:bg-slate-100"
            >
              <FiPlus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-900">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
