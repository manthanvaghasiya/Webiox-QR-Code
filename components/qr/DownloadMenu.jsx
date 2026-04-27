"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronDown, FileImage, FileCode, FileText, Image } from "lucide-react";

const FORMATS = [
  { ext: "png",  label: "PNG",  desc: "Best for web",     icon: FileImage },
  { ext: "svg",  label: "SVG",  desc: "Vector / scalable", icon: FileCode },
  { ext: "webp", label: "WebP", desc: "Modern / smaller",  icon: Image },
  { ext: "jpg",  label: "JPG",  desc: "Universal photo",   icon: FileImage },
  { ext: "pdf",  label: "PDF",  desc: "Print-ready A4",    icon: FileText },
];

export default function DownloadMenu({ onDownload, disabled, lastFormat }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Sort so lastFormat is first
  const sorted = [...FORMATS].sort((a, b) => {
    if (a.ext === lastFormat) return -1;
    if (b.ext === lastFormat) return 1;
    return 0;
  });

  return (
    <div ref={menuRef} className="relative w-full">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={`w-full py-4 px-6 font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-blue-600/25"
        }`}
      >
        <Download className="w-5 h-5" />
        Download QR
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl border border-gray-200/60 shadow-2xl overflow-hidden z-50"
          >
            {sorted.map((f) => (
              <button
                key={f.ext}
                onClick={() => { onDownload(f.ext); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors group ${
                  f.ext === lastFormat ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <f.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">
                  .{f.ext}
                </span>
                {f.ext === lastFormat && (
                  <span className="text-[9px] font-bold text-blue-600 uppercase">Recent</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
