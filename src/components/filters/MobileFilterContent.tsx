"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MobileFilterContent({ close }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    event_type: searchParams.get("event_type") || "",
    mode_of_event: searchParams.get("mode_of_event") || "",
    registration_type: searchParams.get("registration_type") || "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", "1");

    router.push(`/events?${params.toString()}`);
    close();
  };

  const handleReset = () => {
    setFilters({
      event_type: "",
      mode_of_event: "",
      registration_type: "",
    });

    router.push("/events");
    close();
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={close}>Close</button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4">

        <select
          value={filters.event_type}
          onChange={(e) => handleChange("event_type", e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Event Type</option>
          <option value="connect">Connect</option>
          <option value="elevate">Elevate</option>
        </select>

        <select
          value={filters.mode_of_event}
          onChange={(e) => handleChange("mode_of_event", e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        <select
          value={filters.registration_type}
          onChange={(e) => handleChange("registration_type", e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Registration</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 pt-4 border-t">

        <button
          onClick={handleReset}
          className="flex-1 border py-2 rounded"
        >
          Reset
        </button>

        <button
          onClick={handleApply}
          className="flex-1 bg-black text-white py-2 rounded"
        >
          Apply
        </button>
      </div>
    </>
  );
}