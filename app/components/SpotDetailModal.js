"use client";

import { useMemo, useState } from "react";
import { getCategoryMeta, getRatingTone } from "../lib/constants";

function formatTime(value) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function SpotDetailModal({
  spot,
  identity,
  onClose,
  onRequireIdentity,
  onSubmitComment,
  isSubmittingComment
}) {
  const [commentBody, setCommentBody] = useState("");
  const category = getCategoryMeta(spot.category);
  const tone = getRatingTone(Number(spot.rating));
  const comments = useMemo(
    () =>
      [...(spot.spot_comments || [])].sort(
        (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
      ),
    [spot.spot_comments]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!identity) {
      onRequireIdentity();
      return;
    }

    const value = commentBody.trim();
    if (!value) {
      return;
    }

    const didSave = await onSubmitComment(spot.id, value);
    if (didSave) {
      setCommentBody("");
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#120f0d] sm:h-auto sm:max-h-[90vh] sm:rounded-[2rem]">
        <div className="relative min-h-[18rem] sm:min-h-[24rem]">
          <img
            src={spot.photo_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"}
            alt={spot.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-sm text-white backdrop-blur"
          >
            Close
          </button>

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur">
            <span aria-hidden="true">{category.emoji}</span>
            <span>{category.label}</span>
          </div>

          <div
            className="absolute bottom-4 right-4 rounded-[1.4rem] px-4 py-3 text-right text-white backdrop-blur"
            style={{ backgroundColor: tone.badge }}
          >
            <div className="font-display text-4xl leading-none">{Number(spot.rating).toFixed(1)}</div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/80">/10</div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <h2 className="max-w-3xl font-display text-4xl text-white sm:text-5xl">{spot.name}</h2>
            {spot.note ? (
              <p className="mt-3 max-w-3xl text-sm italic leading-6 text-white/80 sm:text-base">
                {spot.note}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid flex-1 gap-0 overflow-hidden sm:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-y-auto border-b border-white/10 p-4 sm:border-b-0 sm:border-r sm:p-6">
            <div className="flex flex-wrap gap-2">
              {(spot.vibes || []).map((vibe) => (
                <span
                  key={`${spot.id}-${vibe}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/90"
                >
                  {vibe}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/75">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-semibold text-ink">
                  {spot.added_by.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Logged by</p>
                  <p className="text-sm text-white">{spot.added_by}</p>
                </div>
              </div>
              <p>{formatTime(spot.created_at)}</p>
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-white">Comments</h3>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                {comments.length}
              </div>
            </div>

            <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
              {comments.length ? (
                comments.map((comment) => (
                  <article key={comment.id} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{comment.added_by}</p>
                      <p className="text-[11px] text-white/45">{formatTime(comment.created_at)}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/78">{comment.body}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-smoke">
                  No comments yet. Drop the first one.
                </div>
              )}
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <textarea
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                rows={3}
                placeholder={
                  identity ? `Comment as ${identity.name}...` : "Enter your phone number first to comment..."
                }
                className="w-full rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
              />

              <div className="flex items-center justify-between gap-3">
                {identity ? (
                  <p className="text-xs text-white/55">Commenting as {identity.name}</p>
                ) : (
                  <button
                    type="button"
                    onClick={onRequireIdentity}
                    className="text-xs text-accent transition hover:brightness-110"
                  >
                    Use phone number to comment
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
