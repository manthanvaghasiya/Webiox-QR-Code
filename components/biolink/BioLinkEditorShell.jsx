// ─────────────────────────────────────────────────────────────────────────────
// BioLinkEditorShell — bio-link editor page
//
// Two-pane editor: left side has profile info, theme colors, and a list of
// link blocks (with BlockEditor for add/edit modal); right side shows a
// sticky BioLinkPreview and BioLinkQRCard. Saves via PUT /api/biolinks/[id]
// and offers a vCard download link.
// Used in: app/dashboard/biolinks/[id]/edit/page.js.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save, X, Plus, Eye, EyeOff, Edit3, Trash2, ArrowLeft, Download,
} from "lucide-react";
import BioLinkPreview from "./BioLinkPreview";
import BioLinkQRCard from "./BioLinkQRCard";
import BlockEditor from "./BlockEditor";

export default function BioLinkEditorShell({ biolink: initialBiolink }) {
  const router = useRouter();
  const [biolink, setBiolink] = useState(initialBiolink);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [showBlockForm, setShowBlockForm] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/biolinks/${biolink._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: biolink.title,
          bio: biolink.bio,
          avatarUrl: biolink.avatarUrl,
          backgroundUrl: biolink.backgroundUrl,
          theme: biolink.theme,
          blocks: biolink.blocks,
          isPublished: biolink.isPublished,
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      const updated = await res.json();
      setBiolink(updated);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateField = useCallback((field, value) => {
    setBiolink((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateTheme = useCallback((field, value) => {
    setBiolink((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }));
  }, []);

  const addBlock = (newBlock) => {
    const block = {
      id: Math.random().toString(36).slice(2, 8),
      type: newBlock.type || 'link',
      label: newBlock.label || '',
      icon: newBlock.icon || '',
      url: newBlock.url || '',
      color: newBlock.color || null,
      order: biolink.blocks.length,
    };

    setBiolink((prev) => ({
      ...prev,
      blocks: [...prev.blocks, block],
    }));

    setShowBlockForm(false);
  };

  const updateBlock = (blockId, updates) => {
    setBiolink((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      ),
    }));
    setEditingBlock(null);
  };

  const deleteBlock = (blockId) => {
    setBiolink((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">
            {biolink.title || 'Edit Bio Link'}
          </h1>

          <a
            href={`/api/biolinks/${biolink._id}/vcard`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">vCard</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={biolink.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Your name or brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio (Short Description)
                </label>
                <textarea
                  value={biolink.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  rows={3}
                  placeholder="Tell people about yourself..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {biolink.bio.length} / 200 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={biolink.avatarUrl || ''}
                    onChange={(e) => updateField('avatarUrl', e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Background URL
                  </label>
                  <input
                    type="url"
                    value={biolink.backgroundUrl || ''}
                    onChange={(e) => updateField('backgroundUrl', e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Theme</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={biolink.theme?.primaryColor || '#4F46E5'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={biolink.theme?.primaryColor || '#4F46E5'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={biolink.theme?.secondaryColor || '#7C3AED'}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={biolink.theme?.secondaryColor || '#7C3AED'}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blocks / Links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Links & Buttons</h2>
              <button
                onClick={() => setShowBlockForm(!showBlockForm)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-brand-50 text-brand-600 font-semibold text-sm hover:bg-brand-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            {showBlockForm && (
              <BlockEditor
                onSave={addBlock}
                onCancel={() => setShowBlockForm(false)}
              />
            )}

            {biolink.blocks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No links yet. Add your first link above!
              </p>
            ) : (
              <div className="space-y-2">
                {biolink.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{block.label}</p>
                      <p className="text-xs text-gray-500 truncate">{block.url}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingBlock(block.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-red-700 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview & QR */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Mobile Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-brand-500 to-purple-600 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">Live Preview</h3>
                <a
                  href={`/link/${biolink.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>

              <BioLinkPreview biolink={biolink} />
            </div>

            {/* QR Code Card */}
            {biolink._id && (
              <BioLinkQRCard biolink={biolink} biolinkId={biolink._id} />
            )}
          </div>
        </div>
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Edit Link</h3>
              <button
                onClick={() => setEditingBlock(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <BlockEditor
              block={biolink.blocks.find((b) => b.id === editingBlock)}
              onSave={(updates) => updateBlock(editingBlock, updates)}
              onCancel={() => setEditingBlock(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
