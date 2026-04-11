

const EVENTS_ENDPOINT =
  "https://staging-backend.thebobproject.co/api/public/v2/event/list";

export interface EventMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface GetEventsResult {
  events: any[];
  meta: EventMeta | null;
  error: string | null;
}

/**
 * Allowlist of valid API params — anything else from Next.js searchParams
 * (internal routing keys, etc.) is silently dropped.
 */
const ALLOWED_PARAMS = new Set([
  "page",
  "per_page",
  "sort",
  "q",
  "event_type",
  "mode_of_event",
  "registration_type",
  "who_can_register",
  "city",
  "state",
  "schedule",
  "start_date",
  "end_date",
  "my_events",
  "my_events_status",
  "brand_id",
  "id",
]);

function buildQuery(raw: Record<string, string | string[]>): URLSearchParams {
  const params = new URLSearchParams();

  // ── Hard defaults (overridable by caller) ─────────────────────────────────
  params.set("page", "1");
  params.set("per_page", "10");
  params.set("sort", "newest");


  // ── Caller params override defaults ───────────────────────────────────────
  for (const [key, val] of Object.entries(raw)) {
    if (!ALLOWED_PARAMS.has(key)) continue;

    const value = Array.isArray(val) ? val[val.length - 1] : val;

    // Strict empty check — sending "" or "  " as a param corrupts API results
    if (!value || value.trim() === "") continue;

    // Only send date range when schedule=custom AND both dates are filled
    if (key === "start_date" || key === "end_date") {
      const schedule = Array.isArray(raw.schedule)
        ? raw.schedule[raw.schedule.length - 1]
        : raw.schedule;
      if (schedule !== "custom") continue;
      // Don't send partial date ranges
      const startDate = Array.isArray(raw.start_date)
        ? raw.start_date[0]
        : raw.start_date;
      const endDate = Array.isArray(raw.end_date)
        ? raw.end_date[0]
        : raw.end_date;
      if (!startDate || !endDate) continue;
    }

    params.set(key, value.trim());
  }

  return params;
}

export async function getEvents(
  searchParams: Record<string, string | string[]>
): Promise<GetEventsResult> {
  try {
    const query = buildQuery(searchParams);
    const url = `${EVENTS_ENDPOINT}?${query.toString()}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[eventApi] ${res.status}`, text.slice(0, 200));
      return { events: [], meta: null, error: `Server error (${res.status})` };
    }

    const json = await res.json();
    const payload = json?.data;

    const events: any[] = Array.isArray(payload?.data) ? payload.data : [];

    const meta: EventMeta = {
      current_page: payload?.current_page ?? 1,
      last_page: payload?.last_page ?? 1,
      per_page: payload?.per_page ?? 10,
      total: payload?.total ?? 0,
      from: payload?.from ?? null,
      to: payload?.to ?? null,
    };

    return { events, meta, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    console.error("[eventApi] fetch failed:", msg);
    return { events: [], meta: null, error: msg };
  }
}