"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ColorPick({ id, label, value, onChange }) {
  const handleHexInput = (e) => {
    let v = e.target.value;
    if (!v.startsWith("#")) v = "#" + v;
    // Only update if it's a valid-looking hex
    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
      onChange(v);
    }
  };

  return (
    <div className="flex-1 group">
      <div className="flex items-center gap-2.5 p-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
          <input
            type="color"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <label htmlFor={id} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer block mb-0.5">{label}</label>
          <input
            type="text"
            value={value}
            onChange={handleHexInput}
            maxLength={7}
            className="w-full text-xs font-mono font-bold text-gray-700 bg-transparent outline-none placeholder-gray-300"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}

export default function ColorsSection({ qr }) {
  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100/80 rounded-xl p-1">
        <button
          onClick={() => qr.setUseGradient(false)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!qr.useGradient ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
        >
          Single Color
        </button>
        <button
          onClick={() => qr.setUseGradient(true)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${qr.useGradient ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
        >
          Gradient
        </button>
      </div>
      {!qr.useGradient ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <ColorPick id="fgColor" label="QR Color" value={qr.fgColor} onChange={qr.setFgColor} />
          <ColorPick id="bgColor" label="Background" value={qr.bgColor} onChange={qr.setBgColor} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Prebuilt Gradients</label>
            <div className="flex flex-wrap gap-2">
              {[
                { c1: "#3b82f6", c2: "#9333ea" },
                { c1: "#ec4899", c2: "#ef4444" },
                { c1: "#10b981", c2: "#3b82f6" },
                { c1: "#f59e0b", c2: "#ef4444" },
                { c1: "#8b5cf6", c2: "#ec4899" },
                { c1: "#0ea5e9", c2: "#10b981" },
                { c1: "#f43f5e", c2: "#f97316" },
                { c1: "#6366f1", c2: "#a855f7" },
              ].map((grad, i) => (
                <button
                  key={i}
                  onClick={() => {
                    qr.setGradientColor1(grad.c1);
                    qr.setGradientColor2(grad.c2);
                  }}
                  className="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform duration-200 border border-white/50"
                  style={{ background: `linear-gradient(135deg, ${grad.c1}, ${grad.c2})` }}
                  title={`Gradient ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ColorPick id="gc1" label="Color 1" value={qr.gradientColor1} onChange={qr.setGradientColor1} />
            <ColorPick id="gc2" label="Color 2" value={qr.gradientColor2} onChange={qr.setGradientColor2} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gradient Type</label>
              <select
                className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl outline-none appearance-none cursor-pointer shadow-sm"
                value={qr.gradientType}
                onChange={(e) => qr.setGradientType(e.target.value)}
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>
            <ColorPick id="bgColor2" label="BG Color" value={qr.bgColor} onChange={qr.setBgColor} />
          </div>
        </div>
      )}
      <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
        <input
          type="checkbox"
          checked={qr.useCustomEyeColor}
          onChange={(e) => qr.setUseCustomEyeColor(e.target.checked)}
          className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700 font-semibold">Custom Eye Color</span>
      </label>
      <AnimatePresence>
        {qr.useCustomEyeColor && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <ColorPick id="eyeFrame" label="Eye Frame" value={qr.eyeFrameColor} onChange={qr.setEyeFrameColor} />
              <ColorPick id="eyeBall" label="Eye Ball" value={qr.eyeBallColor} onChange={qr.setEyeBallColor} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
