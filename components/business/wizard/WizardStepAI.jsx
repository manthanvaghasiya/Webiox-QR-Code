"use client";

import { useState } from "react";

const FIELD = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all text-sm font-medium";

export default function WizardStepAI({ data, onChange, onGenerate, isGenerating }) {
  const [selectedTagline, setSelectedTagline] = useState(
    data.tagline || (data._aiTaglines?.[0] ?? "")
  );

  const handleTaglineSelect = (t) => {
    setSelectedTagline(t);
    onChange({ tagline: t });
  };

  return (
    <div className="space-y-6">
      {/* AI generation trigger */}
      {!data._aiGenerated ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Let AI write your profile</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Based on your business name, category, and keywords, our AI will generate a professional tagline, about section, and suggested services.
          </p>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Generate with AI ✨
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tagline options */}
          {data._aiTaglines?.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Choose a Tagline <span className="text-gray-400 font-normal">(or edit below)</span>
              </label>
              <div className="space-y-2">
                {data._aiTaglines.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleTaglineSelect(t)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedTagline === t
                        ? "border-brand-500 bg-brand-50 text-brand-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-brand-300"
                    }`}
                  >
                    <span className="text-brand-400 mr-2">✦</span>
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className={`${FIELD} mt-3`}
                placeholder="Or type your own tagline..."
                value={data.tagline || ""}
                onChange={(e) => {
                  setSelectedTagline(e.target.value);
                  onChange({ tagline: e.target.value });
                }}
                maxLength={200}
              />
            </div>
          )}

          {/* About section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">About Your Business</label>
              <button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating}
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isGenerating ? "..." : "↻ Regenerate"}
              </button>
            </div>
            <textarea
              rows={6}
              className={FIELD}
              value={data.about || ""}
              onChange={(e) => onChange({ about: e.target.value })}
              placeholder="Describe your business..."
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{(data.about || "").length}/2000</p>
          </div>
        </div>
      )}
    </div>
  );
}
