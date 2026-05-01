"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import Modal from "./Modal";

const SHORT_ID_RE = /^[a-zA-Z0-9_-]{3,32}$/;

export default function EditShortUrlModal({ open, onClose, qr, onSaved }) {
  const [slug, setSlug] = useState(qr?.shortId || "");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setSlug(qr?.shortId || "");
      setStatus("idle");
      setError(null);
    }
  }, [open, qr]);

  useEffect(() => {
    if (!open) return;
    if (!slug || slug === qr?.shortId) {
      setStatus("idle");
      return;
    }
    if (!SHORT_ID_RE.test(slug)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/qrcodes/check-slug?slug=${encodeURIComponent(slug)}&exceptId=${qr._id}`
        );
        const json = await res.json();
        setStatus(json.available ? "available" : "taken");
      } catch {
        setStatus("idle");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [slug, qr, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status !== "available" && slug !== qr?.shortId) return;
    setError(null);
    try {
      const res = await fetch(`/api/qrcodes/${qr._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortId: slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update.");
      onSaved?.(json.data);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Modal open={open} onClose={onClose} title="Edit short URL">
      {!qr?.isDynamic ? (
        <p className="text-sm text-ink-500">
          Only dynamic QR codes have a short URL. Static codes have their content
          baked into the image.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Short URL slug</label>
            <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-ink-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <span className="text-sm text-ink-400 select-none truncate">
                {baseUrl}/r/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/\s+/g, ""))}
                placeholder="my-qr"
                className="flex-1 bg-transparent outline-none text-sm font-semibold text-ink-900 placeholder-ink-400"
              />
              <div className="flex-shrink-0 w-5 h-5">
                {status === "checking" && <Loader2 className="w-5 h-5 animate-spin text-ink-400" />}
                {status === "available" && <Check className="w-5 h-5 text-emerald-500" />}
                {(status === "taken" || status === "invalid") && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            <p className="mt-1.5 text-xs text-ink-400">
              3–32 characters: letters, numbers, hyphen, underscore.
            </p>
            {status === "taken" && (
              <p className="mt-1 text-xs text-red-600">That slug is already taken.</p>
            )}
            {status === "invalid" && (
              <p className="mt-1 text-xs text-red-600">Invalid format.</p>
            )}
          </div>
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
              disabled={status === "checking" || status === "taken" || status === "invalid"}
              className="flex-1 h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
