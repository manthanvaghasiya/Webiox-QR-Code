"use client";

import { useState } from "react";
import { CATEGORY_OPTIONS } from "@/lib/aiProfileGenerator";

const FIELD = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all text-sm font-medium";

export default function WizardStepBasic({ data, onChange }) {
  const [keyword, setKeyword] = useState("");

  const addKeyword = (e) => {
    if ((e.key === "Enter" || e.key === ",") && keyword.trim()) {
      e.preventDefault();
      const kw = keyword.trim().replace(/,$/, "");
      if (kw && !(data.keywords || []).includes(kw) && (data.keywords || []).length < 8) {
        onChange({ keywords: [...(data.keywords || []), kw] });
      }
      setKeyword("");
    }
  };

  const removeKeyword = (kw) => {
    onChange({ keywords: (data.keywords || []).filter((k) => k !== kw) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          id="bp-business-name"
          type="text"
          className={FIELD}
          placeholder="e.g. Sharma Sweet House"
          value={data.businessName || ""}
          onChange={(e) => onChange({ businessName: e.target.value })}
          maxLength={120}
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Business Category <span className="text-red-500">*</span>
        </label>
        <select
          id="bp-category"
          className={FIELD + " cursor-pointer"}
          value={data.category || "general"}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Keywords{" "}
          <span className="text-gray-400 font-normal">(up to 8, press Enter to add)</span>
        </label>
        <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 bg-white min-h-[48px]">
          {(data.keywords || []).map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold"
            >
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="ml-1 text-brand-400 hover:text-brand-700 transition-colors"
                aria-label={`Remove ${kw}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            placeholder={(data.keywords || []).length === 0 ? "e.g. sweets, mithai, homemade..." : "Add more..."}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={addKeyword}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          These help our AI write better content for your profile.
        </p>
      </div>
    </div>
  );
}
