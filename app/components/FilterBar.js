"use client";

import { SORT_OPTIONS } from "../lib/constants";

export default function FilterBar({
  filters,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:rounded-[2rem] md:p-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
        {filters.map((filter) => {
          const active = filter.value === selectedCategory;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onCategoryChange(filter.value)}
              className={`shrink-0 rounded-full px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                active
                  ? "bg-accent text-ink shadow-[0_10px_30px_rgba(255,107,53,0.25)]"
                  : "border border-white/10 bg-black/20 text-white/75 hover:border-white/25 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="inline-flex self-start rounded-full border border-white/10 bg-black/20 p-1">
        {SORT_OPTIONS.map((option) => {
          const active = option.value === selectedSort;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSortChange(option.value)}
              className={`rounded-full px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                active ? "bg-white text-ink" : "text-white/70 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
