"use client";

const TEMPLATES = [
  {
    id: "starter",
    name: "Starter",
    desc: "Clean & minimal — works for any business",
    emoji: "✨",
    colors: ["#4F46E5", "#7C3AED", "#10B981"],
    preview: "bg-white border-gray-200",
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Large hero image, strong typography",
    emoji: "🔥",
    colors: ["#EF4444", "#F97316", "#FBBF24"],
    preview: "bg-gray-900 border-gray-700",
  },
  {
    id: "elegant",
    name: "Elegant",
    desc: "Serif fonts, gold tones — for premium brands",
    emoji: "👑",
    colors: ["#D97706", "#92400E", "#78716C"],
    preview: "bg-amber-50 border-amber-200",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Vibrant gradients, rounded cards",
    emoji: "🚀",
    colors: ["#06B6D4", "#3B82F6", "#8B5CF6"],
    preview: "bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200",
  },
  {
    id: "storefront",
    name: "Storefront",
    desc: "Product grid focus — great for shops",
    emoji: "🛍️",
    colors: ["#10B981", "#059669", "#F59E0B"],
    preview: "bg-green-50 border-green-200",
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Minimal & trust-building — for services",
    emoji: "💼",
    colors: ["#1E3A5F", "#1E40AF", "#6B7280"],
    preview: "bg-slate-50 border-slate-200",
  },
];

const FONTS = [
  { value: "Inter", label: "Inter — Modern sans" },
  { value: "Poppins", label: "Poppins — Friendly round" },
  { value: "Lato", label: "Lato — Clean professional" },
  { value: "Merriweather", label: "Merriweather — Classic serif" },
  { value: "Nunito", label: "Nunito — Playful & warm" },
];

export default function WizardStepTemplate({ data, onChange }) {
  const theme = data.theme || {};
  const selectedTemplate = theme.template || "starter";

  const setTheme = (patch) => onChange({ theme: { ...theme, ...patch } });

  return (
    <div className="space-y-6">
      {/* Template gallery */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">Choose a Template</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setTheme({ template: tmpl.id })}
              className={`group relative rounded-2xl border-2 p-4 text-left transition-all ${
                selectedTemplate === tmpl.id
                  ? "border-brand-500 shadow-lg shadow-brand-500/20 bg-brand-50"
                  : "border-gray-200 hover:border-brand-300 bg-white"
              }`}
            >
              {selectedTemplate === tmpl.id && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <div className="text-2xl mb-2">{tmpl.emoji}</div>
              <div className="text-sm font-bold text-gray-900">{tmpl.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{tmpl.desc}</div>
              {/* Color dots */}
              <div className="flex gap-1 mt-2">
                {tmpl.colors.map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color customization */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-700">Customize Colors</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "primaryColor", label: "Primary", default: "#4F46E5" },
            { key: "secondaryColor", label: "Secondary", default: "#7C3AED" },
            { key: "accentColor", label: "Accent", default: "#10B981" },
          ].map(({ key, label, default: def }) => (
            <div key={key} className="text-center">
              <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>
              <div className="relative mx-auto w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-brand-400 transition-all">
                <input
                  type="color"
                  value={theme[key] || def}
                  onChange={(e) => setTheme({ [key]: e.target.value })}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: theme[key] || def }}
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">{(theme[key] || def).toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-700 mb-2">Font Family</p>
        <select
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium cursor-pointer"
          value={theme.fontFamily || "Inter"}
          onChange={(e) => setTheme({ fontFamily: e.target.value })}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
