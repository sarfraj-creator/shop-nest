"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");

  const [filters, setFilters] = useState({
    event_type: searchParams.get("event_type") || "",
    mode_of_event: searchParams.get("mode_of_event") || "",
    registration_type: searchParams.get("registration_type") || "",
  });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    applyFilters({ ...filters, q: debouncedSearch });
  }, [debouncedSearch]);

  const applyFilters = (newFilters: any) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });

    params.set("page", "1");

    router.push(`/events?${params.toString()}`);
  };

  const handleSelect = (key: string, value: string) => {
    const updated = {
      ...filters,
      [key]: filters[key as keyof typeof filters] === value ? "" : value,
    };

    setFilters(updated);
    applyFilters(updated);
  };

  const handleReset = () => {
    setSearch("");
    setFilters({
      event_type: "",
      mode_of_event: "",
      registration_type: "",
    });
    router.push("/events");
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center border-b-[1px] pb-3 mb-2">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={handleReset} className="text-sm text-red-500">
          Reset
        </button>
      </div>

      {/* Search */}
      {/* <div>
        <label className="text-sm font-medium">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full border p-2 rounded mt-1"
        />
      </div> */}

      {/* Event Type */}
      <div className="border-b-[1px] pb-3 mb-2">
        <h3 className="text-sm font-medium mb-2">Event Type</h3>
        <div className="space-y-2">
          {["connect", "elevate"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.event_type === type}
                onChange={() => handleSelect("event_type", type)}
              />
              <span className="capitalize text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className="border-b-[1px] pb-3 mb-2">
        <h3 className="text-sm font-medium mb-2">Mode</h3>
        <div className="space-y-2">
          {["online", "offline"].map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.mode_of_event === mode}
                onChange={() => handleSelect("mode_of_event", mode)}
              />
              <span className="capitalize text-sm">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Registration */}
      <div className="border-b-[1px] pb-3 mb-2">
        <h3 className="text-sm font-medium mb-2">Registration</h3>
        <div className="space-y-2">
          {["free", "paid"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.registration_type === type}
                onChange={() => handleSelect("registration_type", type)}
              />
              <span className="capitalize text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}