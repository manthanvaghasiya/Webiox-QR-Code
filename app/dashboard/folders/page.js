"use client";

import { useState } from "react";
import { Folder, Plus, X } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";

const FOLDER_COLORS = [
  "#4F46E5", "#7C3AED", "#DB2777", "#059669",
  "#D97706", "#DC2626", "#0891B2", "#475569",
];

function CreateFolderModal({ onClose }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-glow border border-ink-100 w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-ink-900">New folder</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-ink-400 hover:bg-ink-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
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
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating…" : "Create folder"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FoldersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {showModal && <CreateFolderModal onClose={() => setShowModal(false)} />}

      <PageHeader
        title="Folders"
        description="Organise your QR codes into folders for easier management."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create folder
          </button>
        }
      />

      <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
        <EmptyState
          icon={Folder}
          title="No folders yet"
          description="Group your QR codes into folders to keep things tidy and easy to find."
        />
      </div>
    </div>
  );
}
