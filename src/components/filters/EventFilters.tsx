"use client";

/**
 * components/filters/EventFilters.tsx  (desktop sidebar)
 *
 * Critical fixes vs previous version:
 * 1. Filter params are only added to URL when they have a real value.
 *    Sending empty strings like city="" corrupts the API query.
 * 2. Search (q) is debounced — no URL push on every keystroke.
 * 3. City / state are plain text inputs that only push when user blurs
 *    (avoids sending partial strings mid-type).
 * 4. who_can_register is no longer set as a default — omitting it
 *    returns all events; defaulting it to "public_users_bob_members"
 *    was hiding BOB-only events.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState {
  q: string;
  event_type: string;
  mode_of_event: string;
  registration_type: string;
  who_can_register: string;
  city: string;
  state: string;
  schedule: string;
  start_date: string;
  end_date: string;
  sort: string;
  my_events: string;
  my_events_status: string;
}

const DEFAULTS: FilterState = {
  q: "",
  event_type: "",
  mode_of_event: "",
  registration_type: "",
  who_can_register: "",
  city: "",
  state: "",
  schedule: "",
  start_date: "",
  end_date: "",
  sort: "newest",
  my_events: "",
  my_events_status: "",
};

// ─── URL helpers ──────────────────────────────────────────────────────────────

function readFromURL(sp: URLSearchParams): FilterState {
  return {
    q: sp.get("q") ?? "",
    event_type: sp.get("event_type") ?? "",
    mode_of_event: sp.get("mode_of_event") ?? "",
    registration_type: sp.get("registration_type") ?? "",
    who_can_register: sp.get("who_can_register") ?? "",
    city: sp.get("city") ?? "",
    state: sp.get("state") ?? "",
    schedule: sp.get("schedule") ?? "",
    start_date: sp.get("start_date") ?? "",
    end_date: sp.get("end_date") ?? "",
    sort: sp.get("sort") ?? "newest",
    my_events: sp.get("my_events") ?? "",
    my_events_status: sp.get("my_events_status") ?? "",
  };
}

/**
 * Build URLSearchParams — only include keys with non-empty values.
 * This is the core fix: empty strings must never reach the API.
 */
function toParams(f: FilterState, page = "1"): URLSearchParams {
  const p = new URLSearchParams();
  p.set("page", page);

  (Object.entries(f) as [keyof FilterState, string][]).forEach(([k, v]) => {
    if (!v || v.trim() === "") return;
    // Don't send date range unless schedule=custom AND both filled
    if ((k === "start_date" || k === "end_date") && f.schedule !== "custom")
      return;
    if ((k === "start_date" || k === "end_date") && (!f.start_date || !f.end_date))
      return;
    p.set(k, v.trim());
  });

  return p;
}

function countActive(f: FilterState): number {
  const skip = new Set<keyof FilterState>(["sort", "q"]);
  return (Object.keys(f) as (keyof FilterState)[]).filter(
    (k) => !skip.has(k) && f[k] !== "" && f[k] !== DEFAULTS[k]
  ).length;
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {title}
      </p>
      {children}
      <hr className="border-gray-100 mt-2" />
    </div>
  );
}

