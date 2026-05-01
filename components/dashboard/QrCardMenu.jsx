"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Download,
  BarChart3,
  Edit2,
  Link as LinkIcon,
  FolderInput,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function QrCardMenu({
  qr,
  onDownload,
  onEditContent,
  onEditShortUrl,
  onMoveToFolder,
  onPauseToggle,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const items = [
    { label: "Download", icon: Download, onClick: onDownload },
    {
      label: "Details",
      icon: BarChart3,
      href: `/dashboard/qr/${qr._id}`,
    },
    { label: "Edit content", icon: Edit2, onClick: onEditContent },
    qr.isDynamic && {
      label: "Edit short URL",
      icon: LinkIcon,
      onClick: onEditShortUrl,
    },
    { label: "Move to folder", icon: FolderInput, onClick: onMoveToFolder },
    qr.isDynamic && {
      label: qr.isPaused ? "Resume" : "Pause",
      icon: qr.isPaused ? Play : Pause,
      onClick: onPauseToggle,
    },
    { divider: true },
    { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
  ].filter(Boolean);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="More actions"
        className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1.5 w-48 z-30 bg-white rounded-2xl shadow-glow border border-ink-100 overflow-hidden py-1"
          >
            {items.map((item, i) => {
              if (item.divider) return <div key={i} className="my-1 h-px bg-ink-100" />;
              const Icon = item.icon;
              const className = [
                "flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-colors cursor-pointer",
                item.danger
                  ? "text-red-600 hover:bg-red-50"
                  : "text-ink-700 hover:bg-ink-50",
              ].join(" ");
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={className}
                  >
                    <Icon className="w-4 h-4 text-ink-400" />
                    {item.label}
                  </Link>
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  className={className}
                >
                  <Icon className={`w-4 h-4 ${item.danger ? "text-red-500" : "text-ink-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
