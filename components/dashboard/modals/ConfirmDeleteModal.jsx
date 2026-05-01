"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDeleteModal({ open, onClose, qr, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/qrcodes/${qr._id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete.");
      }
      onDeleted?.(qr._id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Delete QR code?" maxWidth="max-w-sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-semibold mb-1">This can't be undone.</p>
            <p>
              Anyone scanning <span className="font-mono">{qr.shortId || qr.name}</span> will see a
              "not found" page. Scan history is also deleted.
            </p>
          </div>
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
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
