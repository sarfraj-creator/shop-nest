/**
 * app/events/page.tsx  — Server Component
 *
 * CRITICAL: `export const dynamic = "force-dynamic"` is REQUIRED.
 *
 * Without it, Next.js 14 attempts to statically prerender this page at
 * build time. But `searchParams` (filter/pagination state) only exists at
 * request time — so the build crashes with a prerender error on Vercel.
 *
 * force-dynamic opts this page into SSR on every request, which is correct
 * because the page content changes based on URL filter params.
 */
export const dynamic = "force-dynamic";

import { getEvents } from "@/lib/eventApi";
import EventList from "@/components/events/EventList";
import EventFilters from "@/components/filters/EventFilters";
import MobileFilters from "@/components/filters/MobileFilters";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Swap only `page`; carry every other active filter param forward. */
function pageURL(params: Record<string, string>, page: number): string {
  const p = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v && v.trim() !== "")
    )
  );
  p.set("page", String(page));
  return `/events?${p.toString()}`;
}

/** Compact page range: 1 … 4 [5] 6 … 20 */
function pageRange(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const pages: (number | null)[] = [1];
  if (left > 2) pages.push(null);
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push(null);
  pages.push(total);
  return pages;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  current,
  total,
  params,
}: {
  current: number;
  total: number;
  params: Record<string, string>;
}) {
  if (total <= 1) return null;
  const pages = pageRange(current, total);

  const base =
    "min-w-[36px] h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors px-3";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      {current > 1 ? (
        <a href={pageURL(params, current - 1)} className={`${base} border-gray-200 text-gray-700 hover:bg-gray-50`}>
          ← Prev
        </a>
      ) : (
        <span className={`${base} border-gray-100 text-gray-300 cursor-not-allowed`}>← Prev</span>
      )}

      {pages.map((p, i) =>
        p === null ? (
          <span key={`e-${i}`} className="h-9 flex items-center px-1 text-gray-400 text-sm">…</span>
        ) : (
          <a
            key={p}
            href={pageURL(params, p)}
            aria-current={p === current ? "page" : undefined}
            className={`${base} ${
              p === current
                ? "bg-black text-white border-black"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p}
          </a>
        )
      )}

      {current < total ? (
        <a href={pageURL(params, current + 1)} className={`${base} border-gray-200 text-gray-700 hover:bg-gray-50`}>
          Next →
        </a>
      ) : (
        <span className={`${base} border-gray-100 text-gray-300 cursor-not-allowed`}>Next →</span>
      )}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { events, meta, error } = await getEvents(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-20">
          <EventFilters />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="md:hidden">
              <MobileFilters />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Events</h1>
            {meta && meta.total > 0 && (
              <span className="text-sm text-gray-500">
                {meta.from}–{meta.to} of{" "}
                <span className="font-medium text-gray-700">{meta.total}</span>
              </span>
            )}
          </div>

          <EventList events={events} error={error} />

          {meta && (
            <Pagination
              current={meta.current_page}
              total={meta.last_page}
              params={searchParams}
            />
          )}

          {meta && meta.last_page > 1 && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Page {meta.current_page} of {meta.last_page}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}