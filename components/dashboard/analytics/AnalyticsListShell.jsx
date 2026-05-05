"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, Users, Zap, ChevronRight,
  Search, Filter, ScanLine,
} from "lucide-react";
import QrDetailShell from "./QrDetailShell";
import AIInsightsPanel from "./AIInsightsPanel";

function formatDateConsistent(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function AnalyticsListShell({ initialQrs = [] }) {
  const [selectedQrId, setSelectedQrId] = useState(null);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("scans-desc");
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const qrs = initialQrs || [];

  // Fetch detailed analytics when QR is selected
  useEffect(() => {
    if (!selectedQrId) {
      setSelectedAnalytics(null);
      return;
    }

    setIsLoadingAnalytics(true);
    fetch(`/api/qrcodes/${selectedQrId}/analytics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSelectedAnalytics(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch analytics:", err))
      .finally(() => setIsLoadingAnalytics(false));
  }, [selectedQrId]);

  // Filter QR codes by search
  const filtered = qrs.filter((qr) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      qr.name?.toLowerCase().includes(q) ||
      qr.content?.toLowerCase().includes(q) ||
      qr.type?.toLowerCase().includes(q)
    );
  });

  // Sort QR codes
  const sorted = [...filtered].sort((a, b) => {
    const aScans = a.stats?.totalScans || 0;
    const bScans = b.stats?.totalScans || 0;
    const aUnique = a.stats?.uniqueScans || 0;
    const bUnique = b.stats?.uniqueScans || 0;
    const aDate = new Date(a.createdAt) || 0;
    const bDate = new Date(b.createdAt) || 0;

    switch (sortBy) {
      case "scans-desc":
        return bScans - aScans;
      case "scans-asc":
        return aScans - bScans;
      case "unique-desc":
        return bUnique - aUnique;
      case "unique-asc":
        return aUnique - bUnique;
      case "newest":
        return bDate - aDate;
      case "oldest":
        return aDate - bDate;
      default:
        return 0;
    }
  });

  const selectedQr = qrs.find((q) => q._id === selectedQrId);

  // Show detail page if QR selected
  if (selectedQrId && selectedQr && selectedAnalytics) {
    return (
      <QrDetailShell qr={selectedQr} analytics={selectedAnalytics} onBack={() => setSelectedQrId(null)} />
    );
  }

  if (selectedQrId) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => setSelectedQrId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors mb-4 cursor-pointer"
        >
          ← Back to Analytics
        </button>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mb-3" />
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Summary stats
  const totalScans = qrs.reduce((sum, qr) => sum + (qr.stats?.totalScans || 0), 0);
  const totalUnique = qrs.reduce((sum, qr) => sum + (qr.stats?.uniqueScans || 0), 0);
  const activeQrs = qrs.filter((qr) => (qr.stats?.totalScans || 0) > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-gray-500 mt-1">
          Track scans, visits, and engagement across all your QR codes
        </p>
      </div>

      {/* Summary Stats */}
      {qrs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Total Scans
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <ScanLine className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Across {qrs.length} QR code{qrs.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Unique Visitors
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalUnique.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Unique scan sessions</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Active QR Codes
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeQrs}</p>
            <p className="text-xs text-gray-400 mt-1">With at least 1 scan</p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {qrs.length > 0 && (
        <div className="mb-8">
          <AIInsightsPanel />
        </div>
      )}

      {/* Search & Filter */}
      {qrs.length > 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700"
              >
                <option value="scans-desc">Most Scans</option>
                <option value="scans-asc">Least Scans</option>
                <option value="unique-desc">Most Unique</option>
                <option value="unique-asc">Least Unique</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* QR Codes List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No QR codes yet</h3>
            <p className="text-gray-500 text-sm">
              {qrs.length === 0
                ? "Create your first QR code to see analytics"
                : "No QR codes match your search"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sorted.map((qr) => {
              const scans = qr.stats?.totalScans || 0;
              const unique = qr.stats?.uniqueScans || 0;
              const engagement = scans > 0 ? Math.round((unique / scans) * 100) : 0;

              return (
                <button
                  key={qr._id}
                  onClick={() => setSelectedQrId(qr._id)}
                  className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                        {qr.name || "Unnamed QR Code"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {qr.type} • Created {formatDateConsistent(qr.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-8 ml-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{scans.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Scans</p>
                      </div>

                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900">{unique.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Unique</p>
                      </div>

                      <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-gray-900">{engagement}%</p>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
