"use client";

import { ColorPick } from "./ColorsSection";

const FRAME_STYLES = [
  { id: "none", label: "None" },
  { id: "rounded-box", label: "Rounded Box" },
  { id: "banner-bottom", label: "Banner Bottom" },
  { id: "banner-top", label: "Banner Top" },
  { id: "speech-bubble", label: "Speech Bubble" },
  { id: "scan-corners", label: "Scan Corners" },
];

function FramePreview({ style, text = "SCAN ME", fillColor = "#4F46E5", textColor = "#fff" }) {
  const w = 60, h = 60, pad = 4;
  return (
    <svg viewBox={`0 0 ${w} ${h + (style === "none" ? 0 : 16)}`} className="w-full h-full">
      {/* QR placeholder */}
      <rect x={pad} y={style === "banner-top" ? 16 : 0} width={w - pad * 2} height={h - pad * 2} rx={4} fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1} />
      <text x={w / 2} y={(style === "banner-top" ? 16 : 0) + (h - pad * 2) / 2} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#9ca3af">QR</text>
      {/* Frame decorations */}
      {style === "rounded-box" && (
        <rect x={1} y={1} width={w - 2} height={h + 14} rx={8} fill="none" stroke={fillColor} strokeWidth={2} />
      )}
      {style === "banner-bottom" && (
        <g>
          <rect x={0} y={h - pad} width={w} height={16} rx={4} fill={fillColor} />
          <text x={w / 2} y={h - pad + 10} textAnchor="middle" dominantBaseline="middle" fontSize={6} fill={textColor} fontWeight="bold">{text}</text>
        </g>
      )}
      {style === "banner-top" && (
        <g>
          <rect x={0} y={0} width={w} height={14} rx={4} fill={fillColor} />
          <text x={w / 2} y={8} textAnchor="middle" dominantBaseline="middle" fontSize={6} fill={textColor} fontWeight="bold">{text}</text>
        </g>
      )}
      {style === "speech-bubble" && (
        <g>
          <rect x={4} y={h - 2} width={w - 8} height={14} rx={6} fill={fillColor} />
          <polygon points={`${w / 2 - 4},${h - 2} ${w / 2},${h - 6} ${w / 2 + 4},${h - 2}`} fill={fillColor} />
          <text x={w / 2} y={h + 7} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill={textColor} fontWeight="bold">{text}</text>
        </g>
      )}
      {style === "scan-corners" && (
        <g stroke={fillColor} strokeWidth={2.5} fill="none" strokeLinecap="round">
          <path d={`M${pad},${pad + 10} L${pad},${pad} L${pad + 10},${pad}`} />
          <path d={`M${w - pad - 10},${pad} L${w - pad},${pad} L${w - pad},${pad + 10}`} />
          <path d={`M${w - pad},${h - pad - 10} L${w - pad},${h - pad} L${w - pad - 10},${h - pad}`} />
          <path d={`M${pad + 10},${h - pad} L${pad},${h - pad} L${pad},${h - pad - 10}`} />
        </g>
      )}
    </svg>
  );
}

export default function FrameSection({ qr }) {
  return (
    <div className="space-y-4">
      {/* Frame style grid */}
      <div className="grid grid-cols-3 gap-2">
        {FRAME_STYLES.map((fs) => (
          <button
            key={fs.id}
            onClick={() => qr.setFrameStyle(fs.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
              qr.frameStyle === fs.id
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/30 shadow-md"
                : "border-gray-200/60 bg-white/50 hover:border-gray-300 hover:bg-white/80"
            }`}
          >
            <div className="w-12 h-14">
              <FramePreview style={fs.id} fillColor={qr.frameFillColor} textColor={qr.frameTextColor} />
            </div>
            <span className="text-[10px] font-semibold text-gray-600">{fs.label}</span>
          </button>
        ))}
      </div>

      {/* Frame options (when a frame is selected) */}
      {qr.frameStyle !== "none" && (
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Frame Text</label>
            <input
              type="text"
              maxLength={20}
              value={qr.frameText}
              onChange={(e) => qr.setFrameText(e.target.value)}
              placeholder="SCAN ME"
              className="w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm text-sm"
            />
            <p className="text-[10px] text-gray-400 mt-1">{qr.frameText.length}/20 characters</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ColorPick id="frameText" label="Text Color" value={qr.frameTextColor} onChange={qr.setFrameTextColor} />
            <ColorPick id="frameFill" label="Fill Color" value={qr.frameFillColor} onChange={qr.setFrameFillColor} />
          </div>
          <ColorPick id="frameBorder" label="Border Color" value={qr.frameBorderColor === "transparent" ? "#000000" : qr.frameBorderColor} onChange={qr.setFrameBorderColor} />
        </div>
      )}
    </div>
  );
}
