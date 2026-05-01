"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function EditContentModal({ open, onClose, qr, onSaved }) {
  const [name, setName] = useState(qr?.name || "");
  const [destination, setDestination] = useState(qr?.destination || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = { name: name.trim() || null };
      if (qr.isDynamic) body.destination = destination.trim();
      const res = await fetch(`/api/qrcodes/${qr._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update.");
      onSaved?.(json.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit content">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink-700 mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spring promo"
            className="w-full h-10 px-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
        {qr.isDynamic && (
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Destination URL</label>
            <input
              type="url"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full h-10 px-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
            />
            <p className="mt-1.5 text-xs text-ink-400">
              Updating the destination is instant. The QR code itself doesn't need to be reprinted.
            </p>
          </div>
        )}
        {!qr.isDynamic && (
          <div className="rounded-xl bg-ink-50 border border-ink-100 px-3 py-2 text-xs text-ink-500">
            Static QR codes have their content baked into the image. Only the name can be changed.
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-full border border-ink-200 text-sm font-bold text-ink-600 hover:bg-ink-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
