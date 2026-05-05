"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import QRCode from 'qrcode';

export default function BioLinkQRCard({ biolink, biolinkId }) {
  const qrRef = useRef(null);
  const [mecard, setMecard] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch meCard data
    const fetchMeCard = async () => {
      try {
        const res = await fetch(`/api/biolinks/${biolinkId}/mecard`);
        if (res.ok) {
          const data = await res.json();
          setMecard(data.mecard);

          // Generate QR code
          if (qrRef.current) {
            qrRef.current.innerHTML = '';
            await QRCode.toCanvas(qrRef.current, data.mecard, {
              width: 250,
              margin: 2,
              color: {
                dark: '#1f2937',
                light: '#ffffff',
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch meCard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeCard();
  }, [biolinkId]);

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${biolink.title || 'biolink'}-contact.png`;
      link.click();
    }
  };

  const handleCopyMeCard = () => {
    if (mecard) {
      navigator.clipboard?.writeText(mecard);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Contact QR Code</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <div ref={qrRef} />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center">
            Scan this QR code to save <strong>{biolink.title}</strong> as a contact
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadQR}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>

            <button
              onClick={handleCopyMeCard}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Data
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
