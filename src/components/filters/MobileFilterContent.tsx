"use client";

/**
 * components/filters/MobileFilterContent.tsx
 * Renders inside the mobile bottom-sheet drawer.
 * Applies filters on tap of "Apply" — no live push while typing.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

/**
 * Build URL params — skip empty/blank values entirely.
 */
function toParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  p.set("page", "1");

  (Object.entries(f) as [keyof FilterState, string][]).forEach(([k, v]) => {
    if (!v || v.trim() === "") return;
    if ((k === "start_date" || k === "end_date") && f.schedule !== "custom") return;
    if ((k === "start_date" || k === "end_date") && (!f.start_date || !f.end_date)) return;
    p.set(k, v.trim());
  });

  return p;
}

export default function MobileFilterContent({ close }: { close: () => void }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [f, setF] = useState<FilterState>({
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
  });

  const set = (k: keyof FilterState, v: string) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const toggle = (k: keyof FilterState, v: string) =>
    set(k, f[k] === v ? "" : v);

  const handleApply = () => {
    router.push(`/events?${toParams(f).toString()}`);
    close();
  };

  const handleReset = () => {
    router.push("/events");
    close();
  };

  const isCustom = f.schedule === "custom";

  const SelField = ({
    label,
    field,
    opts,
  }: {
    label: string;
    field: keyof FilterState;
    opts: { label: string; value: string }[];
  }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">
        {label}
      </label>
      <select
        value={f[field]}
        onChange={(e) => set(field, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black/20"
      >
        <option value="">All</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0 border-b border-gray-100 pb-3">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        <button
          onClick={close}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-2">
        {/* Search */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">
            Search
          </label>
          <input
            type="text"
            value={f.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search events…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
          />
        </div>

        <SelField
          label="Sort By"
          field="sort"
          opts={[
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
          ]}
        />

        <SelField
          label="Schedule"
          field="schedule"
          opts={[
            { label: "Today", value: "today" },
            { label: "Tomorrow", value: "tomorrow" },
            { label: "This Week", value: "this_week" },
            { label: "This Month", value: "this_month" },
            { label: "Custom Range", value: "custom" },
          ]}
        />

        {isCustom && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-0.5">Start</label>
              <input
                type="date"
                value={f.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-0.5">End</label>
              <input
                type="date"
                value={f.end_date}
                min={f.start_date || undefined}
                onChange={(e) => set("end_date", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
              />
            </div>
          </div>
        )}

        <SelField
          label="Event Type"
          field="event_type"
          opts={[
            { label: "Connect", value: "connect" },
            { label: "Elevate", value: "elevate" },
          ]}
        />

        <SelField
          label="Mode"
          field="mode_of_event"
          opts={[
            { label: "Online", value: "online" },
            { label: "Offline", value: "offline" },
          ]}
        />

        <SelField
          label="Registration"
          field="registration_type"
          opts={[
            { label: "Free", value: "free" },
            { label: "Paid", value: "paid" },
          ]}
        />

        <SelField
          label="Audience"
          field="who_can_register"
          opts={[
            { label: "BOB Members Only", value: "only_bob_members" },
            { label: "Public + BOB Members", value: "public_users_bob_members" },
          ]}
        />

        {/* Location */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">
              City
            </label>
            <input
              type="text"
              value={f.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="e.g. Delhi"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">
              State
            </label>
            <input
              type="text"
              value={f.state}
              onChange={(e) => set("state", e.target.value)}
              placeholder="e.g. Delhi"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
            />
          </div>
        </div>

        {/* My Events */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">
            My Events
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={f.my_events === "true"}
              onChange={() =>
                set("my_events", f.my_events === "true" ? "" : "true")
              }
              className="w-4 h-4 accent-black"
            />
            <span className="text-sm text-gray-700">Show my events only</span>
          </label>
          {f.my_events === "true" && (
            <select
              value={f.my_events_status}
              onChange={(e) => set("my_events_status", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-1 focus:ring-black/20 bg-white"
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

      {/* Footer */}
      <div className="flex gap-3 pt-3 border-t border-gray-100 flex-shrink-0 mt-2">
        <button
          onClick={handleReset}
          className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Apply
        </button>
      </div>
    </>
  );
}