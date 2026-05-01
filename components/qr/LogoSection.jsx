"use client";

import { useState } from "react";
import { Upload, Check, Image as ImageIcon } from "lucide-react";
import { LOGO_PRESETS } from "@/lib/logoLibrary";

export default function LogoSection({ qr }) {
  const [logoTab, setLogoTab] = useState("upload");

  return (
    <div className="space-y-8">
      {/* Tab switcher */}
      <div className="flex bg-gray-100/80 rounded-2xl p-1.5">
        <button
          onClick={() => setLogoTab("upload")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${logoTab === "upload" ? "bg-white text-brand-700 shadow-sm ring-1 ring-gray-200/50" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
        <button
          onClick={() => setLogoTab("library")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${logoTab === "library" ? "bg-white text-brand-700 shadow-sm ring-1 ring-gray-200/50" : "text-gray-500 hover:text-gray-700"}`}
        >
          <ImageIcon className="w-4 h-4" /> Library
        </button>
      </div>

      {logoTab === "upload" ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <label className="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-white/60 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-white hover:border-brand-400 transition-all backdrop-blur-md group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-brand-100 transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-gray-900 mb-1">Upload your logo</span>
              <span className="text-xs font-medium text-gray-500">PNG, JPG, SVG up to 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={qr.handleLogoUpload} />
            </label>

            {qr.logo && (
              <div className="relative w-full h-32 rounded-3xl border border-gray-200 shadow-sm bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                <button
                  onClick={(e) => { e.preventDefault(); qr.setLogo(null); }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 shadow-lg hover:scale-110 transition-transform"
                  aria-label="Remove logo"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
          {LOGO_PRESETS.map((preset) => {
            const isSelected = qr.logo === preset.svgDataUri;
            return (
              <button
                key={preset.id}
                onClick={() => qr.setLogo(preset.svgDataUri)}
                title={preset.name}
                className={`relative w-full aspect-square rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden ${isSelected
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-sm z-10"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
              >
                <div
                  className="w-full h-full flex items-center justify-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: preset.brandColor + "15" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preset.svgDataUri} alt={preset.name} className="w-3/5 h-3/5 drop-shadow-sm object-contain" />
                </div>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {qr.logo && (
        <div className="pt-2">
          <label className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl cursor-pointer hover:bg-white/80 transition-all shadow-sm group">
            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${qr.hideBackgroundDots ? "bg-brand-500" : "bg-gray-200 group-hover:bg-gray-300"}`}>
              <Check className={`w-3.5 h-3.5 text-white transition-opacity ${qr.hideBackgroundDots ? "opacity-100" : "opacity-0"}`} />
            </div>
            <input
              type="checkbox"
              checked={qr.hideBackgroundDots}
              onChange={(e) => qr.setHideBackgroundDots(e.target.checked)}
              className="hidden"
            />
            <div className="flex flex-col">
              <span className="text-sm text-gray-900 font-bold uppercase tracking-wider">Remove Dots Behind Logo</span>
              <span className="text-xs text-gray-500 font-medium">Makes your logo stand out perfectly</span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
