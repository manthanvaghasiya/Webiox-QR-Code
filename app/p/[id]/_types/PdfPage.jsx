"use client";

import { FileText, Eye, Download, Share2 } from "lucide-react";

export default function PdfPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#da5167";
  const accent = theme.accentColor || "#464154";
  const { company, title, description, website, pdfUrl, linkDirect } = cfg;

  if (linkDirect && pdfUrl) {
    if (typeof window !== "undefined") window.location.href = pdfUrl;
  }

  const fileName = (title || "document").replace(/\s+/g, "-");

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: primary, color: "#fff" }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold opacity-80 truncate">{company}</p>
            <h1 className="text-base font-bold truncate">{title || "Untitled PDF"}</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {description && (
          <div className="px-5 py-3 text-sm leading-relaxed" style={{ background: primary, color: "#fff", opacity: 0.95 }}>
            {description}
          </div>
        )}

        {/* PDF preview */}
        <div className="aspect-[4/5] bg-ink-100 flex items-center justify-center relative">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
              title={title || "PDF"}
              className="w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center text-ink-400">
              <FileText className="w-16 h-16 mb-3" />
              <p className="text-sm font-semibold">No PDF uploaded</p>
            </div>
          )}
        </div>

        {website && (
          <div className="px-5 py-3 text-center text-sm text-ink-500 border-t border-ink-100">
            <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        <div className="grid grid-cols-2">
          {pdfUrl && (
            <>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 text-sm font-bold text-white"
                style={{ background: accent }}
              >
                <Eye className="w-4 h-4" />
                View PDF
              </a>
              <a
                href={pdfUrl}
                download={fileName}
                className="flex items-center justify-center gap-2 py-4 text-sm font-bold text-white"
                style={{ background: primary }}
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
