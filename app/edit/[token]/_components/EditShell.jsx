"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Copy, Check, Save, Smartphone, ChevronLeft } from "lucide-react";
import DeviceFrame from "./DeviceFrame";
import SocialPage from "@/app/p/[id]/_types/SocialPage";
import SocialLinksForm from "@/components/qr/SocialLinksForm";

export default function EditShell({ page }) {
  const [draft, setDraft] = useState(page);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const publicUrl = `/p/${draft.shortId}`;

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/pages/${draft.editToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: draft.config,
          theme: draft.theme,
          meta: draft.meta
        })
      });
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  const updateSocialConfig = (updater) => {
    setDraft(prev => {
      const config = { ...prev.config };
      updater(config);
      return { ...prev, config };
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Top Navbar */}
      <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/profiles" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition text-gray-500">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
            {draft.config?.pageTitle || "Editing Page"}
          </h1>
          <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-100 text-[10px] font-bold text-brand-600 uppercase tracking-wider">
            {draft.type}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
             <Link href={publicUrl} target="_blank" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
               <Eye className="w-3.5 h-3.5" /> View Live
             </Link>
             <div className="w-px h-4 bg-gray-300" />
             <button onClick={copyPublicUrl} className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5">
               {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} Copy Link
             </button>
           </div>
           <button onClick={saveChanges} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold shadow-md disabled:opacity-50 transition cursor-pointer">
             <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
           </button>
        </div>
      </header>

      {/* Main Dual Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Editor Form */}
        <div className="w-[500px] flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto p-8 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0">
           <div className="mb-8">
             <h2 className="text-xl font-bold text-gray-900">Page Content</h2>
             <p className="text-sm text-gray-500 mt-1">Update your links and profile details</p>
           </div>
           
           {draft.type === "social" ? (
             <SocialLinksForm 
                links={draft.config?.links || []}
                onAdd={() => updateSocialConfig(c => c.links = [...(c.links || []), { platform: "Website", url: "" }])}
                onRemove={(i) => updateSocialConfig(c => c.links = c.links.filter((_, idx) => idx !== i))}
                onUpdate={(i, field, value) => updateSocialConfig(c => {
                  const newLinks = [...(c.links || [])];
                  newLinks[i] = { ...newLinks[i], [field]: value };
                  c.links = newLinks;
                })}
                pageTitle={draft.config?.pageTitle || ""}
                onPageTitle={(v) => updateSocialConfig(c => c.pageTitle = v)}
                pageDesc={draft.config?.pageDescription || ""}
                onPageDesc={(v) => updateSocialConfig(c => c.pageDescription = v)}
             />
           ) : (
             <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
               <p className="text-gray-500 text-sm font-medium">Editor for {draft.type} coming soon.</p>
             </div>
           )}
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 bg-ink-50/50 flex items-center justify-center p-8 overflow-y-auto relative pattern-dots pattern-ink-200 pattern-bg-transparent pattern-size-4">
           <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-500">
              <Smartphone className="w-3.5 h-3.5" /> Live Preview
           </div>
           
           <DeviceFrame>
              {draft.type === "social" ? (
                <SocialPage page={draft} />
              ) : (
                <div className="flex items-center justify-center h-full bg-white text-gray-400">
                  <p>Preview not available</p>
                </div>
              )}
           </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
