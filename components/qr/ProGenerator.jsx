"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ArrowRight, Sparkles, Palette, ImagePlus,
  Sliders, Maximize, QrCode, Copy, RotateCcw, Search, Frame,
  Check, Zap, Eye, Smartphone, Tag, Phone, Mail, MapPin, Globe,
  Briefcase, User,
} from "lucide-react";
import { QR_TABS, CATEGORIES, SIMPLE_TAB_IDS } from "@/lib/qrTabs";
import ContentForms from "@/components/ContentForms";
import SocialLinksForm from "@/components/qr/SocialLinksForm";
import AccordionSection from "./AccordionSection";
import ColorsSection from "./ColorsSection";
import DesignSection from "./DesignSection";
import QualitySection from "./QualitySection";
import LogoSection from "./LogoSection";
import FrameSection from "./FrameSection";
import DownloadMenu from "./DownloadMenu";
import TemplateGallery from "./TemplateGallery";
import PageCreatedPanel from "./PageCreatedPanel";
import QrFrameWrapper from "./QrFrameWrapper";

const TOTAL_STEPS = 3;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.96 }),
};

const CATEGORY_COLORS = {
  essential: { bg: "from-blue-500 to-indigo-600", light: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  contact: { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  social: { bg: "from-pink-500 to-rose-600", light: "bg-pink-50 text-pink-700", dot: "bg-pink-500" },
  media: { bg: "from-amber-500 to-orange-600", light: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  business: { bg: "from-violet-500 to-purple-600", light: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
};

// ── Step Indicator ──
function StepIndicator({ current, total, onStepClick }) {
  const steps = [
    { num: 1, label: "Choose Type" },
    { num: 2, label: "Add Content" },
    { num: 3, label: "Customize" },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.slice(0, total).map((s, i) => {
        const isActive = s.num === current;
        const isDone = s.num < current;
        const canClick = isDone;
        return (
          <div key={s.num} className="flex items-center">
            <button
              onClick={() => canClick && onStepClick(s.num)}
              disabled={!canClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                  : isDone
                  ? "bg-brand-50 text-brand-700 hover:bg-brand-100 cursor-pointer"
                  : "bg-gray-100/60 text-gray-400"
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isActive ? "bg-white/25" : "bg-gray-200/80"
                }`}>
                  {s.num}
                </span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < total - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 rounded-full transition-colors ${
                isDone ? "bg-brand-400" : "bg-gray-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Mini Phone Preview for Step 2 ──
function PhonePreview({ tab, fields }) {
  const isVcard = tab === "vcard" || tab === "mecard";
  const isPdf = tab === "pdf";
  const isEvent = tab === "event";
  const isUrl = ["url","facebook","twitter","youtube","appstore","rating","feedback"].includes(tab);

  if (isVcard) {
    const name = `${fields.vcFirstName || ""} ${fields.vcLastName || ""}`.trim() || "Your Name";
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full">
        <div className="h-24 bg-gradient-to-br from-brand-500 to-purple-600 relative">
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-white">
            <User className="w-8 h-8 text-gray-300" />
          </div>
        </div>
        <div className="pt-10 px-4 pb-4 text-center">
          <h4 className="text-sm font-bold text-gray-900">{name}</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">{fields.vcTitle || "Job Title"} · {fields.vcCompany || "Company"}</p>
          <div className="flex justify-center gap-3 mt-3">
            {[Phone, Mail, MapPin].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-brand-600" />
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 text-left">
            {fields.vcPhone && <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" />{fields.vcPhone}</p>}
            {fields.vcEmail && <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-400" />{fields.vcEmail}</p>}
            {fields.vcWebsite && <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Globe className="w-3 h-3 text-gray-400" />{fields.vcWebsite}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-inner h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <QrCode className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-xs font-bold text-gray-700">QR Preview</p>
      <p className="text-[10px] text-gray-400 mt-1">Fill in details to see preview</p>
    </div>
  );
}

export default function ProGenerator({ qr, qrContainerRef }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [qrName, setQrName] = useState("");
  const [openSections, setOpenSections] = useState({
    colors: true, logo: false, design: false, frame: false, quality: false,
  });

  const toggle = (k) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  const chosen = QR_TABS.find((t) => t.id === qr.activeTab);
  const valid = qr.isValid(qr.activeTab);

  const goTo = (s) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };

  // Filter tabs
  const filteredTabs = useMemo(() => {
    const proTabs = QR_TABS.filter(t => !SIMPLE_TAB_IDS.includes(t.id));
    let result = proTabs;

    if (activeCategory !== "all") {
      result = result.filter(t => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  // Group by category
  const grouped = useMemo(() => {
    const map = {};
    for (const cat of CATEGORIES) map[cat.id] = [];
    for (const tab of filteredTabs) {
      if (map[tab.category]) map[tab.category].push(tab);
    }
    return map;
  }, [filteredTabs]);

  const copyQrData = async () => {
    try {
      const { default: formatQrData } = await import("@/lib/formatQrData");
      const data = await formatQrData(qr.activeTab, qr.fields);
      if (data) await navigator.clipboard.writeText(data);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex-grow flex flex-col items-center w-full">
      {/* Step indicator */}
      <StepIndicator current={step} total={TOTAL_STEPS} onStepClick={goTo} />

      <AnimatePresence mode="wait" custom={direction}>
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: Choose Type                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-7xl"
          >
            {/* Hero */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                  What kind of{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    QR code
                  </span>
                  ?
                </h1>
                <p className="text-base text-gray-500 font-medium max-w-lg mx-auto">
                  Choose from {QR_TABS.length - SIMPLE_TAB_IDS.length} advanced types to create your perfect QR code
                </p>
              </motion.div>
            </div>

            {/* Search + category filter */}
            <div className="max-w-3xl mx-auto mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search QR types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400 shadow-md text-sm font-medium transition-all"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCategory === "all"
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-white/60 text-gray-500 hover:bg-white hover:text-gray-800 border border-gray-200/50"
                  }`}
                >
                  All Types
                </button>
                {CATEGORIES.filter(c => c.id !== "essential").map((cat) => {
                  const colors = CATEGORY_COLORS[cat.id];
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(isActive ? "all" : cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        isActive
                          ? `${colors.light} shadow-md ring-1 ring-current/20`
                          : "bg-white/60 text-gray-500 hover:bg-white hover:text-gray-800 border border-gray-200/50"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Quick Templates
              </p>
              <TemplateGallery onApply={(settings) => { qr.applyTemplate(settings); }} />
            </div>

            {/* Cards grouped by category */}
            {(activeCategory === "all" ? CATEGORIES : CATEGORIES.filter(c => c.id === activeCategory)).map((cat) => {
              const tabs = grouped[cat.id];
              if (!tabs || tabs.length === 0) return null;
              const colors = CATEGORY_COLORS[cat.id] || CATEGORY_COLORS.essential;
              return (
                <div key={cat.id} className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    {cat.label}
                    <span className="text-gray-300 font-medium normal-case ml-1">({tabs.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {tabs.map((tab, i) => (
                      <motion.button
                        key={tab.id}
                        type="button"
                        onClick={() => { qr.setActiveTab(tab.id); goTo(2); }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className="group relative text-left p-4 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/10 transition-all" />
                        <div className="relative flex flex-col items-center text-center gap-2.5">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            <tab.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-0.5">{tab.label}</h3>
                            <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">{tab.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* No results */}
            {filteredTabs.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No types found for &quot;{searchQuery}&quot;</p>
                <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700">
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2: Add Content                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-6xl"
          >
            {/* Name your QR Code */}
            <div className="mb-5 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center shadow-sm">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  placeholder={`My ${chosen?.label || 'QR'} QR Code`}
                  className="flex-1 text-lg font-bold text-gray-900 bg-transparent outline-none placeholder-gray-300"
                />
              </div>
            </div>

            {/* Header bar */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md">
              <div className="flex items-center gap-3">
                {chosen && (
                  <>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[chosen.category]?.bg || "from-blue-500 to-indigo-600"} text-white flex items-center justify-center shadow-md`}>
                      <chosen.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Step 2 of 3</p>
                      <h2 className="text-base font-bold text-gray-900">{chosen.label}</h2>
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => goTo(1)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100/60"
              >
                <ChevronLeft className="w-4 h-4" /> Change
              </button>
            </div>

            {/* 2-column: Form + Phone Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              {/* Left: Content form */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-brand-500 rounded-full" />
                    Enter your {chosen?.label || "content"} details
                  </h3>
                  {qr.activeTab === "social" ? (
                    <SocialLinksForm
                      links={qr.socialLinks} onAdd={qr.addSocialLink} onRemove={qr.removeSocialLink} onUpdate={qr.updateSocialLink}
                      pageTitle={qr.socialPageTitle} onPageTitle={qr.setSocialPageTitle}
                      pageDesc={qr.socialPageDescription} onPageDesc={qr.setSocialPageDescription}
                    />
                  ) : (
                    <ContentForms activeTab={qr.activeTab} s={qr.fields} set={qr.set} />
                  )}
                </div>
              </div>

              {/* Right: Phone Preview */}
              <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
                <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Smartphone className="w-3 h-3" /> Page Preview
                  </p>
                  <div className="relative mx-auto w-[220px] h-[400px] bg-black rounded-[28px] shadow-2xl ring-[5px] ring-black overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-10">
                      <div className="w-20 h-5 bg-black rounded-b-2xl" />
                    </div>
                    <div className="h-full bg-gray-50 rounded-[22px] overflow-y-auto scrollbar-hide pt-5">
                      <PhonePreview tab={qr.activeTab} fields={qr.fields} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => goTo(1)}
                className="py-3 px-6 text-sm font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-white/60 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <motion.button
                onClick={() => goTo(3)}
                disabled={!valid}
                whileHover={{ scale: valid ? 1.03 : 1 }}
                whileTap={{ scale: valid ? 0.97 : 1 }}
                className={`py-3.5 px-8 font-bold text-sm rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  valid
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Customize Design <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 3: Customize & Preview                                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-7xl"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md">
              <div className="flex items-center gap-3">
                {chosen && (
                  <>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[chosen.category]?.bg || "from-blue-500 to-indigo-600"} text-white flex items-center justify-center shadow-md`}>
                      <chosen.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Step 3 of 3 · Customize</p>
                      <h2 className="text-base font-bold text-gray-900">{chosen.label}</h2>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTo(2)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100/60"
                >
                  <ChevronLeft className="w-4 h-4" /> Edit Content
                </button>
                <button
                  onClick={() => goTo(1)}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-50"
                >
                  Change Type
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: accordions */}
              <div className="lg:col-span-3 space-y-3">
                <AccordionSection title="Colors" icon={Palette} isOpen={openSections.colors} onToggle={() => toggle("colors")} badge="1">
                  <ColorsSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Logo" icon={ImagePlus} isOpen={openSections.logo} onToggle={() => toggle("logo")} badge="2">
                  <LogoSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Design" icon={Sliders} isOpen={openSections.design} onToggle={() => toggle("design")} badge="3">
                  <DesignSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Frame" icon={Frame} isOpen={openSections.frame} onToggle={() => toggle("frame")} badge="4">
                  <FrameSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Quality & Export" icon={Maximize} isOpen={openSections.quality} onToggle={() => toggle("quality")} badge="5">
                  <QualitySection qr={qr} />
                </AccordionSection>
              </div>

              {/* Right: sticky preview */}
              <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
                <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-delayed" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    {/* Pro badge */}
                    <div className="w-full flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Pro
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Live Preview
                      </span>
                    </div>

                    {/* QR preview area */}
                    <div className={`w-full rounded-2xl flex items-center justify-center overflow-hidden shadow-sm p-4 backdrop-blur-sm ${
                      qr.transparentBg && qr.qrCodeUrl
                        ? "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')]"
                        : "bg-white/80 border-2 border-dashed border-gray-200/60"
                    }`}>
                      {qr.qrCodeUrl ? (
                        <QrFrameWrapper
                          frameStyle={qr.frameStyle}
                          frameText={qr.frameText}
                          frameTextColor={qr.frameTextColor}
                          frameFillColor={qr.frameFillColor}
                          frameBorderColor={qr.frameBorderColor}
                        >
                          <div ref={qrContainerRef} className="flex items-center justify-center [&_canvas]:!max-w-full [&_canvas]:!h-auto" />
                        </QrFrameWrapper>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 py-12">
                          <div className="w-16 h-16 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-3">
                            <QrCode className="w-8 h-8 opacity-40" />
                          </div>
                          <p className="text-xs font-medium text-gray-500">Preview will appear here</p>
                        </div>
                      )}
                    </div>

                    {/* Download */}
                    <DownloadMenu onDownload={qr.downloadQR} disabled={!qr.qrCodeUrl} lastFormat={qr.lastFormat} />

                    {/* Actions row */}
                    <div className="w-full flex gap-2">
                      <button onClick={copyQrData} disabled={!qr.qrCodeUrl}
                        className="flex-1 py-2 px-3 bg-white/80 border border-gray-200/60 rounded-xl text-xs font-bold text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5">
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                      <button onClick={qr.resetAll}
                        className="py-2 px-3 bg-white/80 border border-gray-200/60 rounded-xl text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>

                    {/* Hosted page created panel */}
                    {qr.lastCreatedPage && (
                      <div className="w-full mt-1">
                        <PageCreatedPanel
                          pageUrl={qr.lastCreatedPage.pageUrl}
                          editUrl={qr.lastCreatedPage.editUrl}
                          shortId={qr.lastCreatedPage.shortId}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
