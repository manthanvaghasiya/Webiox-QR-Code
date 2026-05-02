"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WizardProgressBar from "./wizard/WizardProgressBar";
import WizardStepBasic from "./wizard/WizardStepBasic";
import WizardStepAI from "./wizard/WizardStepAI";
import WizardStepContact from "./wizard/WizardStepContact";
import WizardStepSocial from "./wizard/WizardStepSocial";
import WizardStepServices from "./wizard/WizardStepServices";
import WizardStepTemplate from "./wizard/WizardStepTemplate";
import ProfileSuccessScreen from "./ProfileSuccessScreen";

const STEPS = [
  { id: 1, title: "Tell us about your business", subtitle: "We'll use this to create your profile." },
  { id: 2, title: "AI-generated content ✨", subtitle: "Review and edit what our AI wrote for you." },
  { id: 3, title: "Contact & Location", subtitle: "Let customers know how to reach you." },
  { id: 4, title: "Social Media", subtitle: "Add your social pages — optional but recommended." },
  { id: 5, title: "Products & Services", subtitle: "Showcase what you offer — optional." },
  { id: 6, title: "Choose a Template", subtitle: "Pick a design that fits your brand." },
];

const SLIDE = {
  initial: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  transition: { duration: 0.25, ease: "easeInOut" },
};

const INITIAL_DATA = {
  businessName: "",
  category: "general",
  keywords: [],
  tagline: "",
  about: "",
  contact: { phone: "", whatsapp: "", email: "", website: "" },
  address: { addressLine1: "", addressLine2: "", city: "", state: "", country: "India", postalCode: "" },
  socialLinks: [],
  services: [],
  gallery: [],
  theme: { primaryColor: "#4F46E5", secondaryColor: "#7C3AED", accentColor: "#10B981", fontFamily: "Inter", template: "starter" },
  _aiGenerated: false,
  _aiTaglines: [],
};

export default function ProfileWizard({ mode = "create", initialData = null }) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState(initialData || INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const canProceed = () => {
    if (step === 1) return data.businessName.trim().length >= 2;
    return true;
  };

  const goNext = () => {
    if (!canProceed()) return;
    setDir(1);
    setStep((s) => Math.min(s + 1, 6));
    setError(null);
  };

  const goPrev = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 1));
    setError(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/business-profiles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: data.businessName,
          category: data.category,
          keywords: data.keywords,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const json = await res.json();
      update({
        tagline: json.taglines?.[0] || data.tagline,
        about: json.about || data.about,
        services: data.services.length === 0 ? (json.services || []) : data.services,
        _aiGenerated: true,
        _aiTaglines: json.taglines || [],
      });
    } catch (e) {
      setError("AI generation failed. Please try again or fill in manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const payload = { ...data };
      delete payload._aiGenerated;
      delete payload._aiTaglines;

      const isEdit = mode === "edit" && initialData?._id;
      const url = isEdit
        ? `/api/business-profiles/${initialData._id}`
        : "/api/business-profiles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) throw new Error("Please sign in to save your profile.");
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Save failed. Please try again.");
      }

      const json = await res.json();
      setResult(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Success screen
  if (result) {
    return <ProfileSuccessScreen result={result} businessName={data.businessName} />;
  }

  const stepInfo = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-purple-50/20 flex flex-col">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <WizardProgressBar currentStep={step} totalSteps={6} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Step header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{stepInfo.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{stepInfo.subtitle}</p>
          </div>

          {/* Step card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-8 overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={SLIDE.initial}
                animate={SLIDE.animate}
                exit={SLIDE.exit}
                transition={SLIDE.transition}
              >
                {step === 1 && <WizardStepBasic data={data} onChange={update} />}
                {step === 2 && (
                  <WizardStepAI
                    data={data}
                    onChange={update}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                )}
                {step === 3 && <WizardStepContact data={data} onChange={update} />}
                {step === 4 && <WizardStepSocial data={data} onChange={update} />}
                {step === 5 && <WizardStepServices data={data} onChange={update} />}
                {step === 6 && <WizardStepTemplate data={data} onChange={update} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-600 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {/* Skip — only for optional steps */}
              {step >= 4 && step < 6 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-4 py-3 rounded-full text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors"
                >
                  Skip
                </button>
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={step === 1 ? goNext : goNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === 2 && !data._aiGenerated ? "Skip AI →" : "Continue →"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-brand-500/30 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75"/>
                      </svg>
                      {mode === "edit" ? "Saving..." : "Creating Profile..."}
                    </>
                  ) : (
                    <>🎉 {mode === "edit" ? "Save Changes" : "Create My Profile"}</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Step hint */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Step {step} of 6 · {mode === "create" ? "Free forever · No credit card" : "Changes saved instantly"}
          </p>
        </div>
      </div>
    </div>
  );
}
