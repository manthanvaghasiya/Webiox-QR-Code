"use client";

import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { LOGO_PRESETS } from "@/lib/logoLibrary";

export default function LogoSection({ qr }) {
  const [logoTab, setLogoTab] = useState("upload");

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex bg-gray-100/80 rounded-xl p-1">
        <button
          onClick={() => setLogoTab("upload")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${logoTab === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
        >
          Upload
        </button>
        <button
          onClick={() => setLogoTab("library")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${logoTab === "library" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
        >
          Logo Library
        </button>
      </div>

      {logoTab === "upload" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="flex-1 flex flex-col items-center justify-center p-6 bg-white/40 border-2 border-dashed border-gray-300/60 rounded-2xl cursor-pointer hover:bg-white/70 hover:border-blue-400 transition-all backdrop-blur-sm">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Click to upload logo</span>
              <input type="file" accept="image/*" className="hidden" onChange={qr.handleLogoUpload} />
            </label>
            {qr.logo && (
              <div className="relative w-24 h-24 rounded-2xl border border-gray-200/50 shadow-md bg-white/80 backdrop-blur-sm flex-shrink-0 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                <button
                  onClick={(e) => { e.preventDefault(); qr.setLogo(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-md"
                  aria-label="Remove logo"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-2">
          {LOGO_PRESETS.map((preset) => {
            const isSelected = qr.logo === preset.svgDataUri;
            return (
              <button
                key={preset.id}
                onClick={() => qr.setLogo(preset.svgDataUri)}
                title={preset.name}
                className={`relative w-full aspect-square rounded-xl border-2 transition-all flex items-center justify-center p-2 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50 shadow-md"
                    : "border-gray-200/60 bg-white/50 hover:border-gray-300 hover:bg-white/80"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: preset.brandColor + "18" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preset.svgDataUri} alt={preset.name} className="w-6 h-6" />
                </div>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {qr.logo && (
        <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
          <input
            type="checkbox"
            checked={qr.hideBackgroundDots}
            onChange={(e) => qr.setHideBackgroundDots(e.target.checked)}
            className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700 font-semibold">Remove Background Behind Logo</span>
        </label>
      )}
    </div>
  );
}
