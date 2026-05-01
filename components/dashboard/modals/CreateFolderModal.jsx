"use client";

import { useState } from "react";
import Modal from "./Modal";

const FOLDER_COLORS = [
  "#4F46E5", "#7C3AED", "#DB2777", "#059669",
  "#D97706", "#DC2626", "#0891B2", "#475569",
];

export default function CreateFolderModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create folder.");
      onCreated?.(json.data);
      setName("");
      setColor(FOLDER_COLORS[0]);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New folder" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-ink-700 mb-1.5">Folder name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Marketing 2025"
            className="w-full h-10 px-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink-700 mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {FOLDER_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={[
                  "w-7 h-7 rounded-full transition-all cursor-pointer",
                  color === c ? "ring-2 ring-offset-2 ring-ink-400 scale-110" : "hover:scale-105",
                ].join(" ")}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating…" : "Create folder"}
        </button>
      </form>
    </Modal>
  );
}
