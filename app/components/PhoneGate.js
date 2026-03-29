"use client";

import { useState } from "react";
import { loadAllowedContacts, setIdentity } from "../lib/identity";

export default function PhoneGate({ allowedContactsJson, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const contacts = loadAllowedContacts(allowedContactsJson);

  function handleSubmit(event) {
    event.preventDefault();

    const normalized = phone.replace(/\D/g, "").slice(-10);

    if (normalized.length !== 10) {
      setError("Enter a 10-digit number.");
      return;
    }

    const match = contacts.find((contact) => contact.phone === normalized);

    if (!match) {
      setError("You're not on the list 🙅");
      return;
    }

    setIdentity(match);
    setError("");
    onSuccess(match);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 px-4 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-panel/90 p-8 shadow-glow">
        <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Private Board</p>
        <h1 className="font-display text-4xl text-white">Goa Squad Spots</h1>
        <p className="mt-3 text-sm leading-6 text-smoke">
          Enter the 10-digit phone number on the squad list to unlock the trip board.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-mist/80">Phone Number</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                if (error) {
                  setError("");
                }
              }}
              placeholder="9876543210"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-lg tracking-[0.2em] text-white outline-none transition focus:border-accent"
            />
          </label>

          {error ? <p className="text-sm text-accent">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-accent px-4 py-4 font-medium text-ink transition hover:brightness-110"
          >
            Enter Board
          </button>
        </form>
      </div>
    </div>
  );
}
