"use client";

import { useState } from "react";
import {
  Sparkles, Copy, Check, ExternalLink, Mail,
  Download, Link2, Shield, Eye,
} from "lucide-react";

export default function PageCreatedPanel({ pageUrl, editUrl, shortId }) {
  const [copiedPage, setCopiedPage] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2500);
    } catch { /* ignore */ }
  };

  const handleEmailEditLink = () => {
    const subject = encodeURIComponent("Your Webiox Page Edit Link — Save This!");
    const body = encodeURIComponent(
      `Here is your edit link for your Webiox page:\n\n` +
      `Public URL: ${pageUrl}\n` +
      `Edit URL (keep private!): ${editUrl}\n\n` +
      `⚠️ Anyone with the edit link can modify your page.\n` +
      `We cannot recover this link if you lose it.\n\n` +
      `— Webiox QR Studio`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  const handleDownloadTxt = () => {
    const content =
      `Webiox Page — Save This File!\n` +
      `==============================\n\n` +
      `Public URL (shareable):\n${pageUrl}\n\n` +
      `Edit URL (keep private!):\n${editUrl}\n\n` +
      `⚠️ Anyone with the edit link can modify your page.\n` +
      `We cannot recover this link if you lose it.\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webiox-page-${shortId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border-2 border-emerald-200/60 bg-gradient-to-b from-emerald-50/80 to-white/80 backdrop-blur-xl shadow-lg p-5 sm:p-6 animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Your page is live!</h3>
      </div>

      {/* Public Link */}
      <div className="mb-3">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          <Link2 className="w-3 h-3" /> Public Link
        </label>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-gray-200/60">
          <span className="flex-1 text-sm font-medium text-gray-700 truncate select-all">
            {pageUrl}
          </span>
          <button
            onClick={() => copyToClipboard(pageUrl, setCopiedPage)}
            className="flex-shrink-0 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Copy public link"
          >
            {copiedPage ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Open public page"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>

      {/* Edit Link */}
      <div className="mb-4">
        <label className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
          <Shield className="w-3 h-3" /> Private Edit Link — Save This!
        </label>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border-2 border-amber-300/50">
          <span className="flex-1 text-sm font-medium text-gray-700 truncate select-all font-mono">
            {editUrl}
          </span>
          <button
            onClick={() => copyToClipboard(editUrl, setCopiedEdit)}
            className="flex-shrink-0 p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 transition-colors"
            aria-label="Copy edit link"
          >
            {copiedEdit ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-700" />
            )}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-amber-700/80 leading-relaxed">
          Anyone with this link can edit your page. We can&apos;t recover it if you lose it.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleEmailEditLink}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 border border-gray-200/60 text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <Mail className="w-4 h-4" /> Email it to me
        </button>
        <button
          onClick={handleDownloadTxt}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 border border-gray-200/60 text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" /> Download as .txt
        </button>
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg active:scale-[0.98] transition-all"
        >
          <Eye className="w-4 h-4" /> View Page
        </a>
      </div>
    </div>
  );
}
