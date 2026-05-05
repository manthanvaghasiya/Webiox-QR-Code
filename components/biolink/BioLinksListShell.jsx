"use client";

import { useState } from "react";
import {
  Link2, Plus, Eye, Edit3, Trash2, Share2, Copy, Check,
} from "lucide-react";
import Link from "next/link";

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BioLinksListShell({ initialBiolinks = [] }) {
  const [biolinks, setBiolinks] = useState(initialBiolinks);
  const [copiedId, setCopiedId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this bio link? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/biolinks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBiolinks(biolinks.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete bio-link:', error);
      alert('Failed to delete bio-link');
    }
  };

  const handleCopyUrl = (slug) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/link/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bio Links</h1>
          <p className="text-gray-500 mt-1">Create and manage your custom bio link pages</p>
        </div>
        <Link
          href="/dashboard/biolinks/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Bio Link
        </Link>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {biolinks.length === 0 ? (
          <div className="p-12 text-center">
            <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No bio links yet</h3>
            <p className="text-gray-500 text-sm mb-6">Create your first bio link to get started</p>
            <Link
              href="/dashboard/biolinks/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Bio Link
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {biolinks.map((biolink) => (
              <div key={biolink._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {biolink.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Created {formatDate(biolink.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCopyUrl(biolink.slug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <code className="text-brand-600 font-mono">/link/{biolink.slug}</code>
                        {copiedId === biolink.slug ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {biolink.totalClicks > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700">
                          <span>📊 {biolink.totalClicks} clicks</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/link/${biolink.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </a>
                    <Link
                      href={`/dashboard/biolinks/${biolink._id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(biolink._id)}
                      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-red-200 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
