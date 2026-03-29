"use client";

import { CATEGORY_OPTIONS, getCategoryMeta, getRatingTone } from "../lib/constants";

export default function SpotCard({ spot, featured = false }) {
  const category = CATEGORY_OPTIONS.find((option) => option.value === spot.category);
  const categoryMeta = getCategoryMeta(category?.value || spot.category);
  const tone = getRatingTone(Number(spot.rating));
  const photo = spot.photo_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-panel shadow-2xl ${
        featured ? "mb-4 min-h-[20rem] md:mb-6 md:min-h-[25rem]" : "mb-4 break-inside-avoid md:mb-5"
      }`}
    >
      <div className={`relative ${featured ? "min-h-[20rem] md:min-h-[25rem]" : "min-h-[16.5rem] sm:min-h-[18rem] md:min-h-[22rem]"}`}>
        <img
          src={photo}
          alt={spot.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/90" />

        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-[11px] font-medium text-white backdrop-blur md:left-4 md:top-4 md:text-xs">
          <span aria-hidden="true">{categoryMeta.emoji}</span>
          <span>{categoryMeta.label}</span>
        </div>

        <div
          className="absolute right-3 top-3 rounded-[1.2rem] px-3 py-2 text-right text-white backdrop-blur md:right-4 md:top-4 md:rounded-[1.5rem] md:px-4 md:py-3"
          style={{ backgroundColor: tone.badge }}
        >
          <div className="font-display text-3xl leading-none md:text-4xl">{Number(spot.rating).toFixed(1)}</div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-white/80 md:text-xs md:tracking-[0.28em]">/10</div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h2 className="max-w-xl font-display text-[1.7rem] font-bold leading-tight text-white md:text-3xl">{spot.name}</h2>
          {spot.note ? (
            <p className="mt-2 max-w-2xl text-xs italic leading-5 text-white/80 md:text-sm md:leading-6">{spot.note}</p>
          ) : null}

          {Array.isArray(spot.vibes) && spot.vibes.length ? (
            <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
              {spot.vibes.map((vibe) => (
                <span
                  key={`${spot.id}-${vibe}`}
                  className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white/90 md:px-3 md:text-xs"
                >
                  {vibe}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-3 md:mt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold text-ink md:h-10 md:w-10">
              {spot.added_by.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/45 md:text-xs md:tracking-[0.3em]">Logged by</p>
              <p className="text-sm font-medium text-white">{spot.added_by}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
