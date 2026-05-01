"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Edit2, Download, ScanLine, Users,
  Calendar, Pause, Play, RotateCcw, FileSpreadsheet,
  ChevronDown, Trash2, Copy, Check,
} from "lucide-react";
import { buildQrCodeStyling, downloadQrCode } from "@/lib/qrDownload";
import ScansChart from "./ScansChart";
import BreakdownTable from "./BreakdownTable";
import EditContentModal from "../modals/EditContentModal";
import EditShortUrlModal from "../modals/EditShortUrlModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { useRouter } from "next/navigation";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function activeForDays(createdAt) {
  if (!createdAt) return null;
  const days = Math.floor((Date.now() - new Date(createdAt)) / (24 * 3600 * 1000));
  return days;
}

function StatCard({ icon: Icon, label, value, hint, color = "from-brand-500 to-purple-600" }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-ink-900">{value}</p>
      {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function QrDetailShell({ qr: initialQr, analytics }) {
  const router = useRouter();
  const [qr, setQr] = useState(initialQr);
  const [showEdit, setShowEdit] = useState(false);
  const [showShortUrl, setShowShortUrl] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef(null);

  useEffect(() => {
    if (!qrContainerRef.current) return;
    const code = buildQrCodeStyling(qr, 300);
    qrContainerRef.current.innerHTML = "";
    code.append(qrContainerRef.current);
  }, [qr]);

  async function handlePauseToggle() {
    const next = !qr.isPaused;
    const res = await fetch(`/api/qrcodes/${qr._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaused: next }),
    });
    if (res.ok) setQr((p) => ({ ...p, isPaused: next }));
  }

  async function handleResetScans() {
    if (!confirm("Reset all scan history for this QR code? This can't be undone.")) return;
    const res = await fetch(`/api/qrcodes/${qr._id}/scans/reset`, { method: "POST" });
    if (res.ok) {
      router.refresh();
    }
  }

  function handleDownload() {
    downloadQrCode(qr, "png", 1024);
  }

  function copyShortUrl() {
    const url = qr.isDynamic
      ? `${window.location.origin}/r/${qr.shortId}`
      : qr.destination || qr.staticContent;
    if (!url) return;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const days = activeForDays(qr.createdAt);
  const shortUrl = qr.isDynamic
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/r/${qr.shortId}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumb / back */}
      <Link
        href="/dashboard/qr-codes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to QR Codes
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-6 mb-6">
        <div className="flex flex-wrap items-start gap-6">
          {/* QR preview */}
          <div className="flex-shrink-0">
            <div
              className="w-32 h-32 bg-white rounded-xl border border-ink-100 p-2 flex items-center justify-center [&_canvas]:!w-full [&_canvas]:!h-auto"
              ref={qrContainerRef}
            />
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-ink-100 text-ink-600 text-[10px] font-bold uppercase tracking-wider">
                {qr.type}
              </span>
              {qr.isPaused ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  Paused
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  {days != null ? `Active for ${days} day${days === 1 ? "" : "s"}` : "Active"}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-ink-900 mb-1">
              {qr.name || "Untitled QR Code"}
            </h1>
            {shortUrl ? (
              <button
                onClick={copyShortUrl}
                className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 transition-colors cursor-pointer font-mono"
              >
                {shortUrl.replace(/^https?:\/\//, "")}
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <p className="text-sm text-ink-500 truncate font-mono">
                {qr.destination || qr.staticContent}
              </p>
            )}

            {qr.isDynamic && qr.destination && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink-50 border border-ink-100 text-xs text-ink-500">
                <span className="font-bold uppercase tracking-wider text-[10px]">Destination:</span>
                <span className="truncate max-w-md">{qr.destination}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowEdit(true)}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            {qr.isDynamic && (
              <button
                onClick={handlePauseToggle}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
              >
                {qr.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Campaign meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-ink-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Campaign Start</p>
            <p className="text-sm font-semibold text-ink-700 mt-1">{formatDate(qr.campaignStart || qr.createdAt)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Campaign End</p>
            <p className="text-sm font-semibold text-ink-700 mt-1">{formatDate(qr.campaignEnd)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Print Run</p>
            <p className="text-sm font-semibold text-ink-700 mt-1">{qr.printRun ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Medium</p>
            <p className="text-sm font-semibold text-ink-700 mt-1">{qr.medium ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ScanLine}
          label="Total Scans"
          value={analytics.totalScans}
          color="from-brand-500 to-purple-600"
        />
        <StatCard
          icon={Users}
          label="Unique Scans"
          value={analytics.uniqueScans}
          color="from-emerald-500 to-teal-600"
        />
        <StatCard
          icon={Calendar}
          label="Days Active"
          value={days != null ? days : "—"}
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={ScanLine}
          label="Avg / Day"
          value={days > 0 ? (analytics.totalScans / days).toFixed(1) : analytics.totalScans}
          hint="Lifetime average"
          color="from-blue-500 to-indigo-600"
        />
      </div>

      {/* Chart card */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-ink-900">Scans over time</h2>
          <div className="flex items-center gap-2">
            <a
              href={`/api/qrcodes/${qr._id}/scans/csv`}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-ink-200 text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Download CSV
            </a>
            <button
              onClick={handleResetScans}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-ink-200 text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Scans
            </button>
          </div>
        </div>
        <ScansChart byDay={analytics.byDay} days={30} />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <BreakdownTable title="Operating System" rows={analytics.osBreakdown} columnLabel="OS" />
        <BreakdownTable title="Device" rows={analytics.deviceBreakdown} columnLabel="Device" />
        <BreakdownTable title="Browser" rows={analytics.browserBreakdown} columnLabel="Browser" />
        <BreakdownTable title="Top Countries" rows={analytics.countryBreakdown} columnLabel="Country" />
        <BreakdownTable title="Top Cities" rows={analytics.cityBreakdown} columnLabel="City" />
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-red-900">Delete this QR code</h3>
          <p className="text-xs text-red-600 mt-0.5">
            Permanent. Anyone scanning will see a "not found" page.
          </p>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>

      {/* Modals */}
      <EditContentModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        qr={qr}
        onSaved={(u) => setQr(u)}
      />
      <EditShortUrlModal
        open={showShortUrl}
        onClose={() => setShowShortUrl(false)}
        qr={qr}
        onSaved={(u) => setQr(u)}
      />
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        qr={qr}
        onDeleted={() => router.push("/dashboard/qr-codes")}
      />
    </div>
  );
}
