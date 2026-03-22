import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { fetchProduct } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "./ProductActions";

// Force dynamic so every request hits the live API — no SSG
// This avoids the build-time fetch failure causing 404s on Vercel
export const dynamic = "force-dynamic";

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

  if (isNaN(id) || id <= 0) {
    notFound();
  }

  let product;
  try {
    product = await fetchProduct(id);
  } catch {
    notFound();
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

          {/* Client buttons */}
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
