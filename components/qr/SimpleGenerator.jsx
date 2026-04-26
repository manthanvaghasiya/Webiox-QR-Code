"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, QrCode, Upload, Link2, Type, Mail, Phone, MessageSquare,
  Wifi, FileImage, FileCode, Palette, ImagePlus, Sliders, Maximize, ChevronDown,
  Sparkles, MapPin, Globe, MessageCircle, Video, Loader2,
} from "lucide-react";
import ContentForms from "@/components/ContentForms";
import useQrGenerator from "@/hooks/useQrGenerator";

const SIMPLE_TABS = [
  { id: "url", icon: Link2, label: "URL" },
  { id: "text", icon: Type, label: "Text" },
  { id: "email", icon: Mail, label: "Email" },
  { id: "phone", icon: Phone, label: "Phone" },
  { id: "sms", icon: MessageSquare, label: "SMS" },
  { id: "location", icon: MapPin, label: "Location" },
  { id: "facebook", icon: Globe, label: "Facebook" },
  { id: "twitter", icon: MessageCircle, label: "Twitter" },
  { id: "youtube", icon: Video, label: "YouTube" },
  { id: "wifi", icon: Wifi, label: "WiFi" },
];

function AccordionSection({ title, icon: Icon, isOpen, onToggle, badge, children }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left group">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <Icon className="w-4 h-4" />
        </span>
        <span className="flex-1 text-sm font-bold text-gray-800 uppercase tracking-wider">
          {badge && <span className="mr-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{badge}</span>}
          {title}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShapeBtn({ label, value, active, onClick, preview }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/30 shadow-md"
          : "border-gray-200/60 bg-white/50 text-gray-500 hover:border-gray-300 hover:bg-white/80"
      }`}
    >
      <span className="text-lg">{preview}</span>
      <span>{label}</span>
    </button>
  );
}

function ColorPick({ id, label, value, onChange }) {
  return (
    <div className="flex-1 group">
      <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <input
            type="color"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
          />
        </div>
        <label htmlFor={id} className="text-sm text-gray-700 font-semibold cursor-pointer">{label}</label>
      </div>
    </div>
  );
}

export default function SimpleGenerator() {
  const qr = useQrGenerator();
  const [activeTab, setActiveTab] = useState("url");
  const [openSections, setOpenSections] = useState({
    content: true, colors: false, logo: false, design: false, quality: false,
  });
  const toggle = (k) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  const valid = qr.isValid(activeTab);

  return (
    <div className="flex-grow flex flex-col items-center w-full">
      {/* Hero */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
        >
          The 100% Free{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Premium
          </span>{" "}
          QR Code Generator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg text-gray-600 font-medium"
        >
          Quick, clean, and to the point — pick a type, customize, download.
        </motion.p>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {SIMPLE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all backdrop-blur-sm ${
                  activeTab === tab.id
                    ? "bg-white/90 text-blue-700 shadow-md border border-blue-200/50"
                    : "text-gray-500 hover:bg-white/50 hover:text-gray-900 border border-transparent"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. Content */}
          <AccordionSection title="Enter Content" icon={Link2} isOpen={openSections.content} onToggle={() => toggle("content")} badge="1">
            <ContentForms activeTab={activeTab} s={qr.fields} set={qr.set} />
          </AccordionSection>

          {/* 2. Colors */}
          <AccordionSection title="Set Colors" icon={Palette} isOpen={openSections.colors} onToggle={() => toggle("colors")} badge="2">
            <div className="space-y-4">
              <div className="flex bg-gray-100/80 rounded-xl p-1">
                <button
                  onClick={() => qr.setUseGradient(false)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!qr.useGradient ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                >
                  Single Color
                </button>
                <button
                  onClick={() => qr.setUseGradient(true)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${qr.useGradient ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                >
                  Gradient
                </button>
              </div>
              {!qr.useGradient ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <ColorPick id="fgColor" label="QR Color" value={qr.fgColor} onChange={qr.setFgColor} />
                  <ColorPick id="bgColor" label="Background" value={qr.bgColor} onChange={qr.setBgColor} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ColorPick id="gc1" label="Color 1" value={qr.gradientColor1} onChange={qr.setGradientColor1} />
                    <ColorPick id="gc2" label="Color 2" value={qr.gradientColor2} onChange={qr.setGradientColor2} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gradient Type</label>
                      <select
                        className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl outline-none appearance-none cursor-pointer shadow-sm"
                        value={qr.gradientType}
                        onChange={(e) => qr.setGradientType(e.target.value)}
                      >
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                    <ColorPick id="bgColor2" label="BG Color" value={qr.bgColor} onChange={qr.setBgColor} />
                  </div>
                </div>
              )}
              <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
                <input
                  type="checkbox"
                  checked={qr.useCustomEyeColor}
                  onChange={(e) => qr.setUseCustomEyeColor(e.target.checked)}
                  className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-semibold">Custom Eye Color</span>
              </label>
              <AnimatePresence>
                {qr.useCustomEyeColor && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <ColorPick id="eyeFrame" label="Eye Frame" value={qr.eyeFrameColor} onChange={qr.setEyeFrameColor} />
                      <ColorPick id="eyeBall" label="Eye Ball" value={qr.eyeBallColor} onChange={qr.setEyeBallColor} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AccordionSection>

          {/* 3. Logo */}
          <AccordionSection title="Add Logo" icon={ImagePlus} isOpen={openSections.logo} onToggle={() => toggle("logo")} badge="3">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center p-6 bg-white/40 border-2 border-dashed border-gray-300/60 rounded-2xl cursor-pointer hover:bg-white/70 hover:border-blue-400 transition-all backdrop-blur-sm">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Click to upload logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={qr.handleLogoUpload} />
                </label>
                {qr.logo && (
                  <div className="relative w-24 h-24 rounded-2xl border border-gray-200/50 shadow-md bg-white/80 backdrop-blur-sm flex-shrink-0 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qr.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    <button
                      onClick={(e) => { e.preventDefault(); qr.setLogo(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-md"
                      aria-label="Remove logo"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {qr.logo && (
                <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={qr.hideBackgroundDots}
                    onChange={(e) => qr.setHideBackgroundDots(e.target.checked)}
                    className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-semibold">Remove Background Behind Logo</span>
                </label>
              )}
            </div>
          </AccordionSection>

          {/* 4. Design */}
          <AccordionSection title="Customize Design" icon={Sliders} isOpen={openSections.design} onToggle={() => toggle("design")} badge="4">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Dot Pattern</label>
                <div className="grid grid-cols-4 gap-2">
                  <ShapeBtn label="Square" value="square" active={qr.dotPattern === "square"} onClick={qr.setDotPattern} preview="▪️" />
                  <ShapeBtn label="Dots" value="dots" active={qr.dotPattern === "dots"} onClick={qr.setDotPattern} preview="⚫" />
                  <ShapeBtn label="Rounded" value="rounded" active={qr.dotPattern === "rounded"} onClick={qr.setDotPattern} preview="🔵" />
                  <ShapeBtn label="Classy" value="classy" active={qr.dotPattern === "classy"} onClick={qr.setDotPattern} preview="💎" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Eye Frame Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  <ShapeBtn label="Square" value="square" active={qr.cornerStyle === "square"} onClick={qr.setCornerStyle} preview="⬛" />
                  <ShapeBtn label="Dot" value="dot" active={qr.cornerStyle === "dot"} onClick={qr.setCornerStyle} preview="🔴" />
                  <ShapeBtn label="Rounded" value="extra-rounded" active={qr.cornerStyle === "extra-rounded"} onClick={qr.setCornerStyle} preview="🟢" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Eye Ball Shape</label>
                <div className="grid grid-cols-2 gap-2 max-w-[50%]">
                  <ShapeBtn label="Square" value="square" active={qr.eyeBallStyle === "square"} onClick={qr.setEyeBallStyle} preview="⬛" />
                  <ShapeBtn label="Dot" value="dot" active={qr.eyeBallStyle === "dot"} onClick={qr.setEyeBallStyle} preview="⚫" />
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* 5. Quality */}
          <AccordionSection title="Image Quality" icon={Maximize} isOpen={openSections.quality} onToggle={() => toggle("quality")} badge="5">
            <div className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-gray-500">200px</span>
                <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{qr.qrSize} × {qr.qrSize} px</span>
                <span className="text-xs font-semibold text-gray-500">2000px</span>
              </div>
              <input
                type="range"
                min={200}
                max={2000}
                step={100}
                value={qr.qrSize}
                onChange={(e) => qr.setQrSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </AccordionSection>

          {/* CTA */}
          <motion.button
            onClick={() => qr.generateQR(activeTab)}
            disabled={!valid || qr.isGenerating}
            whileHover={{ scale: valid ? 1.02 : 1 }}
            whileTap={{ scale: valid ? 0.97 : 1 }}
            className={`w-full py-5 px-6 font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer ${
              valid
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-blue-600/25"
                : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
            }`}
          >
            {qr.isGenerating ? (
              <><Loader2 className="w-6 h-6 animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="w-6 h-6" />Create QR Code</>
            )}
          </motion.button>
        </div>

        {/* Right column: sticky preview */}
        <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-delayed" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-full aspect-square bg-white/80 border-2 border-dashed border-gray-200/60 rounded-2xl flex items-center justify-center overflow-hidden mb-6 shadow-sm p-6 backdrop-blur-sm">
                <div ref={qr.qrCodeRef} className={`flex items-center justify-center [&_canvas]:!max-w-full [&_canvas]:!h-auto ${!qr.qrCodeUrl ? "hidden" : ""}`} />
                {!qr.qrCodeUrl && (
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-4">
                      <QrCode className="w-10 h-10 opacity-40" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Preview will appear here</p>
                  </div>
                )}
              </div>
              <div className="w-full flex gap-3">
                {[
                  { ext: "png", icon: FileImage, cls: "bg-gray-900 hover:bg-black shadow-gray-900/20" },
                  { ext: "svg", icon: FileCode, cls: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20" },
                  { ext: "webp", icon: Download, cls: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20" },
                ].map((b) => (
                  <motion.button
                    key={b.ext}
                    onClick={() => qr.downloadQR(b.ext)}
                    disabled={!qr.qrCodeUrl}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-3.5 px-4 ${b.cls} disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl disabled:shadow-none cursor-pointer`}
                  >
                    <b.icon className="w-4 h-4" />
                    {b.ext.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
