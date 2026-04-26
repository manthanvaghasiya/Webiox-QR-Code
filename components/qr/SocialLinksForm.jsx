"use client";

import { Plus, X } from "lucide-react";

const SOCIAL_PLATFORMS = [
  "Instagram", "Twitter", "LinkedIn", "Facebook", "YouTube",
  "TikTok", "GitHub", "Website", "Email", "WhatsApp", "Telegram", "Discord",
];

const INP =
  "w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm";

export default function SocialLinksForm({
  links, onAdd, onRemove, onUpdate,
  pageTitle, onPageTitle,
  pageDesc, onPageDesc,
}) {
  return (
    <div className="space-y-4">
      <input
        className={INP}
        placeholder="Page Title (e.g. Manthan's Links)"
        value={pageTitle}
        onChange={(e) => onPageTitle(e.target.value)}
      />
      <textarea
        rows={2}
        className={INP + " resize-none"}
        placeholder="Page Description (optional)"
        value={pageDesc}
        onChange={(e) => onPageDesc(e.target.value)}
      />
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select
              className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl outline-none text-gray-800 shadow-sm cursor-pointer flex-shrink-0 font-medium"
              value={link.platform}
              onChange={(e) => onUpdate(i, "platform", e.target.value)}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              className={INP + " flex-1 min-w-0"}
              placeholder="https://..."
              value={link.url}
              onChange={(e) => onUpdate(i, "url", e.target.value)}
            />
            {links.length > 1 && (
              <button
                onClick={() => onRemove(i)}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                aria-label="Remove link"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="w-full py-3 px-4 border-2 border-dashed border-blue-300 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all text-sm flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Another Link
      </button>
      <p className="text-xs text-center text-gray-400">
        Scanning the QR code opens a hosted page with all your links
      </p>
    </div>
  );
}
