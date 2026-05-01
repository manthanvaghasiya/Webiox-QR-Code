"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ColorPick } from "./ColorsSection";

const FRAME_STYLES = [
  { id: "none",            label: "None",           category: "basic" },
  { id: "rounded-box",     label: "Rounded Box",    category: "basic" },
  { id: "banner-bottom",   label: "Banner Bottom",  category: "basic" },
  { id: "banner-top",      label: "Banner Top",     category: "basic" },
  { id: "speech-bubble",   label: "Speech Bubble",  category: "basic" },
  { id: "scan-corners",    label: "Scan Corners",   category: "basic" },
  { id: "circle-badge",    label: "Badge",          category: "premium" },
  { id: "ticket",          label: "Ticket",         category: "premium" },
  { id: "gradient-border", label: "Gradient",       category: "premium" },
  { id: "shadow-card",     label: "Shadow Card",    category: "premium" },
  { id: "dotted-border",   label: "Dotted",         category: "premium" },
  { id: "double-border",   label: "Double",         category: "premium" },
  { id: "arrow-down",      label: "Arrow Down",     category: "premium" },
  { id: "stamp",           label: "Stamp",          category: "premium" },
];

function FramePreview({ style, fillColor = "#4F46E5", textColor = "#fff" }) {
  const w = 56, h = 56, pad = 6;
  const qrX = pad, qrW = w - pad * 2, qrH = h - pad * 2;

  // Helper: small QR grid
  const QrMini = ({ x, y, size }) => (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={3} fill="#f3f4f6" />
      {[0, 1, 2].map(r =>
        [0, 1, 2].map(c => (
          <rect
            key={`${r}-${c}`}
            x={x + size * 0.15 + c * (size * 0.22)}
            y={y + size * 0.15 + r * (size * 0.22)}
            width={size * 0.18}
            height={size * 0.18}
            rx={1}
            fill="#d1d5db"
          />
        ))
      )}
    </g>
  );

  if (style === "none") {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <QrMini x={pad} y={pad} size={qrW} />
        <line x1={pad + 4} y1={pad + 4} x2={w - pad - 4} y2={h - pad - 4} stroke="#ef4444" strokeWidth={1.5} opacity={0.5} />
      </svg>
    );
  }

  if (style === "rounded-box") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 14}`} className="w-full h-full">
        <rect x={2} y={2} width={w - 4} height={h + 10} rx={8} fill="none" stroke={fillColor} strokeWidth={2.5} />
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <rect x={pad} y={h - 4} width={qrW} height={12} rx={4} fill={fillColor} />
        <text x={w / 2} y={h + 3} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={textColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  if (style === "banner-bottom") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 12}`} className="w-full h-full">
        <QrMini x={pad} y={pad - 2} size={qrW} />
        <rect x={0} y={h - 4} width={w} height={14} rx={0} fill={fillColor} />
        <text x={w / 2} y={h + 4} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={textColor} fontWeight="bold">SCAN ME</text>
      </svg>
    );
  }

  if (style === "banner-top") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 12}`} className="w-full h-full">
        <rect x={0} y={0} width={w} height={14} rx={0} fill={fillColor} />
        <text x={w / 2} y={8} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={textColor} fontWeight="bold">SCAN ME</text>
        <QrMini x={pad} y={16} size={qrW} />
      </svg>
    );
  }

  if (style === "speech-bubble") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full h-full">
        <QrMini x={pad} y={pad - 2} size={qrW} />
        <polygon points={`${w / 2 - 5},${h - 2} ${w / 2},${h - 7} ${w / 2 + 5},${h - 2}`} fill={fillColor} />
        <rect x={6} y={h - 2} width={w - 12} height={14} rx={7} fill={fillColor} />
        <text x={w / 2} y={h + 6} textAnchor="middle" dominantBaseline="middle" fontSize={4.5} fill={textColor} fontWeight="bold">SCAN ME</text>
      </svg>
    );
  }

  if (style === "scan-corners") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full h-full">
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <g stroke={fillColor} strokeWidth={3} fill="none" strokeLinecap="round">
          <path d={`M${pad},${pad + 12} L${pad},${pad} L${pad + 12},${pad}`} />
          <path d={`M${w - pad - 12},${pad} L${w - pad},${pad} L${w - pad},${pad + 12}`} />
          <path d={`M${w - pad},${h - pad - 12} L${w - pad},${h - pad} L${w - pad - 12},${h - pad}`} />
          <path d={`M${pad + 12},${h - pad} L${pad},${h - pad} L${pad},${h - pad - 12}`} />
        </g>
        <text x={w / 2} y={h + 5} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={fillColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  if (style === "circle-badge") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 16}`} className="w-full h-full">
        <rect x={2} y={2} width={w - 4} height={h + 12} rx={10} fill="none" stroke={fillColor} strokeWidth={2.5} />
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <rect x={8} y={h - 2} width={w - 16} height={12} rx={6} fill={fillColor} />
        <text x={w / 2} y={h + 5} textAnchor="middle" dominantBaseline="middle" fontSize={4.5} fill={textColor} fontWeight="bold">📱 SCAN</text>
      </svg>
    );
  }

  if (style === "ticket") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 16}`} className="w-full h-full">
        <rect x={2} y={2} width={w - 4} height={h + 12} rx={8} fill="none" stroke={fillColor} strokeWidth={2} />
        <circle cx={0} cy={(h + 16) / 2} r={6} fill={fillColor} />
        <circle cx={w} cy={(h + 16) / 2} r={6} fill={fillColor} />
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <line x1={10} y1={h - 2} x2={w - 10} y2={h - 2} stroke={fillColor} strokeWidth={1} strokeDasharray="3,2" opacity={0.5} />
        <text x={w / 2} y={h + 7} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={fillColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  if (style === "gradient-border") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 14}`} className="w-full h-full">
        <defs>
          <linearGradient id="grd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={fillColor} />
            <stop offset="100%" stopColor={adjustColor(fillColor, 50)} />
          </linearGradient>
        </defs>
        <rect x={1} y={1} width={w - 2} height={h + 12} rx={10} fill="url(#grd)" />
        <rect x={4} y={4} width={w - 8} height={h + 6} rx={7} fill="#fff" />
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <rect x={10} y={h - 2} width={w - 20} height={10} rx={4} fill="url(#grd)" />
        <text x={w / 2} y={h + 4} textAnchor="middle" dominantBaseline="middle" fontSize={4.5} fill={textColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  if (style === "shadow-card") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 14}`} className="w-full h-full">
        <rect x={4} y={6} width={w - 8} height={h + 4} rx={12} fill={fillColor} opacity={0.15} />
        <rect x={2} y={2} width={w - 4} height={h + 4} rx={12} fill="#fff" stroke="#e5e7eb" strokeWidth={1} />
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <text x={w / 2} y={h} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={fillColor} fontWeight="bold">SCAN ME</text>
      </svg>
    );
  }

  if (style === "dotted-border") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 12}`} className="w-full h-full">
        <rect x={3} y={3} width={w - 6} height={h + 6} rx={8} fill="none" stroke={fillColor} strokeWidth={2} strokeDasharray="4,3" />
        <QrMini x={pad + 2} y={pad} size={qrW - 4} />
        <text x={w / 2} y={h + 3} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={fillColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  if (style === "double-border") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 12}`} className="w-full h-full">
        <rect x={2} y={2} width={w - 4} height={h + 8} rx={10} fill="none" stroke={fillColor} strokeWidth={2} />
        <rect x={6} y={6} width={w - 12} height={h} rx={6} fill="none" stroke={fillColor} strokeWidth={1.5} />
        <QrMini x={pad + 4} y={pad + 2} size={qrW - 8} />
        <text x={w / 2} y={h + 4} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={fillColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  if (style === "arrow-down") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full h-full">
        <rect x={0} y={0} width={w} height={14} rx={4} fill={fillColor} />
        <text x={w / 2} y={8} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={textColor} fontWeight="bold">SCAN ME</text>
        <polygon points={`${w / 2 - 6},14 ${w / 2 + 6},14 ${w / 2},22`} fill={fillColor} />
        <QrMini x={pad} y={22} size={qrW} />
      </svg>
    );
  }

  if (style === "stamp") {
    return (
      <svg viewBox={`0 0 ${w} ${h + 14}`} className="w-full h-full">
        <rect x={1} y={1} width={w - 2} height={h + 12} rx={2} fill={fillColor} />
        {/* Perforations */}
        {[...Array(6)].map((_, i) => (
          <circle key={`t${i}`} cx={4 + i * 10} cy={2} r={2.5} fill="#fff" />
        ))}
        {[...Array(6)].map((_, i) => (
          <circle key={`b${i}`} cx={4 + i * 10} cy={h + 12} r={2.5} fill="#fff" />
        ))}
        <rect x={5} y={5} width={w - 10} height={h - 6} rx={2} fill="#fff" />
        <QrMini x={pad + 2} y={pad + 2} size={qrW - 6} />
        <text x={w / 2} y={h + 5} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={textColor} fontWeight="bold">SCAN</text>
      </svg>
    );
  }

  return null;
}

function adjustColor(hex, amount) {
  try {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return hex;
  }
}

export default function FrameSection({ qr }) {
  const basicFrames = FRAME_STYLES.filter((f) => f.category === "basic");
  const premiumFrames = FRAME_STYLES.filter((f) => f.category === "premium");

  return (
    <div className="space-y-6">
      {/* Basic frames */}
      <div>
        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-brand-500 rounded-full" />
          Basic Frames
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {basicFrames.map((fs) => {
            const active = qr.frameStyle === fs.id;
            return (
              <motion.button
                key={fs.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => qr.setFrameStyle(fs.id)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  active
                    ? "border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-500/20"
                    : "border-gray-200/60 bg-white/60 hover:bg-white hover:border-brand-200 hover:shadow-sm"
                }`}
              >
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                <div className="w-12 h-14">
                  <FramePreview style={fs.id} fillColor={qr.frameFillColor} textColor={qr.frameTextColor} />
                </div>
                <span className={`text-[10px] font-bold ${active ? "text-brand-700" : "text-gray-500"}`}>{fs.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Premium frames */}
      <div>
        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-purple-500 rounded-full" />
          Premium Frames
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {premiumFrames.map((fs) => {
            const active = qr.frameStyle === fs.id;
            return (
              <motion.button
                key={fs.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => qr.setFrameStyle(fs.id)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  active
                    ? "border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-500/20"
                    : "border-gray-200/60 bg-white/60 hover:bg-white hover:border-brand-200 hover:shadow-sm"
                }`}
              >
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                <div className="w-12 h-14">
                  <FramePreview style={fs.id} fillColor={qr.frameFillColor} textColor={qr.frameTextColor} />
                </div>
                <span className={`text-[10px] font-bold ${active ? "text-brand-700" : "text-gray-500"}`}>{fs.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Frame customization options */}
      {qr.frameStyle !== "none" && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 p-4 bg-white/40 backdrop-blur-sm rounded-3xl border border-gray-100/50">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-4 bg-pink-500 rounded-full" />
              Customize Frame
            </label>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Frame Text</label>
              <input
                type="text"
                maxLength={20}
                value={qr.frameText}
                onChange={(e) => qr.setFrameText(e.target.value)}
                placeholder="SCAN ME"
                className="w-full p-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm text-sm font-medium"
              />
              <p className="text-[10px] text-gray-400 mt-1 font-medium">{qr.frameText.length}/20 characters</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColorPick id="frameText" label="Text Color" value={qr.frameTextColor} onChange={qr.setFrameTextColor} />
              <ColorPick id="frameFill" label="Fill Color" value={qr.frameFillColor} onChange={qr.setFrameFillColor} />
            </div>
            <ColorPick
              id="frameBorder"
              label="Border Color"
              value={qr.frameBorderColor === "transparent" ? "#000000" : qr.frameBorderColor}
              onChange={qr.setFrameBorderColor}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
