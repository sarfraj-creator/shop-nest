import { Product } from "@/types";

const API = "https://fakestoreapi.com";
const TIMEOUT_MS = 8000; // 8 second timeout

// Helper that wraps fetch with a timeout so Vercel doesn't hang forever
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetchWithTimeout(`${API}/products`);
  if (!res.ok) throw new Error(`fetchProducts failed: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetchWithTimeout(`${API}/products/${id}`);
  if (!res.ok) throw new Error(`fetchProduct failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetchWithTimeout(`${API}/products/categories`);
  if (!res.ok) throw new Error(`fetchCategories failed: ${res.status}`);
  return res.json();
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await fetchWithTimeout(
    `${API}/products/category/${encodeURIComponent(category)}`
  );
  if (!res.ok) throw new Error(`fetchProductsByCategory failed: ${res.status}`);
  return res.json();
}
