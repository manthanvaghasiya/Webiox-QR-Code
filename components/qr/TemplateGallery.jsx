"use client";

import React from "react";
import { QR_TEMPLATES } from "@/lib/qrTemplates";

function MiniQR({ settings, id }) {
  const cells = [];
  const seed = settings.fgColor ? settings.fgColor.charCodeAt(1) : 7;
  const isRounded = settings.dotPattern === "rounded" || settings.dotPattern === "dots" || settings.dotPattern === "classy";
  const c1 = settings.useGradient ? settings.gradientColor1 : (settings.fgColor || "#000");
  const c2 = settings.useGradient ? settings.gradientColor2 : c1;
  const bg = settings.bgColor || "#fff";
  const gradId = `mini-qr-${id || "x"}`;

  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const corner = (x < 3 && y < 3) || (x > 3 && y < 3) || (x < 3 && y > 3);
      const idx = y * 7 + x;
      const fill = corner ? false : ((idx * seed) % 5) > 2;
      if (corner || fill) {
        cells.push(
          <rect key={`${x}-${y}`} x={x * 10 + 2} y={y * 10 + 2} width={8} height={8}
            rx={isRounded ? 3 : 0.5} fill={`url(#${gradId})`} />
        );
      }
    }
  }

  return (
    <svg viewBox="0 0 74 74" className="w-full h-full">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="74" height="74" rx={6} fill={bg} />
      {[[2, 2], [42, 2], [2, 42]].map(([ex, ey]) => (
        <g key={`${ex}-${ey}`}>
          <rect x={ex} y={ey} width={24} height={24}
            rx={isRounded ? 6 : 2} fill="none" stroke={`url(#${gradId})`} strokeWidth={3} />
          <rect x={ex + 8} y={ey + 8} width={8} height={8}
            rx={isRounded ? 4 : 1} fill={`url(#${gradId})`} />
        </g>
      ))}
      {cells}
    </svg>
  );
}

const TemplateGallery = React.memo(function TemplateGallery({ onApply }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {QR_TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onApply(t.settings)}
          className="flex-shrink-0 group flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-sm hover:bg-white/90 hover:shadow-lg transition-all w-[100px]"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
            <MiniQR settings={t.settings} id={t.id} />
          </div>
          <span className="text-[10px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight truncate w-full">
            {t.name}
          </span>
        </button>
      ))}
    </div>
  );
});

TemplateGallery.displayName = "TemplateGallery";
export default TemplateGallery;
