import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (id: number) => void;
  has: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },

      remove: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      // NOTE: Don't call has() inside a zustand selector - use selectIsWishlisted instead
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "shopnest-wishlist" }
  )
);

// Safe selector for use in components
export const selectIsWishlisted = (id: number) => (state: WishlistState) =>
  state.items.some((i) => i.id === id);
