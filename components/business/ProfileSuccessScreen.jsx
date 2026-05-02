"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

// Simple confetti particle
function Confetti() {
  const colors = ["#4F46E5", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm opacity-80"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ProfileSuccessScreen({ result, businessName }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = result?.pageUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/b/${result?.profile?.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("input");
      el.value = profileUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Check out my business profile: ${profileUrl}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const downloadQR = () => {
    const svg = document.getElementById("success-qr-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      const a = document.createElement("a");
      a.download = `${businessName || "business"}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <Confetti />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/40">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Profile is Live! 🎉</h1>
        <p className="text-gray-500 mb-8">
          <strong className="text-gray-700">{businessName}</strong> is now online and ready to share with customers.
        </p>

        {/* Profile URL card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <span className="text-green-500">🌐</span>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-sm font-semibold text-brand-600 hover:underline truncate text-left"
            >
              {profileUrl}
            </a>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={copyLink}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
            >
              {copied ? "✓ Copied!" : "📋 Copy Link"}
            </button>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              👁️ Preview
            </a>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Your QR Code (Free Forever)</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <QRCodeSVG
                id="success-qr-svg"
                value={profileUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#0A0F1E"
                level="M"
                includeMargin={false}
              />
            </div>
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ⬇️ Download QR Code
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-500/25"
          >
            📲 Share on WhatsApp
          </button>
          <Link
            href="/dashboard/nfc"
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-brand-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
          >
            💳 Order NFC Card
          </Link>
        </div>

        {/* Dashboard link */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {result?.profile?._id && (
            <Link
              href={`/dashboard/profiles/${result.profile._id}/edit`}
              className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              ✏️ Edit Profile
            </Link>
          )}
          <Link
            href="/dashboard/profiles"
            className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors"
          >
            📊 Go to Dashboard →
          </Link>
        </div>

        {/* NFC upsell */}
        <div className="mt-8 bg-gradient-to-br from-indigo-900 to-brand-900 rounded-3xl p-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 text-8xl opacity-10 translate-x-4 -translate-y-2">💳</div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Upgrade for ₹299</p>
            <h3 className="text-white font-extrabold text-lg mb-2">Get an NFC Business Card</h3>
            <p className="text-indigo-200 text-sm mb-4">
              Premium physical card. Customers tap their phone → your profile opens instantly. No app needed.
            </p>
            <Link
              href="/nfc-card"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-900 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
