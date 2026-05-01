"use client";

import { useMemo, useState } from "react";

function fillMissingDays(rows, days = 30) {
  const map = new Map(rows.map((r) => [r._id, r]));
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const row = map.get(key);
    out.push({
      date: key,
      label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      total: row?.count ?? 0,
      unique: row?.uniqueCount ?? 0,
    });
  }
  return out;
}

export default function ScansChart({ byDay, days = 30 }) {
  const [hover, setHover] = useState(null);
  const data = useMemo(() => fillMissingDays(byDay, days), [byDay, days]);

  const maxValue = Math.max(1, ...data.map((d) => d.total));
  const W = 100;
  const H = 60;
  const padX = 0.5;
  const padY = 6;
  const colWidth = (W - padX * 2) / data.length;
  const barWidth = Math.max(0.5, colWidth * 0.55);

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-ink-500 mb-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Unique
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" /> Total
        </span>
      </div>

      {/* Chart */}
      <div className="relative w-full h-56 bg-ink-50/50 rounded-2xl border border-ink-100 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
          {/* Gridlines */}
          {[0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1="0"
              y1={padY + (H - padY * 2) * (1 - p)}
              x2={W}
              y2={padY + (H - padY * 2) * (1 - p)}
              stroke="#E1E5EF"
              strokeWidth="0.1"
              strokeDasharray="0.4 0.4"
            />
          ))}

          {data.map((d, i) => {
            const x = padX + i * colWidth + (colWidth - barWidth) / 2;
            const totalH = ((H - padY * 2) * d.total) / maxValue;
            const uniqueH = ((H - padY * 2) * d.unique) / maxValue;
            return (
              <g key={d.date}>
                {/* Total (blue) */}
                <rect
                  x={x}
                  y={H - padY - totalH}
                  width={barWidth}
                  height={totalH}
                  rx="0.4"
                  fill="#4F46E5"
                  opacity={hover === null || hover === i ? 0.95 : 0.4}
                />
                {/* Unique (green) — overlay */}
                <rect
                  x={x}
                  y={H - padY - uniqueH}
                  width={barWidth}
                  height={uniqueH}
                  rx="0.4"
                  fill="#10B981"
                  opacity={hover === null || hover === i ? 1 : 0.5}
                />
                {/* Hover hitbox */}
                <rect
                  x={padX + i * colWidth}
                  y="0"
                  width={colWidth}
                  height={H}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hover !== null && (
          <div
            className="absolute top-2 px-3 py-1.5 bg-ink-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
            style={{ left: `${(hover / data.length) * 100}%`, transform: "translateX(4px)" }}
          >
            <div className="font-bold">{data[hover].label}</div>
            <div>Total: {data[hover].total}</div>
            <div>Unique: {data[hover].unique}</div>
          </div>
        )}
      </div>

      {/* X-axis labels — every Nth */}
      <div className="flex justify-between mt-2 text-[10px] text-ink-400 font-mono">
        {data
          .filter((_, i) => i % Math.ceil(data.length / 8) === 0 || i === data.length - 1)
          .map((d) => (
            <span key={d.date}>{d.label}</span>
          ))}
      </div>
    </div>
  );
}
