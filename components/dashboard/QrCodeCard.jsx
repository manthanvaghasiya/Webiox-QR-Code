"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, BarChart2, ExternalLink, PauseCircle } from "lucide-react";
import Link from "next/link";
import { buildQrCodeStyling } from "@/lib/qrDownload";
import QrCardMenu from "./QrCardMenu";

function typeLabel(t) {
  if (!t) return "QR";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function formatRelative(date) {
  if (!date) return null;
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (24 * 3600 * 1000));
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function QrCodeCard({
  qr,
  view = "grid",
  selected = false,
  onToggleSelected,
  onDownload,
  onEditContent,
  onEditShortUrl,
  onMoveToFolder,
  onPauseToggle,
  onDelete,
}) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const qrCode = buildQrCodeStyling(qr, 400);
    containerRef.current.innerHTML = "";
    qrCode.append(containerRef.current);
  }, [qr]);

  const shortUrl = qr.isDynamic
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/r/${qr.shortId}`
    : null;

  function copyLink() {
    const text = shortUrl || qr.destination || qr.staticContent || "";
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (view === "list") {
    return (
      <div
        className={[
          "flex items-center gap-4 bg-white rounded-2xl border px-4 py-3 transition-shadow hover:shadow-md group",
          selected ? "border-brand-500 ring-2 ring-brand-100" : "border-ink-100",
          qr.isPaused ? "opacity-70" : "",
        ].join(" ")}
      >
        {onToggleSelected && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelected(qr._id)}
            className="w-4 h-4 rounded text-brand-600 cursor-pointer"
            aria-label="Select"
          />
        )}
        <div className="w-14 h-14 flex-shrink-0 bg-white rounded-lg border border-ink-100 p-1 [&_canvas]:!w-full [&_canvas]:!h-full" ref={containerRef} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-ink-900 truncate">
              {qr.name || `Untitled ${typeLabel(qr.type)}`}
            </h3>
            <span className="px-1.5 py-px rounded-md bg-ink-100 text-ink-600 text-[10px] font-bold uppercase tracking-wider">
              {typeLabel(qr.type)}
            </span>
            {qr.isPaused && (
              <span className="flex items-center gap-1 px-1.5 py-px rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                <PauseCircle className="w-3 h-3" /> Paused
              </span>
            )}
            {!qr.isPaused && qr.isDynamic && (
              <span className="px-1.5 py-px rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-ink-500">
            {shortUrl && <span className="font-mono truncate">{shortUrl.replace(/^https?:\/\//, "")}</span>}
            {qr.destination && !shortUrl && (
              <span className="truncate">{qr.destination}</span>
            )}
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <BarChart2 className="w-3.5 h-3.5 text-brand-500" />
              {qr.scanCount || 0} scans
            </span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline flex-shrink-0">{formatRelative(qr.createdAt)}</span>
          </div>
        </div>
        <button
          onClick={copyLink}
          title="Copy link"
          className="p-2 text-ink-400 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
        <QrCardMenu
          qr={qr}
          onDownload={onDownload}
          onEditContent={onEditContent}
          onEditShortUrl={onEditShortUrl}
          onMoveToFolder={onMoveToFolder}
          onPauseToggle={onPauseToggle}
          onDelete={onDelete}
        />
      </div>
    );
  }

  // Grid view
  return (
    <div
      className={[
        "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group relative",
        selected ? "border-brand-500 ring-2 ring-brand-100" : "border-ink-100",
        qr.isPaused ? "opacity-80" : "",
      ].join(" ")}
    >
      {onToggleSelected && (
        <label className="absolute top-3 left-3 z-10 cursor-pointer">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelected(qr._id)}
            className="w-4 h-4 rounded text-brand-600 cursor-pointer"
            aria-label="Select"
          />
        </label>
      )}

      <div className="absolute top-3 right-3 z-10">
        <QrCardMenu
          qr={qr}
          onDownload={onDownload}
          onEditContent={onEditContent}
          onEditShortUrl={onEditShortUrl}
          onMoveToFolder={onMoveToFolder}
          onPauseToggle={onPauseToggle}
          onDelete={onDelete}
        />
      </div>

      <div className="p-4 flex flex-col items-center justify-center bg-ink-50/50 border-b border-ink-100 relative pt-10">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
          <span className="px-2 py-0.5 rounded-md bg-ink-100 text-ink-600 text-[10px] font-bold uppercase tracking-wider">
            {typeLabel(qr.type)}
          </span>
          {qr.isPaused ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
              <PauseCircle className="w-3 h-3" /> Paused
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              Active
            </span>
          )}
        </div>
        <div
          className="w-32 h-32 bg-white rounded-xl shadow-sm p-2 flex items-center justify-center [&_canvas]:!w-full [&_canvas]:!h-auto"
          ref={containerRef}
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-ink-900 truncate">
          {qr.name || `Untitled ${typeLabel(qr.type)}`}
        </h3>
        <p className="text-xs text-ink-500 truncate mt-0.5">
          {shortUrl ? shortUrl.replace(/^https?:\/\//, "") : qr.destination || "No destination"}
        </p>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-ink-100">
          <Link
            href={`/dashboard/qr/${qr._id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-brand-600 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-brand-500" />
            {qr.scanCount || 0} scans
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={copyLink}
              className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onDownload}
              className="p-1.5 text-ink-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
              title="Download"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
