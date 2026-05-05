"use client";

import { useState } from "react";

const ICON_OPTIONS = [
  { label: 'Instagram', icon: 'instagram', emoji: '📱' },
  { label: 'Twitter / X', icon: 'twitter', emoji: '𝕏' },
  { label: 'Facebook', icon: 'facebook', emoji: '📘' },
  { label: 'TikTok', icon: 'tiktok', emoji: '🎵' },
  { label: 'YouTube', icon: 'youtube', emoji: '▶️' },
  { label: 'LinkedIn', icon: 'linkedin', emoji: '💼' },
  { label: 'GitHub', icon: 'github', emoji: '🐙' },
  { label: 'Email', icon: 'email', emoji: '✉️' },
  { label: 'Phone', icon: 'phone', emoji: '📞' },
  { label: 'WhatsApp', icon: 'whatsapp', emoji: '💬' },
  { label: 'Website', icon: 'website', emoji: '🌐' },
  { label: 'Download', icon: 'download', emoji: '⬇️' },
  { label: 'Link', icon: 'link', emoji: '🔗' },
];

export default function BlockEditor({ block, onSave, onCancel }) {
  const [form, setForm] = useState(block || {
    type: 'link',
    label: '',
    icon: '',
    url: '',
    color: null,
  });

  const handleSave = () => {
    if (!form.label.trim()) {
      alert('Please enter a label');
      return;
    }

    if (!form.url.trim()) {
      alert('Please enter a URL');
      return;
    }

    onSave(form);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Label (Button Text)
        </label>
        <input
          type="text"
          value={form.label || ''}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="e.g., Follow on Instagram"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          URL
        </label>
        <input
          type="url"
          value={form.url || ''}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="https://instagram.com/yourprofile"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Icon
        </label>
        <select
          value={form.icon || ''}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">No icon</option>
          {ICON_OPTIONS.map((opt) => (
            <option key={opt.icon} value={opt.icon}>
              {opt.emoji} {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Button Color (Optional)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={form.color || '#4F46E5'}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
          />
          <input
            type="text"
            value={form.color || '#4F46E5'}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={() => setForm({ ...form, color: null })}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Clear
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Leave empty to use theme colors</p>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {block ? 'Update Link' : 'Add Link'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
