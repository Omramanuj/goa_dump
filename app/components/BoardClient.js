"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import SpotCard from "./SpotCard";
import { FILTER_OPTIONS, PREVIEW_SPOTS } from "../lib/constants";
import { getSupabaseBrowserClient } from "../lib/supabase";

function SkeletonCard({ featured = false }) {
  return (
    <div
      className={`overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 ${
        featured ? "mb-6 h-[25rem]" : "mb-5 h-[22rem] break-inside-avoid"
      }`}
    >
      <div className="h-full w-full animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
    </div>
  );
}

export default function BoardClient() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [toastVisible, setToastVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("added") === "1") {
      setToastVisible(true);

      const timeout = window.setTimeout(() => {
        setToastVisible(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("added");
        window.history.replaceState({}, "", url.pathname + url.search);
      }, 3200);

      return () => window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadSpots() {
      setIsLoading(true);
      setFetchError("");

      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .order("created_at", { ascending: false });

      if (ignore) {
        return;
      }

      if (error) {
        setFetchError(error.message);
        setSpots([]);
      } else {
        setSpots(data || []);
      }

      setIsLoading(false);
    }

    loadSpots();

    return () => {
      ignore = true;
    };
  }, []);

  const boardSpots = spots.length ? spots : PREVIEW_SPOTS;
  const isPreviewBoard = !spots.length && !fetchError;

  const visibleSpots = boardSpots
    .filter((spot) => selectedCategory === "All" || spot.category === selectedCategory)
    .sort((left, right) => {
      if (selectedSort === "top-rated") {
        return Number(right.rating) - Number(left.rating);
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

  let featuredSpot = null;
  let remainingSpots = visibleSpots;

  if (visibleSpots.length) {
    featuredSpot = [...visibleSpots].sort((left, right) => {
      if (Number(right.rating) === Number(left.rating)) {
        return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
      }

      return Number(right.rating) - Number(left.rating);
    })[0];

    remainingSpots = visibleSpots.filter((spot) => spot.id !== featuredSpot.id);
  }

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-3 pb-24 pt-3 sm:px-6 sm:pb-28 sm:pt-6 lg:px-8">
        <section>
          <FilterBar
            filters={FILTER_OPTIONS}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
          {isPreviewBoard ? (
            <p className="mt-3 text-xs leading-5 text-smoke sm:mt-4 sm:text-sm">
              Showing preview spots until the first real entries land. Add flow still requires a listed phone number.
            </p>
          ) : null}
        </section>

        {fetchError ? (
          <div className="mt-6 rounded-[1.6rem] border border-accent/30 bg-accent/10 p-4 text-sm text-accent sm:mt-10 sm:p-5">
            Couldn&apos;t load spots: {fetchError}
          </div>
        ) : null}

        <section className="mt-4 sm:mt-8">
          {isLoading ? (
            <>
              <SkeletonCard featured />
              <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </>
          ) : visibleSpots.length ? (
            <>
              {featuredSpot ? <SpotCard spot={featuredSpot} featured /> : null}
              <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
                {remainingSpots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[40vh] items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/5 px-6 text-center">
              <div>
                <p className="font-display text-4xl text-white">No spots yet. Be the first! 🌊</p>
                <p className="mt-3 text-sm text-smoke">Drop a place, set the vibe, and let the arguments begin.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <Link
        href="/add"
        className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-ink shadow-glow transition hover:brightness-110 sm:bottom-6 sm:right-6 sm:gap-3 sm:px-6 sm:py-4 sm:text-base"
      >
        <span className="text-xl leading-none sm:text-2xl">+</span>
        <span>Add a Spot</span>
      </Link>

      <div
        className={`pointer-events-none fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-medium text-ink shadow-xl transition sm:top-6 sm:px-5 sm:py-3 sm:text-sm ${
          toastVisible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        Spot dropped! 🎉
      </div>
    </main>
  );
}
