import { Product } from "@/types";

// Using DummyJSON — much more reliable than FakeStoreAPI on cloud platforms like Vercel.
// DummyJSON has the same product data (electronics, clothing, etc.) and never blocks
// server-side fetches from Vercel, Netlify, or any other platform.
const API = "https://dummyjson.com";

// DummyJSON product shape differs slightly from our internal Product type.
// We normalise it here so the rest of the app never needs to know about DummyJSON.
interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  discountPercentage?: number;
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

function normalise(p: DummyProduct): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.thumbnail,          // DummyJSON uses 'thumbnail', we use 'image'
    rating: {
      rate: p.rating,            // DummyJSON rating is a plain number
      count: p.stock,            // use stock as the review count proxy
    },
    brand: p.brand,
    stock: p.stock,
    discountPercentage: p.discountPercentage,
    images: p.images,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products?limit=100&skip=0`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetchProducts failed: ${res.status}`);
  const data: DummyProductsResponse = await res.json();
  return data.products.map(normalise);
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetchProduct failed: ${res.status}`);
  const data: DummyProduct = await res.json();
  return normalise(data);
}

export async function fetchCategories(): Promise<string[]> {
  // DummyJSON /products/category-list returns a plain string array
  const res = await fetch(`${API}/products/category-list`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetchCategories failed: ${res.status}`);
  return res.json();
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await fetch(
    `${API}/products/category/${encodeURIComponent(category)}?limit=100`,
    { cache: "no-store" }
  );
  if (!res.ok)
    throw new Error(`fetchProductsByCategory failed: ${res.status}`);
  const data: DummyProductsResponse = await res.json();
  return data.products.map(normalise);
}



export const API_BASE_URL =
  "https://staging-backend.thebobproject.co/api";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};