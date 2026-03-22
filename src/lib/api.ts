import { Product } from "@/types";

const API = "https://fakestoreapi.com";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Product not found: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API}/products/categories`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await fetch(
    `${API}/products/category/${encodeURIComponent(category)}`,
    { cache: "no-store" }
  );
  if (!res.ok)
    throw new Error(`Failed to fetch category products: ${res.status}`);
  return res.json();
}
