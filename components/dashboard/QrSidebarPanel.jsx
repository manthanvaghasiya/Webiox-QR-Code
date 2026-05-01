"use client";

import { useState } from "react";
import { Folder, FolderOpen, Plus, ScanLine, Sparkles, Inbox } from "lucide-react";
import Link from "next/link";

function FolderItem({ folder, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer",
        active
          ? "bg-brand-50 text-brand-700"
          : "text-ink-600 hover:bg-ink-100",
      ].join(" ")}
    >
      <Folder
        className="w-4 h-4 flex-shrink-0"
        style={{ color: folder.color || (active ? "#4F46E5" : "#8A93A8") }}
      />
      <span className="flex-1 text-left truncate">{folder.name}</span>
    </button>
  );
}

function formatDateMD(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export default function QrSidebarPanel({
  folders,
  folderFilter,
  onFolderFilterChange,
  onCreateFolder,
  summary,
}) {
  const [foldersOpen, setFoldersOpen] = useState(true);

  const dynamicLimit = summary?.dynamicLimit;
  const dynamicCount = summary?.dynamicCount ?? 0;
  const usagePct = dynamicLimit ? Math.min(100, (dynamicCount / dynamicLimit) * 100) : 0;

  return (
    <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-ink-100 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Weekly Scans widget */}
      <div className="p-4 border-b border-ink-100">
        <div className="flex items-center gap-2 mb-1">
          <ScanLine className="w-4 h-4 text-ink-400" />
          <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
            Weekly Scans
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-ink-900 leading-none">
            {summary?.weeklyScans ?? 0}
          </span>
        </div>
        {summary?.weeklyScansSince && (
          <p className="mt-1 text-xs text-ink-400 italic">
            since {formatDateMD(summary.weeklyScansSince)}
          </p>
        )}
      </div>

      {/* Folders */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setFoldersOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500 hover:text-ink-900 transition-colors cursor-pointer"
          >
            {foldersOpen ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
            Folders
          </button>
          <button
            onClick={onCreateFolder}
            aria-label="Create folder"
            className="p-1 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-900 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {foldersOpen && (
          <div className="space-y-0.5">
            <button
              onClick={() => onFolderFilterChange("all")}
              className={[
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                folderFilter === "all"
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-ink-100",
              ].join(" ")}
            >
              <Inbox
                className="w-4 h-4 flex-shrink-0"
                style={{ color: folderFilter === "all" ? "#4F46E5" : "#8A93A8" }}
              />
              <span className="flex-1 text-left">All QR Codes</span>
            </button>
            <button
              onClick={() => onFolderFilterChange("unassigned")}
              className={[
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                folderFilter === "unassigned"
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-ink-100",
              ].join(" ")}
            >
              <Folder
                className="w-4 h-4 flex-shrink-0"
                style={{ color: folderFilter === "unassigned" ? "#4F46E5" : "#8A93A8" }}
              />
              <span className="flex-1 text-left">No folder</span>
            </button>

            {folders?.map((f) => (
              <FolderItem
                key={f._id}
                folder={f}
                active={folderFilter === f._id}
                onClick={() => onFolderFilterChange(f._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Plan usage / Overview */}
      <div className="p-4 border-t border-ink-100 space-y-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">
            Overview
          </div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-ink-600 font-semibold">Dynamic QR Codes</span>
            <span className="text-ink-900 font-bold">
              {dynamicCount}
              {dynamicLimit ? ` of ${dynamicLimit}` : ""}
            </span>
          </div>
          {dynamicLimit && (
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-600 rounded-full transition-all"
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
        </div>

        {summary?.plan === "free" && (
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-1.5 w-full h-10 rounded-full border-2 border-brand-500 text-sm font-bold text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade
          </Link>
        )}
      </div>
    </aside>
  );
}
