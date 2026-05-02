"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, Plus, Sparkles } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/business-profiles");
        if (!res.ok) throw new Error("Failed to load profiles");
        const data = await res.json();
        setProfiles(data.profiles || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = (deletedId) => {
    setProfiles((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="My Profiles"
        description="Build a smart business profile page — share contact info, services, social links, and more."
        action={
          <Link
            href="/dashboard/profiles/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Profile
          </Link>
        }
      />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-1.5 bg-gray-200 rounded mb-4" />
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1,2,3].map(j => <div key={j} className="h-14 bg-gray-100 rounded-xl" />)}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
                <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && profiles.length === 0 && (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
          <EmptyState
            icon={Store}
            title="No business profiles yet"
            description="Create a profile page to showcase your business, services, and social links — all behind one QR code."
            cta="Create Profile"
            ctaHref="/dashboard/profiles/new"
          />
        </div>
      )}

      {!loading && !error && profiles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Add another prompt */}
          <div className="bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100 rounded-3xl p-8 text-center">
            <div className="text-4xl mb-3">🏪</div>
            <h3 className="text-base font-extrabold text-gray-900 mb-2">Need another profile?</h3>
            <p className="text-sm text-gray-500 mb-4">Create profiles for multiple businesses or branches.</p>
            <Link
              href="/dashboard/profiles/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Another Profile
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
