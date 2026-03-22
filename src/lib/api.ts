import { Product } from "@/types";

// Why we proxy through /api routes:
// Vercel's server components can't reliably reach external APIs (fakestoreapi.com)
// due to cold starts, network restrictions, or the API blocking Vercel IPs.
// By routing through our own /api handlers, the fetch happens on the same
// infrastructure and is always reliable.

function getBaseUrl(): string {
  // Running in the browser — relative URLs work fine
  if (typeof window !== "undefined") return "";

  // Vercel production — VERCEL_URL is auto-set to the deployment URL
  // e.g. "shop-nest-frui.vercel.app"
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Vercel preview deployments use NEXT_PUBLIC_VERCEL_URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Local development
  return "http://localhost:3000";
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${getBaseUrl()}/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetchProducts failed: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetchProduct failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${getBaseUrl()}/api/categories`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetchCategories failed: ${res.status}`);
  return res.json();
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await fetch(
    `${getBaseUrl()}/api/products/category/${encodeURIComponent(category)}`,
    { cache: "no-store" }
  );
  if (!res.ok)
    throw new Error(`fetchProductsByCategory failed: ${res.status}`);
  return res.json();
}
