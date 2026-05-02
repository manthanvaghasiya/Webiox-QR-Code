"use client";

import { useState } from "react";
import ShareModal from "./ShareModal";

export default function ProfileActionBar({ profile }) {
  const [shareOpen, setShareOpen] = useState(false);
  const whatsappUrl = profile.contact?.whatsapp
    ? `https://wa.me/${profile.contact.whatsapp.replace(/\D/g, "")}`
    : null;
  const mapsUrl = profile.address?.city
    ? `https://www.google.com/maps/search/${encodeURIComponent(
        [profile.businessName, profile.address.city, profile.address.state].filter(Boolean).join(", ")
      )}`
    : null;
  const profileUrl = typeof window !== "undefined" ? window.location.href : "";

  const hasActions = profile.contact?.phone || whatsappUrl || mapsUrl;
  if (!hasActions) return null;

  return (
    <>
      {/* Sticky bottom bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 px-3 py-2 safe-area-pb">
          <div className="flex items-center gap-2">
            {profile.contact?.phone && (
              <a
                href={`tel:${profile.contact.phone}`}
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => fetch(`/b/${profile.slug}/event`, { method: "POST", body: JSON.stringify({ type: "call" }), headers: { "Content-Type": "application/json" } }).catch(() => {})}
              >
                <span className="text-xl">📞</span>
                <span className="text-[10px] font-bold text-gray-600">Call</span>
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">💬</span>
                <span className="text-[10px] font-bold text-gray-600">WhatsApp</span>
              </a>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => fetch(`/b/${profile.slug}/event`, { method: "POST", body: JSON.stringify({ type: "direction" }), headers: { "Content-Type": "application/json" } }).catch(() => {})}
              >
                <span className="text-xl">📍</span>
                <span className="text-[10px] font-bold text-gray-600">Directions</span>
              </a>
            )}
            <button
              onClick={() => setShareOpen(true)}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🔗</span>
              <span className="text-[10px] font-bold text-gray-600">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding so content doesn't hide behind bar */}
      <div className="h-20 md:hidden" />

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        profileUrl={profileUrl}
        businessName={profile.businessName}
      />
    </>
  );
}
