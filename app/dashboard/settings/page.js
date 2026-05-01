"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  User, Lock, Sparkles, Trash2,
  Camera, Check, AlertTriangle,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";

const TABS = [
  { id: "profile",  label: "Profile",      icon: User       },
  { id: "password", label: "Password",     icon: Lock       },
  { id: "plan",     label: "Plan",         icon: Sparkles   },
  { id: "danger",   label: "Danger zone",  icon: Trash2     },
];

/* ─── Profile tab ───────────────────────── */

function ProfileTab() {
  const { data: session, update } = useSession();
  const user = session?.user;
  const [name, setName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setAvatarUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), image: avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      await update({ name: name.trim(), image: avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const initial = name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-6">
      {/* Avatar */}
      <div>
        <label className="block text-sm font-semibold text-ink-700 mb-3">Profile photo</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-ink-100" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-ink-100">
                {initial}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ink-200 text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              {uploading ? "Uploading…" : "Change photo"}
            </button>
            <p className="text-xs text-ink-400 mt-1">JPG, PNG, WebP · max 4 MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ink-700 mb-1.5">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-ink-200 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink-700 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={user?.email ?? ""}
          disabled
          className="w-full h-10 px-3 rounded-xl border border-ink-100 bg-ink-50 text-sm text-ink-400 cursor-not-allowed"
        />
        <p className="text-xs text-ink-400 mt-1">Email cannot be changed here.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
      >
        {success ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

/* ─── Password tab ──────────────────────── */

function PasswordTab() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.next !== form.confirm) {
      setError("New passwords don't match.");
      return;
    }
    if (form.next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update password");
      setForm({ current: "", next: "", confirm: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      {[
        { id: "current", label: "Current password",  key: "current" },
        { id: "next",    label: "New password",       key: "next"    },
        { id: "confirm", label: "Confirm new password", key: "confirm" },
      ].map(({ id, label, key }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-semibold text-ink-700 mb-1.5">
            {label}
          </label>
          <input
            id={id}
            type="password"
            value={form[key]}
            onChange={set(key)}
            autoComplete={key === "current" ? "current-password" : "new-password"}
            className="w-full h-10 px-3 rounded-xl border border-ink-200 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Check className="w-4 h-4" /> Password updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !form.current || !form.next || !form.confirm}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
      >
        {saving ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

/* ─── Plan tab ──────────────────────────── */

function PlanTab() {
  const { data: session } = useSession();
  const plan = session?.user?.plan ?? "free";

  const PLANS = {
    free:     { label: "Free",     color: "bg-ink-100 text-ink-600",                     desc: "Up to 5 static QR codes, basic analytics." },
    pro:      { label: "Pro",      color: "bg-gradient-to-r from-brand-500 to-purple-600 text-white", desc: "Unlimited dynamic QR codes, full analytics, NFC cards." },
    business: { label: "Business", color: "bg-amber-400 text-amber-900",                 desc: "Everything in Pro plus team seats and white-label pages." },
  };

  const { label, color, desc } = PLANS[plan] ?? PLANS.free;

  return (
    <div className="max-w-lg space-y-6">
      <div className="p-5 rounded-2xl border border-ink-100 bg-ink-50/50 flex items-center gap-4">
        <div>
          <p className="text-xs text-ink-500 mb-1">Current plan</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${color}`}>{label}</span>
          <p className="text-sm text-ink-500 mt-2">{desc}</p>
        </div>
      </div>

      {plan === "free" && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-600 via-purple-600 to-pink-600 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-white/80 mb-4 leading-relaxed">
            Dynamic QR codes, advanced analytics, NFC tap cards, and much more.
          </p>
          <a
            href="/pricing"
            className="inline-block px-5 py-2 rounded-full bg-white text-brand-700 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            See pricing
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Danger tab ────────────────────────── */

function DangerTab() {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="max-w-lg space-y-5">
      <div className="p-5 rounded-2xl border border-red-100 bg-red-50/50">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900">Delete account</p>
            <p className="text-sm text-red-600 mt-0.5">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
          </div>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2 rounded-full border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
          >
            Delete my account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              disabled
              title="Not implemented yet"
              className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-bold opacity-50 cursor-not-allowed"
            >
              Yes, delete everything
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-4 py-2 rounded-full border border-ink-200 text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────── */

const TAB_CONTENT = {
  profile:  <ProfileTab />,
  password: <PasswordTab />,
  plan:     <PlanTab />,
  danger:   <DangerTab />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, security, and billing preferences."
      />

      <div className="bg-white rounded-3xl border border-ink-100 shadow-card overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-ink-100 overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={[
                "flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap",
                "border-b-2 transition-colors cursor-pointer",
                activeTab === id
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-500 hover:text-ink-800 hover:bg-ink-50",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 sm:p-8">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
}
