"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Copy, Download, ExternalLink, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function QrCodeCard({ qr }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const { design, destination, staticContent, isDynamic } = qr;
    
    const dotsOpts = { type: design.dotPattern || "square" };
    if (design.useGradient) {
      dotsOpts.gradient = {
        type: design.gradientType || "linear", rotation: 0,
        colorStops: [
          { offset: 0, color: design.gradientColor1 },
          { offset: 1, color: design.gradientColor2 },
        ],
      };
    } else {
      dotsOpts.color = design.fgColor;
    }

    const cornersOpts = { type: design.cornerStyle || "square" };
    if (design.useCustomEyeColor) cornersOpts.color = design.eyeFrameColor;
    else if (design.useGradient)
      cornersOpts.gradient = {
        type: design.gradientType || "linear", rotation: 0,
        colorStops: [
          { offset: 0, color: design.gradientColor1 },
          { offset: 1, color: design.gradientColor2 },
        ],
      };
    else cornersOpts.color = design.fgColor;

    const cornersDotOpts = { type: design.eyeBallStyle || "square" };
    if (design.useCustomEyeColor) cornersDotOpts.color = design.eyeBallColor;
    else if (design.useGradient)
      cornersDotOpts.gradient = {
        type: design.gradientType || "linear", rotation: 0,
        colorStops: [
          { offset: 0, color: design.gradientColor1 },
          { offset: 1, color: design.gradientColor2 },
        ],
      };
    else cornersDotOpts.color = design.fgColor;

    const finalContent = isDynamic 
      ? `${window.location.origin}/r/${qr.shortId}`
      : (staticContent || destination || "https://webiox.com");

    const qrCode = new QRCodeStyling({
      width: 400, height: 400, data: finalContent,
      image: design.logo || undefined,
      qrOptions: { errorCorrectionLevel: design.errorCorrectionLevel || "M" },
      dotsOptions: dotsOpts,
      backgroundOptions: { color: design.bgColor || "#ffffff" },
      cornersSquareOptions: cornersOpts,
      cornersDotOptions: cornersDotOpts,
      imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.4, hideBackgroundDots: true },
    });

    containerRef.current.innerHTML = "";
    qrCode.append(containerRef.current);
  }, [qr]);

  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="p-4 flex flex-col items-center justify-center bg-ink-50/50 border-b border-ink-100 relative">
        <div className="absolute top-3 left-3 flex gap-1">
          {qr.isDynamic && (
            <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-wider">
              Dynamic
            </span>
          )}
        </div>
        <div className="w-32 h-32 bg-white rounded-xl shadow-sm p-2 flex items-center justify-center [&_canvas]:!w-full [&_canvas]:!h-auto" ref={containerRef} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-ink-900 truncate">
              {qr.name || "Untitled QR Code"}
            </h3>
            <p className="text-xs text-ink-500 truncate mt-0.5 capitalize">{qr.type} type</p>
          </div>
        </div>
        
        {qr.destination && (
          <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-4 bg-ink-50 px-2.5 py-1.5 rounded-lg truncate">
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{qr.destination}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-600">
            <BarChart2 className="w-4 h-4 text-brand-500" />
            {qr.scanCount || 0} scans
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors cursor-pointer" title="Copy Link">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-ink-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer" title="Download">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
