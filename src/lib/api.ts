import { Product } from "@/types";

const API = "https://fakestoreapi.com";

// Using cache: "force-cache" with next.revalidate for ISR on Vercel.
// This means Vercel will cache responses and revalidate every hour.
// Works correctly at build time (generateStaticParams) and at runtime.

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Product not found: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API}/products/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await fetch(`${API}/products/category/${encodeURIComponent(category)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch category products: ${res.status}`);
  return res.json();
}
