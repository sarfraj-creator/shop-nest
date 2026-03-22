"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { Product } from "@/types";
import { fetchProducts, fetchCategories, fetchProductsByCategory } from "@/lib/api";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch categories once on mount
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // fetch products when category changes
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data =
        selectedCategory === "all"
          ? await fetchProducts()
          : await fetchProductsByCategory(selectedCategory);
      setProducts(data);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // client-side search filter on top of category results
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? "Loading…" : `${filtered.length} products found`}
        </p>
      </div>

      {/* search + filter */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={(cat) => {
            setSelectedCategory(cat);
            setSearch("");
          }}
        />
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* error state */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          <button
            onClick={loadProducts}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <ProductGrid products={filtered} loading={loading} />
    </div>
  );
}
