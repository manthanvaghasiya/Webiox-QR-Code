"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ArrowRight, Sparkles, Palette, ImagePlus,
  Sliders, Maximize, QrCode, Copy, RotateCcw, Search, Frame,
} from "lucide-react";
import { QR_TABS, CATEGORIES } from "@/lib/qrTabs";
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

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

export default function ProGenerator({ qr, qrContainerRef }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState({
    colors: false, logo: false, design: false, frame: false, quality: false,
  });

  const toggle = (k) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  const chosen = QR_TABS.find((t) => t.id === qr.activeTab);
  const valid = qr.isValid(qr.activeTab);

  const goTo = (s) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };

  // Filter tabs by search
  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim()) return QR_TABS;
    const q = searchQuery.toLowerCase();
    return QR_TABS.filter(
      (t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-7xl"
          >
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm text-xs font-bold text-blue-700 uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Pro Mode · Step 1 of 3
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                What kind of{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  QR code
                </span>?
              </h1>
              <p className="text-lg text-gray-600 font-medium mb-6">
                22 content types — pick one to start.
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400 shadow-md text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Template row */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Templates</p>
              <TemplateGallery onApply={(settings) => { qr.applyTemplate(settings); }} />
            </div>

            {/* Cards grouped by category */}
            {CATEGORIES.map((cat) => {
              const tabs = grouped[cat.id];
              if (!tabs || tabs.length === 0) return null;
              return (
                <div key={cat.id} className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-500">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${cat.color === "brand" ? "bg-blue-500" : "bg-cyan-500"}`} />
                    {cat.label}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {tabs.map((tab, i) => (
                      <motion.button
                        key={tab.id}
                        type="button"
                        onClick={() => { qr.setActiveTab(tab.id); goTo(2); }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative text-left p-5 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-2xl hover:border-blue-300 transition-all overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/10 transition-all" />
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
                            <tab.icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-0.5">{tab.label}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{tab.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-2xl"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md">
              <div className="flex items-center gap-3">
                {chosen && (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                      <chosen.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 2 · Add Content</p>
                      <h2 className="text-base font-bold text-gray-900">{chosen.label}</h2>
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => goTo(1)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Change type
              </button>
            </div>

            {/* Content form */}
            <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6 mb-6">
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

            <div className="flex justify-end">
              <motion.button
                onClick={() => goTo(3)}
                disabled={!valid}
                whileHover={{ scale: valid ? 1.02 : 1 }}
                whileTap={{ scale: valid ? 0.97 : 1 }}
                className={`py-4 px-8 font-bold text-base rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  valid
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Customize <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-7xl"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md">
              <div className="flex items-center gap-3">
                {chosen && (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                      <chosen.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 3 · Customize</p>
                      <h2 className="text-base font-bold text-gray-900">{chosen.label}</h2>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => goTo(2)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => goTo(1)} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Change type
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: accordions */}
              <div className="lg:col-span-3 space-y-4">
                <AccordionSection title="Colors" icon={Palette} isOpen={openSections.colors} onToggle={() => toggle("colors")}>
                  <ColorsSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Logo" icon={ImagePlus} isOpen={openSections.logo} onToggle={() => toggle("logo")}>
                  <LogoSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Design" icon={Sliders} isOpen={openSections.design} onToggle={() => toggle("design")}>
                  <DesignSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Frame" icon={Frame} isOpen={openSections.frame} onToggle={() => toggle("frame")}>
                  <FrameSection qr={qr} />
                </AccordionSection>
                <AccordionSection title="Quality" icon={Maximize} isOpen={openSections.quality} onToggle={() => toggle("quality")}>
                  <QualitySection qr={qr} />
                </AccordionSection>
              </div>

              {/* Right: sticky preview */}
              <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
                <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-delayed" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <span className="absolute -top-3 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">Pro</span>
                    <div className={`w-full aspect-square rounded-2xl flex items-center justify-center overflow-hidden shadow-sm p-4 backdrop-blur-sm ${
                      qr.transparentBg && qr.qrCodeUrl
                        ? "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')]"
                        : "bg-white/80 border-2 border-dashed border-gray-200/60"
                    }`}>
                      <div ref={qrContainerRef} className={`flex items-center justify-center [&_canvas]:!max-w-full [&_canvas]:!h-auto ${!qr.qrCodeUrl ? "hidden" : ""}`} />
                      {!qr.qrCodeUrl && (
                        <div className="flex flex-col items-center text-gray-400">
                          <div className="w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-4">
                            <QrCode className="w-10 h-10 opacity-40" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Preview will appear here</p>
                        </div>
                      )}
                    </div>
                    <DownloadMenu onDownload={qr.downloadQR} disabled={!qr.qrCodeUrl} lastFormat={qr.lastFormat} />
                    <div className="w-full flex gap-2">
                      <button onClick={copyQrData} disabled={!qr.qrCodeUrl}
                        className="flex-1 py-2.5 px-4 bg-white/80 border border-gray-200/60 rounded-xl text-sm font-bold text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                        <Copy className="w-4 h-4" /> Copy
                      </button>
                      <button onClick={qr.resetAll}
                        className="py-2.5 px-4 bg-white/80 border border-gray-200/60 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset
                      </button>
                    </div>
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
