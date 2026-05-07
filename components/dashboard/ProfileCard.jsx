// ─────────────────────────────────────────────────────────────────────────────
// ProfileCard — business-profile tile in the dashboard list
//
// Renders the profile's color bar, logo/initial, business name, tagline,
// /b/<slug> URL, scan/call/direction stats, and View / Edit / Delete (with
// inline confirmation) actions.
// Used in: app/dashboard/profiles/page.js.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const TEMPLATE_EMOJI = {
  starter: "✨", bold: "🔥", elegant: "👑", modern: "🚀", storefront: "🛍️", professional: "💼",
};

export default function ProfileCard({ profile, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  // Generate QR code visualization
  useEffect(() => {
    const container = qrContainerRef.current;
    if (!container || !profile.qrCodeId) return;

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || 'https://webiox.in';
      const qrCode = buildQrCodeStyling(
        {
          _id: profile.qrCodeId,
          destination: `${baseUrl}/b/${profile.slug}`,
          type: 'business-profile',
          isDynamic: true,
          design: {
            fgColor: profile.theme?.primaryColor || '#000000',
            bgColor: '#ffffff',
          },
        },
        150
      );
      // Clear previous content safely
      container.replaceChildren();
      qrCode.append(container);
    } catch (e) {
      console.error("Failed to render QR code:", e);
      setError("QR code generation failed");
    }

    // Cleanup: clear container on unmount
    return () => {
      if (container) container.replaceChildren();
    };
  }, [profile.qrCodeId, profile.slug, profile.theme?.primaryColor]);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/business-profiles/${profile._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delete failed with status ${res.status}`);
      }
      onDelete(profile._id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete profile");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const profileUrl = `/b/${profile.slug}`;
  const baseUrl = typeof window !== 'undefined' ? window.location.host : process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') || 'webiox.in';
  const displayUrl = `${baseUrl}/b/${profile.slug}`;
  const templateEmoji = TEMPLATE_EMOJI[profile.theme?.template] || "✨";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Color bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: profile.theme?.primaryColor || "#4F46E5" }} />

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{ backgroundColor: `${profile.theme?.primaryColor || "#4F46E5"}15` }}
          >
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt={profile.businessName}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              profile.businessName?.[0]?.toUpperCase() || "B"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-900 truncate">{profile.businessName}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{profile.tagline || "No tagline"}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400 font-mono">{displayUrl}</span>
              <span className="text-xs">{templateEmoji}</span>
            </div>
          </div>
        </div>


        {/* Extended Stats */}
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
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
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
