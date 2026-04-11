"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import MobileFilterContent from "./MobileFilterContent";

export default function MobileFilters() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border px-4 py-2 rounded"
      >
        <FiFilter /> Filters
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Content */}
          <div className="absolute bottom-0 w-full h-[70%] bg-white rounded-t-2xl p-4 flex flex-col">

            <MobileFilterContent close={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}