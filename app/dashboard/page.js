"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QrCode, ScanLine, Store, CreditCard, ArrowRight, Zap } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";

function MetricCard({ label, value, icon: Icon, color, hint }) {
  return (
    <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-6 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-ink-900 leading-none mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-sm font-semibold text-ink-700 truncate">{label}</p>
        <p className="text-xs text-ink-400 mt-0.5">{hint}</p>
      </div>
    </div>
  );
}

function ActivityItem({ profile }) {
  return (
    <div className="px-6 py-4 border-b border-ink-50 last:border-b-0 hover:bg-ink-50 transition-colors">
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: profile.theme?.primaryColor || '#4F46E5' }}
        >
          {profile.businessName?.[0]?.toUpperCase() || 'B'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink-900 truncate">{profile.businessName}</p>
          <p className="text-xs text-ink-400">
            {profile.totalScans || 0} scans • {profile.totalCalls || 0} calls
          </p>
        </div>
        <Link
          href={`/dashboard/profiles/${profile._id}/edit`}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/dashboard-stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecent(data.recent);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const METRICS = [
    {
      label: "QR Codes",
      value: stats?.qrCodes ?? 0,
      icon: QrCode,
      color: "from-blue-500 to-indigo-600",
      hint: "Total created",
    },
    {
      label: "Total Scans",
      value: stats?.totalScans ?? 0,
      icon: ScanLine,
      color: "from-purple-500 to-pink-600",
      hint: "All time",
    },
    {
      label: "Profile Visits",
      value: stats?.profileVisits ?? 0,
      icon: Store,
      color: "from-emerald-500 to-teal-600",
      hint: "All time",
    },
    {
      label: "NFC Cards",
      value: stats?.nfcOrders ?? 0,
      icon: CreditCard,
      color: "from-amber-500 to-orange-500",
      hint: "Ordered",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="Overview"
        description="Welcome back! Here's a snapshot of your account."
        action={
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            New QR Code
          </Link>
        }
      />

      {/* Metrics grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-ink-100 shadow-card p-6 h-24 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink-900">Recent business profiles</h2>
          <Link
            href="/dashboard/profiles"
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-ink-400">
            Loading...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-600 text-sm">
            {error}
          </div>
        ) : recent?.profiles && recent.profiles.length > 0 ? (
          <div className="divide-y divide-ink-50">
            {recent.profiles.map((profile) => (
              <ActivityItem key={profile._id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 mb-5">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" rx="20" fill="#F0F2F8"/>
                <rect x="16" y="16" width="20" height="20" rx="4" fill="#E1E5EF"/>
                <rect x="20" y="20" width="12" height="12" rx="2" fill="#8A93A8"/>
                <rect x="44" y="16" width="20" height="20" rx="4" fill="#E1E5EF"/>
                <rect x="48" y="20" width="12" height="12" rx="2" fill="#8A93A8"/>
                <rect x="16" y="44" width="20" height="20" rx="4" fill="#E1E5EF"/>
                <rect x="20" y="48" width="12" height="12" rx="2" fill="#8A93A8"/>
                <rect x="44" y="44" width="8" height="8" rx="2" fill="#C5CAD9"/>
                <rect x="56" y="44" width="8" height="8" rx="2" fill="#C5CAD9"/>
                <rect x="44" y="56" width="8" height="8" rx="2" fill="#C5CAD9"/>
                <rect x="56" y="56" width="8" height="8" rx="2" fill="#4F46E5" opacity="0.4"/>
              </svg>
            </div>
            <p className="text-base font-bold text-ink-900 mb-2">No profiles yet</p>
            <p className="text-sm text-ink-500 mb-6 max-w-xs">
              Create your first business profile and start sharing it with customers.
            </p>
            <Link
              href="/dashboard/profiles/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Create your first profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
