"use client";

const ECC_LEVELS = [
  { value: "L", label: "L", hint: "Low (7%)" },
  { value: "M", label: "M", hint: "Medium (15%)" },
  { value: "Q", label: "Q", hint: "Quartile (25%)" },
  { value: "H", label: "H", hint: "High (30%)" },
];

export default function QualitySection({ qr }) {
  return (
    <div className="space-y-5">
      {/* Size slider */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-gray-500">200px</span>
          <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{qr.qrSize} × {qr.qrSize} px</span>
          <span className="text-xs font-semibold text-gray-500">2000px</span>
        </div>
        <input
          type="range"
          min={200}
          max={2000}
          step={100}
          value={qr.qrSize}
          onChange={(e) => qr.setQrSize(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Error Correction Level */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Error Correction</label>
        <div className="grid grid-cols-4 gap-2">
          {ECC_LEVELS.map((ecc) => (
            <button
              key={ecc.value}
              onClick={() => qr.setErrorCorrectionLevel(ecc.value)}
              title="Higher = scannable even when partly damaged or covered by logo. Lower = denser pattern, easier to scan small."
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                qr.errorCorrectionLevel === ecc.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/30 shadow-md"
                  : "border-gray-200/60 bg-white/50 text-gray-500 hover:border-gray-300 hover:bg-white/80"
              }`}
            >
              <span className="text-lg font-bold">{ecc.label}</span>
              <span className="text-[10px] font-medium leading-tight">{ecc.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transparent background toggle */}
      <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
        <input
          type="checkbox"
          checked={qr.transparentBg}
          onChange={(e) => qr.setTransparentBg(e.target.checked)}
          className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <div>
          <span className="text-sm text-gray-700 font-semibold block">Transparent Background</span>
          <span className="text-xs text-gray-400">Applies to PNG, WebP, and SVG exports</span>
        </div>
      </label>
    </div>
  );
}
