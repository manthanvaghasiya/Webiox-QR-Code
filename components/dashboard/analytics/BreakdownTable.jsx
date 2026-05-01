"use client";

export default function BreakdownTable({ title, rows, columnLabel = "Item" }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-ink-100 p-5">
        <h3 className="text-sm font-bold text-ink-900 mb-3">{title}</h3>
        <p className="text-xs text-ink-400 italic">No data yet</p>
      </div>
    );
  }

  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-5">
      <h3 className="text-sm font-bold text-ink-900 mb-4">{title}</h3>
      <div className="space-y-2.5">
        <div className="flex items-center text-[10px] uppercase tracking-wider text-ink-400 font-bold pb-2 border-b border-ink-100">
          <span className="w-6">#</span>
          <span className="flex-1">{columnLabel}</span>
          <span className="w-12 text-right">Scans</span>
          <span className="w-12 text-right">%</span>
        </div>
        {rows.slice(0, 10).map((r, i) => {
          const pct = total > 0 ? (r.count / total) * 100 : 0;
          return (
            <div key={r._id || i} className="flex items-center text-sm">
              <span className="w-6 text-xs text-ink-400 font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-ink-900 font-semibold truncate capitalize">{r._id || "Unknown"}</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="w-12 text-right text-ink-700 font-bold tabular-nums">{r.count}</span>
              <span className="w-12 text-right text-ink-400 font-mono text-xs tabular-nums">
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
