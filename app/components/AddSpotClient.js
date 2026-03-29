"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import PhoneGate from "./PhoneGate";
import { CATEGORY_OPTIONS } from "../lib/constants";
import { getIdentity } from "../lib/identity";
import { getSupabaseBrowserClient } from "../lib/supabase";

export default function AddSpotClient({ allowedContactsJson }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [identity, setIdentityState] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Beach",
    rating: 8,
    note: "",
    vibeInput: "",
    vibes: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIdentityState(getIdentity());
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function commitVibeTag(rawValue) {
    const nextTag = rawValue.trim();

    if (!nextTag) {
      updateField("vibeInput", "");
      return;
    }

    const exists = form.vibes.some((vibe) => vibe.toLowerCase() === nextTag.toLowerCase());
    if (!exists) {
      updateField("vibes", [...form.vibes, nextTag]);
    }
    updateField("vibeInput", "");
  }

  function handleVibeKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitVibeTag(form.vibeInput);
    }
  }

  function handleFile(file) {
    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!identity) {
      setError("Identity missing. Re-enter through the phone gate.");
      return;
    }

    if (!form.name.trim()) {
      setError("Add the place name first.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();
      let photoUrl = null;

      if (selectedFile) {
        const compressed = await imageCompression(selectedFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });

        const safeFileName = selectedFile.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
        const storagePath = `spots/${crypto.randomUUID()}-${safeFileName || "photo.jpg"}`;

        const { error: uploadError } = await supabase.storage
          .from("spot-photos")
          .upload(storagePath, compressed, {
            cacheControl: "3600",
            upsert: false,
            contentType: compressed.type || selectedFile.type || "image/jpeg"
          });

        if (uploadError) {
          throw uploadError;
        }

        photoUrl = supabase.storage.from("spot-photos").getPublicUrl(storagePath).data.publicUrl;
      }

      const { error: insertError } = await supabase.from("spots").insert({
        name: form.name.trim(),
        category: form.category,
        rating: Number(form.rating),
        note: form.note.trim() || null,
        vibes: form.vibes.length ? form.vibes : [],
        added_by: identity.name,
        photo_url: photoUrl
      });

      if (insertError) {
        throw insertError;
      }

      router.push("/?added=1");
    } catch (submitError) {
      setError(submitError.message || "Could not save this spot.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink">
      {identity ? null : (
        <PhoneGate
          allowedContactsJson={allowedContactsJson}
          onSuccess={(nextIdentity) => setIdentityState(nextIdentity)}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/70 transition hover:text-white">
            ← Back to board
          </Link>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            {identity ? identity.name : "Locked"}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,53,0.18),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-6 sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-accent/70">Add a Spot</p>
            <h1 className="mt-3 font-display text-5xl text-white">Drop the next Goa essential.</h1>
            <p className="mt-3 text-sm leading-6 text-smoke">
              Rate it honestly, tag the vibe, and leave enough context for the next debate.
            </p>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <label className="block">
                <span className="mb-2 block text-sm text-mist/80">Place Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Purple Martini, Anjuna Shack..."
                  className="w-full rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-accent"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm text-mist/80">Category</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((option) => {
                    const active = form.category === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("category", option.value)}
                        className={`rounded-full px-4 py-3 text-sm transition ${
                          active
                            ? "bg-accent text-ink"
                            : "border border-white/10 bg-black/20 text-white/75 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {option.emoji} {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/45">Rating</p>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="font-display text-7xl leading-none text-white">{Number(form.rating).toFixed(1)}</span>
                    <span className="pb-3 text-xl text-white/50">/10</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) => updateField("rating", event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 lg:max-w-xl"
                />
              </div>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFile(event.dataTransfer.files?.[0]);
              }}
              className={`rounded-[2rem] border border-dashed p-6 transition ${
                isDragging ? "border-accent bg-accent/10" : "border-white/15 bg-black/20"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-medium text-white">Photo Upload</p>
                  <p className="mt-2 text-sm text-smoke">
                    Drag in a photo or browse. The image is compressed in the browser to stay under 1 MB.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  Choose Photo
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />

              {previewUrl ? (
                <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10">
                  <img src={previewUrl} alt="Spot preview" className="h-72 w-full object-cover" />
                </div>
              ) : null}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm text-mist/80">Vibe Tags</span>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {form.vibes.map((vibe) => (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() =>
                          updateField(
                            "vibes",
                            form.vibes.filter((item) => item !== vibe)
                          )
                        }
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/90"
                      >
                        {vibe} ×
                      </button>
                    ))}
                    <input
                      type="text"
                      value={form.vibeInput}
                      onChange={(event) => updateField("vibeInput", event.target.value)}
                      onKeyDown={handleVibeKeyDown}
                      onBlur={() => commitVibeTag(form.vibeInput)}
                      placeholder="sunset, seafood, loud..."
                      className="min-w-[12rem] flex-1 bg-transparent py-2 text-white outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-mist/80">Note</span>
                <textarea
                  value={form.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  rows={6}
                  placeholder="Why this one made the list..."
                  className="w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-accent"
                />
              </label>
            </div>

            {error ? <p className="text-sm text-accent">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-smoke">Uploads go to Supabase Storage at <code>spots/uuid-filename</code>.</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-accent px-6 py-4 font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Dropping..." : "Save Spot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
