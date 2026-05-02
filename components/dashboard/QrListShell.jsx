"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Filter, LayoutGrid, List, ArrowUpDown, X,
  Plus, Trash2, Pause, Play, ChevronDown, QrCode, FileSpreadsheet,
} from "lucide-react";
import QrCodeCard from "./QrCodeCard";
import EditContentModal from "./modals/EditContentModal";
import EditShortUrlModal from "./modals/EditShortUrlModal";
import MoveToFolderModal from "./modals/MoveToFolderModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import CreateFolderModal from "./modals/CreateFolderModal";
import QrSidebarPanel from "./QrSidebarPanel";
import EmptyState from "./EmptyState";
import { downloadQrCode } from "@/lib/qrDownload";

const SORTS = [
  { value: "recent", label: "Last created" },
  { value: "oldest", label: "Oldest first" },
  { value: "scans", label: "Most scans" },
  { value: "name", label: "Name (A→Z)" },
];

const STATUSES = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
];

function Dropdown({ value, options, onChange, label, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-ink-200 bg-white text-sm font-semibold text-ink-700 hover:border-ink-300 transition-colors cursor-pointer"
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-ink-400" />}
        <span className="text-xs uppercase tracking-wide text-ink-400">{label}</span>
        <span>{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-30 w-44 bg-white rounded-2xl shadow-glow border border-ink-100 overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={[
                "block w-full text-left px-3.5 py-2 text-sm transition-colors cursor-pointer",
                opt.value === value
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-ink-700 hover:bg-ink-50",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QrListShell({ initialQrs, initialFolders, initialSummary }) {
  const [qrs, setQrs] = useState(initialQrs || []);
  const [folders, setFolders] = useState(initialFolders || []);
  const [summary, setSummary] = useState(initialSummary || null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [folderFilter, setFolderFilter] = useState("all"); // "all" | "unassigned" | folderId
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(new Set());

  const [activeQr, setActiveQr] = useState(null);
  const [showEditContent, setShowEditContent] = useState(false);
  const [showEditShortUrl, setShowEditShortUrl] = useState(false);
  const [showMoveFolder, setShowMoveFolder] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  // Re-fetch when filters change
  useEffect(() => {
    const controller = new AbortController();
    const url = new URL("/api/qrcodes/mine", window.location.origin);
    if (search) url.searchParams.set("search", search);
    if (status !== "all") url.searchParams.set("status", status);
    if (sort) url.searchParams.set("sort", sort);
    if (folderFilter === "unassigned") url.searchParams.set("folderId", "unassigned");
    else if (folderFilter !== "all") url.searchParams.set("folderId", folderFilter);

    const t = setTimeout(() => {
      fetch(url, { signal: controller.signal })
        .then((r) => r.json())
        .then((j) => {
          if (j?.success) setQrs(j.data);
        })
        .catch(() => {});
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [search, status, sort, folderFilter]);

  // Refresh summary on first mount if not provided
  useEffect(() => {
    if (summary) return;
    fetch("/api/user/summary")
      .then((r) => r.json())
      .then((j) => j?.success && setSummary(j.data))
      .catch(() => {});
  }, [summary]);

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function selectAll() {
    setSelected(new Set(qrs.map((q) => q._id)));
  }

  async function handlePauseToggle(qr) {
    const next = !qr.isPaused;
    const res = await fetch(`/api/qrcodes/${qr._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaused: next }),
    });
    if (res.ok) {
      setQrs((prev) =>
        prev.map((q) => (q._id === qr._id ? { ...q, isPaused: next } : q))
      );
    }
  }

  function handleDownload(qr) {
    downloadQrCode(qr, "png", 1024);
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} QR codes? This can't be undone.`)) return;
    const ids = Array.from(selected);
    await Promise.all(
      ids.map((id) => fetch(`/api/qrcodes/${id}`, { method: "DELETE" }))
    );
    setQrs((prev) => prev.filter((q) => !selected.has(q._id)));
    clearSelection();
  }

  async function handleBulkPause(pause = true) {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/qrcodes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPaused: pause }),
        })
      )
    );
    setQrs((prev) =>
      prev.map((q) => (selected.has(q._id) ? { ...q, isPaused: pause } : q))
    );
    clearSelection();
  }

  function openEditContent(qr) { setActiveQr(qr); setShowEditContent(true); }
  function openEditShortUrl(qr) { setActiveQr(qr); setShowEditShortUrl(true); }
  function openMoveFolder(qr) { setActiveQr(qr); setShowMoveFolder(true); }
  function openDelete(qr) { setActiveQr(qr); setShowDelete(true); }

  function handleQrUpdated(updated) {
    setQrs((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
  }
  function handleQrDeleted(id) {
    setQrs((prev) => prev.filter((q) => q._id !== id));
  }
  function handleFolderCreated(folder) {
    setFolders((prev) => [folder, ...prev]);
  }

  const allSelected = qrs.length > 0 && qrs.every((q) => selected.has(q._id));

  return (
    <div className="flex">
      <QrSidebarPanel
        folders={folders}
        folderFilter={folderFilter}
        onFolderFilterChange={setFolderFilter}
        onCreateFolder={() => setShowCreateFolder(true)}
        summary={summary}
        qrCount={qrs.length}
      />

      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink-900">All QR Codes</h1>
              <p className="text-sm text-ink-500 mt-1">
                {qrs.length} {qrs.length === 1 ? "code" : "codes"}
                {folderFilter !== "all" && (
                  <span> · {folderFilter === "unassigned" ? "No folder" : folders.find((f) => f._id === folderFilter)?.name}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/qr-codes/bulk"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Bulk CSV
              </Link>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create QR code
              </Link>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <label className="flex items-center gap-2 h-9 flex-1 max-w-xs px-3 bg-white border border-ink-200 rounded-xl cursor-text hover:border-ink-300 transition-colors focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <Search className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name or destination…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-ink-700 placeholder-ink-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="p-0.5 rounded text-ink-400 hover:text-ink-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>

            <Dropdown value={status} options={STATUSES} onChange={setStatus} label="Status:" icon={Filter} />
            <Dropdown value={sort} options={SORTS} onChange={setSort} label="Sort:" icon={ArrowUpDown} />

            <div className="ml-auto flex items-center gap-1 bg-white border border-ink-200 rounded-xl p-1">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={[
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  view === "grid" ? "bg-brand-100 text-brand-700" : "text-ink-400 hover:text-ink-700",
                ].join(" ")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={[
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  view === "list" ? "bg-brand-100 text-brand-700" : "text-ink-400 hover:text-ink-700",
                ].join(" ")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 mb-4 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? clearSelection() : selectAll())}
                className="w-4 h-4 rounded text-brand-600 cursor-pointer"
              />
              <span className="text-sm font-semibold text-brand-700">
                {selected.size} selected
              </span>
              <div className="flex-1" />
              <button
                onClick={() => handleBulkPause(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-ink-700 hover:bg-white transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                Pause
              </button>
              <button
                onClick={() => handleBulkPause(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-ink-700 hover:bg-white transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button
                onClick={clearSelection}
                className="p-1.5 rounded-lg text-ink-400 hover:bg-white transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* List */}
          {qrs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
              <EmptyState
                icon={QrCode}
                title={search || status !== "all" || folderFilter !== "all" ? "No matches" : "No QR codes yet"}
                description={
                  search || status !== "all" || folderFilter !== "all"
                    ? "Try changing your search or filters."
                    : "Generate your first QR code — URL, vCard, WiFi, and 20+ more types."
                }
                cta={!search && status === "all" && folderFilter === "all" ? "Create QR code" : undefined}
                ctaHref={!search && status === "all" && folderFilter === "all" ? "/generator" : undefined}
              />
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {qrs.map((qr) => (
                <QrCodeCard
                  key={qr._id}
                  qr={qr}
                  view="grid"
                  selected={selected.has(qr._id)}
                  onToggleSelected={toggleSelected}
                  onDownload={() => handleDownload(qr)}
                  onEditContent={() => openEditContent(qr)}
                  onEditShortUrl={() => openEditShortUrl(qr)}
                  onMoveToFolder={() => openMoveFolder(qr)}
                  onPauseToggle={() => handlePauseToggle(qr)}
                  onDelete={() => openDelete(qr)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {qrs.map((qr) => (
                <QrCodeCard
                  key={qr._id}
                  qr={qr}
                  view="list"
                  selected={selected.has(qr._id)}
                  onToggleSelected={toggleSelected}
                  onDownload={() => handleDownload(qr)}
                  onEditContent={() => openEditContent(qr)}
                  onEditShortUrl={() => openEditShortUrl(qr)}
                  onMoveToFolder={() => openMoveFolder(qr)}
                  onPauseToggle={() => handlePauseToggle(qr)}
                  onDelete={() => openDelete(qr)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeQr && (
        <>
          <EditContentModal
            open={showEditContent}
            onClose={() => setShowEditContent(false)}
            qr={activeQr}
            onSaved={handleQrUpdated}
          />
          <EditShortUrlModal
            open={showEditShortUrl}
            onClose={() => setShowEditShortUrl(false)}
            qr={activeQr}
            onSaved={handleQrUpdated}
          />
          <MoveToFolderModal
            open={showMoveFolder}
            onClose={() => setShowMoveFolder(false)}
            qr={activeQr}
            folders={folders}
            onSaved={handleQrUpdated}
            onCreateFolder={() => setShowCreateFolder(true)}
          />
          <ConfirmDeleteModal
            open={showDelete}
            onClose={() => setShowDelete(false)}
            qr={activeQr}
            onDeleted={handleQrDeleted}
          />
        </>
      )}
      <CreateFolderModal
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onCreated={handleFolderCreated}
      />
    </div>
  );
}
