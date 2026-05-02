"use client";

import { useState } from "react";
import { Bookmark, Check, X } from "lucide-react";

export default function SaveAsTemplateModal({ open, onClose, design, onSaved }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), design }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save template.");
      setSaved(true);
      onSaved?.(json.data);
      setTimeout(() => {
        setSaved(false);
        setName("");
        onClose();
      }, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-glow border border-ink-100 w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
            <Bookmark className="w-4 h-4 text-brand-500" />
            Save as template
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl text-ink-400 hover:bg-ink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {saved ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-ink-900">Saved!</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-600">
                Save your current design (colors, shapes, frame, logo) as a reusable template.
              </p>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">
                  Template name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer campaign"
                  className="w-full h-10 px-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 rounded-full border border-ink-200 text-sm font-bold text-ink-600 hover:bg-ink-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || loading}
                  className="flex-1 h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving…" : "Save template"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