function CheckPill({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <span
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
          checked
            ? "bg-black border-black"
            : "border-gray-300 group-hover:border-gray-500"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="text-sm text-gray-700 capitalize">{label}</span>
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EventFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [filters, setFilters] = useState<FilterState>(() => readFromURL(sp));
  // Local text for city/state — only pushed on blur to avoid partial strings
  const [cityInput, setCityInput] = useState(sp.get("city") ?? "");
  const [stateInput, setStateInput] = useState(sp.get("state") ?? "");

  const debouncedQ = useDebounce(filters.q, 350);
  const isFirstMount = useRef(true);

  // Sync when URL changes externally (browser back/forward)
  useEffect(() => {
    const next = readFromURL(sp);
    setFilters(next);
    setCityInput(next.city);
    setStateInput(next.state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  const push = useCallback(
    (updated: FilterState) => {
      router.push(`/events?${toParams(updated).toString()}`);
    },
    [router]
  );

  // Debounced search push
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    push({ ...filters, q: debouncedQ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const set = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    if (key !== "q") push(updated);
  };

  const toggle = (key: keyof FilterState, value: string) =>
    set(key, filters[key] === value ? "" : value);

  const handleCityBlur = () => {
    const updated = { ...filters, city: cityInput };
    setFilters(updated);
    push(updated);
  };

  const handleStateBlur = () => {
    const updated = { ...filters, state: stateInput };
    setFilters(updated);
    push(updated);
  };

  const handleReset = () => {
    setFilters(DEFAULTS);
    setCityInput("");
    setStateInput("");
    router.push("/events");
  };

  const active = countActive(filters);
  const isCustom = filters.schedule === "custom";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          {active > 0 && (
            <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {active}
            </span>
          )}
        </div>
        {active > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <Section title="Search">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path d="M21 21l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={filters.q}
              onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
              placeholder="Search events…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-gray-400"
            />
          </div>
        </Section>

        {/* Sort */}
        <Section title="Sort By">
          <select
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black/20 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </Section>

        {/* Schedule */}
        <Section title="Schedule">
          <div className="space-y-1.5">
            {(["today", "tomorrow", "this_week", "this_month", "custom"] as const).map((s) => (
              <CheckPill
                key={s}
                label={s.replace(/_/g, " ")}
                checked={filters.schedule === s}
                onChange={() => toggle("schedule", s)}
              />
            ))}
          </div>
          {isCustom && (
            <div className="mt-2 space-y-1.5">
              <div>
                <label className="text-xs text-gray-500 block mb-0.5">Start Date</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-0.5">End Date</label>
                <input
                  type="date"
                  value={filters.end_date}
                  min={filters.start_date || undefined}
                  onChange={(e) => set("end_date", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black/20"
                />
              </div>
            </div>
          )}
        </Section>

        {/* Event Type */}
        <Section title="Event Type">
          <div className="space-y-1.5">
            {(["connect", "elevate"] as const).map((t) => (
              <CheckPill
                key={t}
                label={t}
                checked={filters.event_type === t}
                onChange={() => toggle("event_type", t)}
              />
            ))}
          </div>
        </Section>

        {/* Mode */}
        <Section title="Mode">
          <div className="space-y-1.5">
            {(["online", "offline"] as const).map((m) => (
              <CheckPill
                key={m}
                label={m}
                checked={filters.mode_of_event === m}
                onChange={() => toggle("mode_of_event", m)}
              />
            ))}
          </div>
        </Section>

        {/* Registration */}
        <Section title="Registration">
          <div className="space-y-1.5">
            {(["free", "paid"] as const).map((r) => (
              <CheckPill
                key={r}
                label={r}
                checked={filters.registration_type === r}
                onChange={() => toggle("registration_type", r)}
              />
            ))}
          </div>
        </Section>

        {/* Audience */}
        <Section title="Audience">
          <div className="space-y-1.5">
            <CheckPill
              label="BOB Members Only"
              checked={filters.who_can_register === "only_bob_members"}
              onChange={() => toggle("who_can_register", "only_bob_members")}
            />
            <CheckPill
              label="Public + BOB Members"
              checked={filters.who_can_register === "public_users_bob_members"}
              onChange={() => toggle("who_can_register", "public_users_bob_members")}
            />
          </div>
        </Section>

        {/* Location — push only on blur to avoid partial strings */}
        <Section title="Location">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onBlur={handleCityBlur}
            placeholder="City (e.g. Delhi)"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-gray-400"
          />
          <input
            type="text"
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            onBlur={handleStateBlur}
            placeholder="State (e.g. Delhi)"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-gray-400"
          />
        </Section>

        {/* My Events */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            My Events
          </p>
          <CheckPill
            label="Show my events only"
            checked={filters.my_events === "true"}
            onChange={() =>
              set("my_events", filters.my_events === "true" ? "" : "true")
            }
          />
          {filters.my_events === "true" && (
            <select
              value={filters.my_events_status}
              onChange={(e) => set("my_events_status", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-black/20 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}