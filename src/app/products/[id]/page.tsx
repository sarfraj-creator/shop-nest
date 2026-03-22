import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { fetchProduct } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "./ProductActions";

// Pure SSR — fetch fresh from API on every single request
// No static generation, no build-time fetching, no edge runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const product = await fetchProduct(Number(params.id));
    return {
      title: `${product.title} — ShopNest`,
      description: product.description.slice(0, 150),
    };
  } catch {
    return { title: "Product — ShopNest" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const id = Number(params.id);

  // Validate the id param first
  if (!params.id || isNaN(id) || id <= 0) {
    notFound();
  }

  let product;
  try {
    product = await fetchProduct(id);
  } catch (err) {
    // API failed — show a friendly error instead of a generic 404
    // This distinguishes "product doesn't exist" from "API is down"
    console.error("Failed to fetch product:", err);
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <div className="text-5xl">😕</div>
        <h1 className="text-xl font-bold text-slate-900">
          Could not load product
        </h1>
        <p className="text-sm text-slate-500">
          We had trouble fetching this product. Please try again.
        </p>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-indigo-600"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product image */}
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10">
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            className="h-80 w-full object-contain"
            priority
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="mb-3 w-fit capitalize">
            {product.category}
          </Badge>

          <h1 className="mb-3 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
            {product.title}
          </h1>

          <div className="mb-4 flex items-center gap-3">
            <StarRating
              rating={product.rating.rate}
              count={product.rating.count}
              size="md"
            />
            <span className="text-sm text-slate-500">
              {product.rating.rate} out of 5
            </span>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.price * 1.2)}
            </span>
            <Badge variant="success" className="ml-1">
              17% OFF
            </Badge>
          </div>

          {/* Client-side cart / wishlist buttons */}
          <ProductActions product={product} />

          {/* Trust signals */}
          <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>✓ Free shipping on orders over $50</li>
              <li>✓ 30-day hassle-free returns</li>
              <li>✓ Secure, encrypted checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
