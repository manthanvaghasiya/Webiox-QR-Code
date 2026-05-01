"use client";

import { useState } from "react";
import { Folder, FolderX, Plus, Check } from "lucide-react";
import Modal from "./Modal";

export default function MoveToFolderModal({ open, onClose, qr, folders, onSaved, onCreateFolder }) {
  const [selected, setSelected] = useState(qr?.folderId ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/qrcodes/${qr._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: selected }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to move.");
      onSaved?.(json.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Move to folder">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer",
            selected === null
              ? "border-brand-500 bg-brand-50/50"
              : "border-ink-100 hover:border-ink-200",
          ].join(" ")}
        >
          <FolderX className="w-5 h-5 text-ink-400 flex-shrink-0" />
          <span className="flex-1 text-left text-sm font-semibold text-ink-900">No folder</span>
          {selected === null && <Check className="w-4 h-4 text-brand-500" />}
        </button>

        {folders?.length > 0 && (
          <div className="max-h-64 overflow-y-auto space-y-1.5">
            {folders.map((f) => (
              <button
                key={f._id}
                type="button"
                onClick={() => setSelected(f._id)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer",
                  selected === f._id
                    ? "border-brand-500 bg-brand-50/50"
                    : "border-ink-100 hover:border-ink-200",
                ].join(" ")}
              >
                <Folder
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: f.color || "#8A93A8" }}
                />
                <span className="flex-1 text-left text-sm font-semibold text-ink-900 truncate">
                  {f.name}
                </span>
                {selected === f._id && <Check className="w-4 h-4 text-brand-500" />}
              </button>
            ))}
          </div>
        )}

        {onCreateFolder && (
          <button
            type="button"
            onClick={onCreateFolder}
            className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl border border-dashed border-ink-200 text-sm font-semibold text-ink-500 hover:bg-ink-50 hover:text-ink-900 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New folder
          </button>
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
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Moving…" : "Move"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
