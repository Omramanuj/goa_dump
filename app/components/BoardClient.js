"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import PhoneGate from "./PhoneGate";
import SpotCard from "./SpotCard";
import SpotDetailModal from "./SpotDetailModal";
import { FILTER_OPTIONS } from "../lib/constants";
import { getIdentity } from "../lib/identity";
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

export default function BoardClient({ allowedContactsJson }) {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [isPhoneGateOpen, setIsPhoneGateOpen] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    setIdentity(getIdentity());
  }, []);

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
        .select("*, spot_comments(*)")
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

  const visibleSpots = spots
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

  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) || null;

  async function handleCommentSubmit(spotId, body) {
    if (!identity) {
      setIsPhoneGateOpen(true);
      return false;
    }

    setIsSubmittingComment(true);
    setCommentError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("spot_comments")
        .insert({
          spot_id: spotId,
          body,
          added_by: identity.name
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSpots((current) =>
        current.map((spot) =>
          spot.id === spotId
            ? { ...spot, spot_comments: [...(spot.spot_comments || []), data] }
            : spot
        )
      );

      return true;
    } catch (error) {
      setCommentError(error.message || "Could not post comment.");
      return false;
    } finally {
      setIsSubmittingComment(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink">
      {isPhoneGateOpen ? (
        <PhoneGate
          allowedContactsJson={allowedContactsJson}
          onSuccess={(nextIdentity) => {
            setIdentity(nextIdentity);
            setIsPhoneGateOpen(false);
          }}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-3 pb-24 pt-3 sm:px-6 sm:pb-28 sm:pt-6 lg:px-8">
        <section>
          <FilterBar
            filters={FILTER_OPTIONS}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
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
              {featuredSpot ? (
                <SpotCard spot={featuredSpot} featured onOpen={() => setSelectedSpotId(featuredSpot.id)} />
              ) : null}
              <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
                {remainingSpots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} onOpen={() => setSelectedSpotId(spot.id)} />
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

        <footer className="mt-10 pb-4 text-center text-xs text-white/45 sm:mt-14 sm:text-sm">
          Made by{" "}
          <a
            href="https://omramanuj.site"
            target="_blank"
            rel="noreferrer"
            className="text-white/70 underline decoration-white/20 underline-offset-4 transition hover:text-accent"
          >
            Om Ramanuj
          </a>
        </footer>
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

      {selectedSpot ? (
        <>
          <SpotDetailModal
            spot={selectedSpot}
            identity={identity}
            onClose={() => {
              setSelectedSpotId(null);
              setCommentError("");
            }}
            onRequireIdentity={() => setIsPhoneGateOpen(true)}
            onSubmitComment={handleCommentSubmit}
            isSubmittingComment={isSubmittingComment}
          />
          {commentError ? (
            <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-accent/30 bg-[#241714] px-4 py-3 text-sm text-accent shadow-2xl">
              {commentError}
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
