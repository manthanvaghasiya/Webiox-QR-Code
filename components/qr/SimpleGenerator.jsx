"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Link2, Palette, ImagePlus, Sliders, Maximize, QrCode,
  Sparkles, Copy, RotateCcw, Frame,
} from "lucide-react";
import { QR_TABS, SIMPLE_TAB_IDS } from "@/lib/qrTabs";
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

export default function SimpleGenerator({ qr, qrContainerRef }) {
  const [openSections, setOpenSections] = useState({
    content: true, colors: false, logo: false, design: false, frame: false, quality: false,
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const toggle = (k) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));

  const copyQrData = async () => {
    try {
      const { default: formatQrData } = await import("@/lib/formatQrData");
      const data = await formatQrData(qr.activeTab, qr.fields);
      if (data) await navigator.clipboard.writeText(data);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex-grow flex flex-col items-center w-full">
      {/* Hero */}
      <div className="text-center mb-6 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3"
        >
          Free QR{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Generator
          </span>
        </motion.h1>
        <button
          onClick={() => setShowTemplates((v) => !v)}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showTemplates ? "Hide Templates ▲" : "Browse Templates ▼"}
        </button>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="max-w-7xl w-full mb-6">
          <TemplateGallery onApply={qr.applyTemplate} />
        </div>
      )}

      {/* Tab bar: all 22 tabs */}
      <div className="max-w-7xl w-full mb-4">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {QR_TABS.filter((tab) => SIMPLE_TAB_IDS.includes(tab.id)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => qr.setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all backdrop-blur-sm ${
                qr.activeTab === tab.id
                  ? "bg-white/90 text-blue-700 shadow-md border border-blue-200/50"
                  : "text-gray-500 hover:bg-white/50 hover:text-gray-900 border border-transparent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-4">
          <AccordionSection title="Enter Content" icon={Link2} isOpen={openSections.content} onToggle={() => toggle("content")} badge="1">
            {qr.activeTab === "social" ? (
              <SocialLinksForm
                links={qr.socialLinks} onAdd={qr.addSocialLink} onRemove={qr.removeSocialLink} onUpdate={qr.updateSocialLink}
                pageTitle={qr.socialPageTitle} onPageTitle={qr.setSocialPageTitle}
                pageDesc={qr.socialPageDescription} onPageDesc={qr.setSocialPageDescription}
              />
            ) : (
              <ContentForms activeTab={qr.activeTab} s={qr.fields} set={qr.set} />
            )}
          </AccordionSection>

          <AccordionSection title="Set Colors" icon={Palette} isOpen={openSections.colors} onToggle={() => toggle("colors")} badge="2">
            <ColorsSection qr={qr} />
          </AccordionSection>

          <AccordionSection title="Add Logo" icon={ImagePlus} isOpen={openSections.logo} onToggle={() => toggle("logo")} badge="3">
            <LogoSection qr={qr} />
          </AccordionSection>

          <AccordionSection title="Customize Design" icon={Sliders} isOpen={openSections.design} onToggle={() => toggle("design")} badge="4">
            <DesignSection qr={qr} />
          </AccordionSection>

          <AccordionSection title="Add Frame" icon={Frame} isOpen={openSections.frame} onToggle={() => toggle("frame")} badge="5">
            <FrameSection qr={qr} />
          </AccordionSection>

          <AccordionSection title="Quality & Export" icon={Maximize} isOpen={openSections.quality} onToggle={() => toggle("quality")} badge="6">
            <QualitySection qr={qr} />
          </AccordionSection>
        </div>

        {/* Right column: sticky preview */}
        <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start hidden lg:block">
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-delayed" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className={`w-full rounded-2xl flex items-center justify-center overflow-hidden shadow-sm p-4 backdrop-blur-sm ${
                qr.transparentBg && qr.qrCodeUrl
                  ? "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')] bg-repeat bg-[length:20px_20px]"
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
                  <div className="flex flex-col items-center text-gray-400 py-16">
                    <div className="w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-4">
                      <QrCode className="w-10 h-10 opacity-40" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Start typing to preview</p>
                  </div>
                )}
              </div>

              <DownloadMenu onDownload={qr.downloadQR} disabled={!qr.qrCodeUrl} lastFormat={qr.lastFormat} />

              <div className="w-full flex gap-2">
                <button
                  onClick={copyQrData}
                  disabled={!qr.qrCodeUrl}
                  className="flex-1 py-2.5 px-4 bg-white/80 border border-gray-200/60 rounded-xl text-sm font-bold text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy Data
                </button>
                <button
                  onClick={qr.resetAll}
                  className="py-2.5 px-4 bg-white/80 border border-gray-200/60 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>

              {/* Hosted page created panel (desktop) */}
              {qr.lastCreatedPage && (
                <div className="w-full mt-2">
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

        {/* Mobile preview (shown below on small screens) */}
        <div className="lg:hidden">
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className={`w-full max-w-[280px] rounded-2xl flex items-center justify-center overflow-hidden shadow-sm p-4 ${
                qr.transparentBg && qr.qrCodeUrl
                  ? "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')]"
                  : "bg-white/80 border-2 border-dashed border-gray-200/60"
              }`}>
                {!qr.qrCodeUrl && (
                  <div className="flex flex-col items-center text-gray-400 py-16">
                    <QrCode className="w-10 h-10 opacity-40 mb-2" />
                    <p className="text-xs font-medium">Start typing to preview</p>
                  </div>
                )}
              </div>
              <DownloadMenu onDownload={qr.downloadQR} disabled={!qr.qrCodeUrl} lastFormat={qr.lastFormat} />

              {/* Hosted page created panel (mobile) */}
              {qr.lastCreatedPage && (
                <div className="w-full mt-2">
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
    </div>
  );
}
