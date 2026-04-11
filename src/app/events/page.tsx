/**
 * app/events/page.tsx  — Server Component
 *
 * Fix: footer excess space was caused by `min-h-[calc(100vh-64px)]` on
 * the root <main> in layout.tsx pushing the footer to the bottom even on
 * short pages. The events page now fills available height naturally.
 *
 * Pagination preserves all active filter params — page links never lose filters.
 */

import { getEvents } from "@/lib/eventApi";
import EventList from "@/components/events/EventList";
import EventFilters from "@/components/filters/EventFilters";
import MobileFilters from "@/components/filters/MobileFilters";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Swap only the `page` value; preserve every other filter param. */
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
    "min-w-[36px] h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors";
  const active = "bg-black text-white border-black";
  const inactive = "border-gray-200 text-gray-700 hover:bg-gray-50";
  const disabled = "border-gray-100 text-gray-300 cursor-not-allowed";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      {current > 1 ? (
        <a href={pageURL(params, current - 1)} className={`${base} ${inactive} px-3`}>
          ← Prev
        </a>
      ) : (
        <span className={`${base} ${disabled} px-3`}>← Prev</span>
      )}

      {pages.map((p, i) =>
        p === null ? (
          <span key={`e-${i}`} className="h-9 flex items-center px-1 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <a
            key={p}
            href={pageURL(params, p)}
            aria-current={p === current ? "page" : undefined}
            className={`${base} px-3 ${p === current ? active : inactive}`}
          >
            {p}
          </a>
        )
      )}

      {current < total ? (
        <a href={pageURL(params, current + 1)} className={`${base} ${inactive} px-3`}>
          Next →
        </a>
      ) : (
        <span className={`${base} ${disabled} px-3`}>Next →</span>
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
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Mobile filter trigger */}
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
          </div>

          {/* Grid */}
          <EventList events={events} error={error} />

          {/* Pagination */}
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