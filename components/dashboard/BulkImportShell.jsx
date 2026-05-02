"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileSpreadsheet, Check, AlertTriangle } from "lucide-react";

const SAMPLE_CSV = `name,destination,isDynamic
Spring promo,https://example.com/spring,true
Summer promo,https://example.com/summer,true
Fall promo,https://example.com/fall,true`;

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const split = (line) => {
    const out = [];
    let cur = "";
    let q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === "," && !q) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };
  const headers = split(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1).filter(Boolean).map((line) => {
    const cells = split(line);
    const obj = {};
    headers.forEach((h, i) => (obj[h] = cells[i] ?? ""));
    if (obj.isdynamic !== undefined) {
      obj.isDynamic = obj.isdynamic.toLowerCase() === "true";
      delete obj.isdynamic;
    }
    return obj;
  });
  return { headers, rows };
}

export default function BulkImportShell() {
  const [csvText, setCsvText] = useState("");
  const [parsed, setParsed] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      setCsvText(text);
      setParsed(parseCsv(text));
      setResult(null);
      setError(null);
    };
    reader.readAsText(file);
  }

  function handleTextChange(text) {
    setCsvText(text);
    setParsed(parseCsv(text));
    setResult(null);
    setError(null);
  }

  async function handleImport() {
    if (parsed.rows.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qrcodes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsed.rows, design: {} }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed.");
      setResult(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setCsvText(SAMPLE_CSV);
    setParsed(parseCsv(SAMPLE_CSV));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/dashboard/qr-codes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to QR Codes
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Bulk create from CSV</h1>
        <p className="text-sm text-ink-500 mt-1">
          Upload a CSV with <code className="px-1.5 py-0.5 rounded bg-ink-100 text-xs font-mono">name,destination,isDynamic</code> columns.
          Up to 500 rows per import.
        </p>
      </div>

      {result ? (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink-900">Import complete</h2>
              <p className="text-sm text-ink-500">
                {result.created} created
                {result.failed > 0 && <> · <span className="text-red-600 font-semibold">{result.failed} failed</span></>}
              </p>
            </div>
          </div>
          {result.failed > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
              <p className="text-xs font-bold text-red-900 mb-2">Failed rows:</p>
              <ul className="text-xs text-red-700 space-y-1 max-h-40 overflow-y-auto">
                {result.results.failed.map((f, i) => (
                  <li key={i} className="font-mono">
                    {f.row?.destination || "(empty)"} — {f.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2 mt-5">
            <Link
              href="/dashboard/qr-codes"
              className="flex-1 inline-flex items-center justify-center h-10 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              View QR Codes
            </Link>
            <button
              onClick={() => { setResult(null); setCsvText(""); setParsed({ headers: [], rows: [] }); }}
              className="flex-1 inline-flex items-center justify-center h-10 rounded-full border border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
            >
              Import more
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Upload + paste */}
          <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-6 mb-5">
            <label className="block">
              <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
              <div className="border-2 border-dashed border-ink-200 rounded-2xl px-6 py-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all">
                <Upload className="w-8 h-8 mx-auto text-ink-400 mb-2" />
                <p className="text-sm font-bold text-ink-900">Drop CSV here or click to upload</p>
                <p className="text-xs text-ink-500 mt-1">UTF-8 encoded · max 500 rows · 2MB</p>
              </div>
            </label>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">
                Or paste CSV
              </label>
              <textarea
                value={csvText}
                onChange={(e) => handleTextChange(e.target.value)}
                rows={6}
                placeholder={SAMPLE_CSV}
                className="w-full p-3 rounded-xl border border-ink-200 text-xs font-mono text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
              />
              <button
                onClick={loadSample}
                className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
              >
                Load sample
              </button>
            </div>
          </div>

          {/* Preview */}
          {parsed.rows.length > 0 && (
            <div className="bg-white rounded-3xl border border-ink-100 shadow-card overflow-hidden mb-5">
              <div className="px-6 py-4 flex items-center justify-between border-b border-ink-100">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-bold text-ink-900">Preview</span>
                  <span className="text-xs text-ink-400">{parsed.rows.length} rows</span>
                </div>
                {parsed.rows.length > 500 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Only first 500 will import
                  </span>
                )}
              </div>
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-ink-50 sticky top-0">
                    <tr>
                      {parsed.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-bold uppercase tracking-wider text-ink-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 50).map((row, i) => (
                      <tr key={i} className="border-t border-ink-100">
                        {parsed.headers.map((h) => (
                          <td key={h} className="px-4 py-2 text-ink-700 font-mono truncate max-w-xs">
                            {String(row[h] ?? row[h.toLowerCase()] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.rows.length > 50 && (
                  <p className="text-center text-xs text-ink-400 py-2">
                    …and {parsed.rows.length - 50} more
                  </p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 mb-5">
              {error}
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={parsed.rows.length === 0 || loading}
            className="w-full h-12 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Importing…"
              : parsed.rows.length === 0
                ? "Add CSV to begin"
                : `Import ${Math.min(parsed.rows.length, 500)} QR codes`}
          </button>
        </>
      )}
    </div>
  );
}
