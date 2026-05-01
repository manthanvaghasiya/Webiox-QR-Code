"use client";

import { useState, useTransition } from "react";
import { runEnsureIndexes, clearOldScanEvents } from "@/app/admin/actions";
import { Database, Trash2, BarChart2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function ActionCard({ icon: Icon, title, description, action, destructive = false }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleClick() {
    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await action();
        setResult(res ?? { ok: true });
      } catch (e) {
        setError(e.message ?? "Action failed.");
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            destructive ? "bg-red-100" : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${destructive ? "text-red-600" : "text-gray-600"}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>

          {result && (
            <div className="mt-3 flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                {typeof result === "object"
                  ? JSON.stringify(result, null, 0)
                  : String(result)}
              </span>
            </div>
          )}
          {error && (
            <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleClick}
          disabled={pending}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
            destructive
              ? "bg-red-50 text-red-700 hover:bg-red-100"
              : "bg-gray-900 text-white hover:bg-black"
          }`}
        >
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Run
        </button>
      </div>
    </div>
  );
}

function DbStatsCard() {
  const [pending, startTransition] = useTransition();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  function fetchStats() {
    setStats(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/db-stats", { method: "POST" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">DB Stats</h3>
          <p className="text-xs text-gray-500 mt-1">
            Document counts per collection in the current database.
          </p>

          {stats && (
            <div className="mt-3 rounded-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-gray-500 font-semibold">
                      Collection
                    </th>
                    <th className="px-3 py-2 text-right text-gray-500 font-semibold">
                      Documents
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.collections?.map((c) => (
                    <tr key={c.name}>
                      <td className="px-3 py-2 font-mono text-gray-700">
                        {c.name}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">
                        {c.count.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {error && (
            <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
        <button
          onClick={fetchStats}
          disabled={pending}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-60"
        >
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Run
        </button>
      </div>
    </div>
  );
}

export default function SystemActions() {
  return (
    <div className="space-y-4 max-w-2xl">
      <ActionCard
        icon={Database}
        title="Run ensureIndexes()"
        description="Creates all required MongoDB indexes for every collection. Safe to run multiple times — MongoDB skips existing indexes."
        action={runEnsureIndexes}
      />

      <DbStatsCard />

      <ActionCard
        icon={Trash2}
        title="Clear scan_events older than 1 year"
        description="Permanently deletes scan events with a timestamp older than 365 days. This reduces collection size. The TTL index handles this automatically over time, but this forces an immediate purge."
        action={clearOldScanEvents}
        destructive
      />
    </div>
  );
}
