"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function ShareModal({ isOpen, onClose, profileUrl, businessName }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const copy = async () => {
    try { await navigator.clipboard.writeText(profileUrl); }
    catch { const i = document.createElement("input"); i.value = profileUrl; document.body.appendChild(i); i.select(); document.execCommand("copy"); document.body.removeChild(i); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Check out ${businessName}: ${profileUrl}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: businessName, url: profileUrl }).catch(() => {});
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("share-modal-qr");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300; canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const a = document.createElement("a");
      a.download = `${businessName || "profile"}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative z-10 w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-gray-900">Share Profile</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg">×</button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <QRCodeSVG id="share-modal-qr" value={profileUrl} size={150} bgColor="#ffffff" fgColor="#0A0F1E" level="M" />
          </div>
        </div>

        {/* URL */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-4 border border-gray-100">
          <span className="text-xs text-gray-600 flex-1 truncate font-mono">{profileUrl}</span>
          <button onClick={copy} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${copied ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={shareWhatsApp} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-[10px] font-bold">WhatsApp</span>
          </button>
          {typeof navigator !== "undefined" && navigator.share && (
            <button onClick={nativeShare} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <span className="text-2xl">📤</span>
              <span className="text-[10px] font-bold">Share</span>
            </button>
          )}
          <button onClick={downloadQR} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            <span className="text-2xl">⬇️</span>
            <span className="text-[10px] font-bold">QR Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}
