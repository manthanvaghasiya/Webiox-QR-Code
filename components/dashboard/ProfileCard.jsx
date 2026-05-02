"use client";

import Link from "next/link";
import { useState } from "react";

const TEMPLATE_EMOJI = {
  starter: "✨", bold: "🔥", elegant: "👑", modern: "🚀", storefront: "🛍️", professional: "💼",
};

export default function ProfileCard({ profile, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/business-profiles/${profile._id}`, { method: "DELETE" });
      if (res.ok) onDelete(profile._id);
    } catch (e) {
      console.error("Delete failed", e);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const profileUrl = `/b/${profile.slug}`;
  const templateEmoji = TEMPLATE_EMOJI[profile.theme?.template] || "✨";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Color bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: profile.theme?.primaryColor || "#4F46E5" }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{ backgroundColor: `${profile.theme?.primaryColor || "#4F46E5"}15` }}
          >
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.businessName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              profile.businessName?.[0]?.toUpperCase() || "B"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-900 truncate">{profile.businessName}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{profile.tagline || "No tagline"}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400 font-mono">webiox.in/b/{profile.slug}</span>
              <span className="text-xs">{templateEmoji}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat label="Scans" value={profile.totalScans ?? 0} icon="📊" />
          <Stat label="Calls" value={profile.totalCalls ?? 0} icon="📞" />
          <Stat label="Directions" value={profile.totalDirectionClicks ?? 0} icon="📍" />
        </div>

        {/* Actions */}
        {!showConfirm ? (
          <div className="flex gap-2">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              👁️ View
            </a>
            <Link
              href={`/dashboard/profiles/${profile._id}/edit`}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 hover:bg-brand-100 transition-colors"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-500 hover:bg-red-100 transition-colors"
            >
              🗑️
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="text-center bg-gray-50 rounded-xl p-2">
      <div className="text-sm">{icon}</div>
      <div className="text-base font-extrabold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 font-semibold">{label}</div>
    </div>
  );
}
