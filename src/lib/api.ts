import { Product } from "@/types";

const API = "https://fakestoreapi.com";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API}/products/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await fetch(`${API}/products/category/${category}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
