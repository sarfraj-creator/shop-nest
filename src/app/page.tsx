import Link from "next/link";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";

// Pure SSR — no static generation, always fetch live from API on each request
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

async function getFeaturedProducts() {
  try {
    const products = await fetchProducts();
    return [...products]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 8);
  } catch {
    return [];
  }
}

const perks = [
  { icon: FiTruck, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: FiShield, title: "Secure Payments", desc: "100% protected transactions" },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "30-day hassle-free returns" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
              New Arrivals Are Here
            </span>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Shop smarter,{" "}
              <span className="text-indigo-600">live better.</span>
            </h1>
            <p className="mb-8 text-lg text-slate-500">
              Discover thousands of products across all categories. Quality you
              can trust, prices you&apos;ll love.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse All Products
                  <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/products">Shop Electronics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Perks bar */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Top Rated Products</h2>
            <p className="mt-1 text-sm text-slate-500">
              Handpicked based on customer ratings
            </p>
          </div>
          <Button variant="ghost" asChild className="text-indigo-600 hover:text-indigo-700">
            <Link href="/products">
              View all <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 py-20 text-center">
            <p className="text-sm font-medium text-slate-500">
              Unable to load products right now.
            </p>
            <p className="text-xs text-slate-400">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        )}
      </section>

      {/* CTA banner */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to find something you&apos;ll love?
          </h2>
          <p className="mt-3 text-indigo-200">
            Explore our full catalogue and find your next favourite item.
          </p>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="mt-6 border-white bg-transparent text-white hover:bg-white hover:text-indigo-600"
          >
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
