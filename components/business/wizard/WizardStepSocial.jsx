"use client";

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "📸", placeholder: "https://instagram.com/yourbusiness" },
  { value: "facebook", label: "Facebook", icon: "👍", placeholder: "https://facebook.com/yourbusiness" },
  { value: "youtube", label: "YouTube", icon: "▶️", placeholder: "https://youtube.com/@yourbusiness" },
  { value: "twitter", label: "X / Twitter", icon: "𝕏", placeholder: "https://x.com/yourbusiness" },
  { value: "linkedin", label: "LinkedIn", icon: "💼", placeholder: "https://linkedin.com/company/yourbusiness" },
  { value: "whatsapp", label: "WhatsApp Business", icon: "💬", placeholder: "https://wa.me/919876543210" },
  { value: "googlebusiness", label: "Google Business", icon: "🔍", placeholder: "https://g.page/yourbusiness" },
  { value: "tripadvisor", label: "TripAdvisor", icon: "🦉", placeholder: "https://tripadvisor.com/yourbusiness" },
  { value: "zomato", label: "Zomato", icon: "🍔", placeholder: "https://zomato.com/yourbusiness" },
  { value: "swiggy", label: "Swiggy", icon: "🛵", placeholder: "https://swiggy.com/yourbusiness" },
  { value: "custom", label: "Custom Link", icon: "🔗", placeholder: "https://example.com" },
];

const FIELD = "flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all text-sm font-medium min-w-0";

export default function WizardStepSocial({ data, onChange }) {
  const links = data.socialLinks || [];

  const addLink = (platform) => {
    if (links.length >= 12) return;
    if (links.find((l) => l.platform === platform && platform !== "custom")) return;
    const pl = SOCIAL_PLATFORMS.find((p) => p.value === platform);
    onChange({
      socialLinks: [...links, { platform, label: pl?.label || platform, url: "" }],
    });
  };

  const updateLink = (index, field, value) => {
    const updated = links.map((l, i) => (i === index ? { ...l, [field]: value } : l));
    onChange({ socialLinks: updated });
  };

  const removeLink = (index) => {
    onChange({ socialLinks: links.filter((_, i) => i !== index) });
  };

  const activePlatforms = new Set(links.map((l) => l.platform));

  return (
    <div className="space-y-5">
      {/* Quick add */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">Add your social pages</p>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_PLATFORMS.map((pl) => {
            const active = activePlatforms.has(pl.value) && pl.value !== "custom";
            return (
              <button
                key={pl.value}
                type="button"
                onClick={() => addLink(pl.value)}
                disabled={active}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-700 opacity-60 cursor-default"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50"
                }`}
              >
                <span>{pl.icon}</span>
                {pl.label}
                {active && <span className="ml-0.5">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Links list */}
      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((link, i) => {
            const pl = SOCIAL_PLATFORMS.find((p) => p.value === link.platform);
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg flex-shrink-0">{pl?.icon || "🔗"}</span>
                <input
                  type="url"
                  className={FIELD}
                  placeholder={pl?.placeholder || "https://..."}
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-lg transition-colors"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {links.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm">Click the platforms above to add your social pages</p>
          <p className="text-gray-300 text-xs mt-1">Optional — but helps customers find and follow you</p>
        </div>
      )}
    </div>
  );
}
