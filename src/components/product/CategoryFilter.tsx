"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (cat: string) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  const all = ["all", ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-all",
            selected === cat
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
