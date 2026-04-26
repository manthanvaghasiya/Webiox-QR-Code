"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    fetch("/api/qrcodes")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data)) {
          setQrCodes(payload.data);
        } else {
          console.error("API did not return expected envelope:", payload);
          setQrCodes([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch QR codes:", err);
        setQrCodes([]);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Webiox Admin Analytics
        </h1>
        <Link
          href="/"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          ← Back to Studio
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Content
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Foreground Color
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Has Logo
              </th>
            </tr>
          </thead>
          <tbody>
            {qrCodes.map((item, index) => (
              <tr
                key={item._id || index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {item.text}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                      style={{ backgroundColor: item.fgColor }}
                    ></span>
                    {item.fgColor}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.hasLogo ? "Yes" : "No"}
                </td>
              </tr>
            ))}
            {qrCodes.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  No QR codes found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
