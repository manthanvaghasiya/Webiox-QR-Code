"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Bitcoin, Music, Contact, CreditCard, Video, FileText,
  Share2, Smartphone, Images, Star, MessageCircle,
  ChevronLeft, Sparkles, Loader2, Palette, ImagePlus, Sliders, Maximize,
  Upload, Download, FileImage, FileCode, QrCode, X,
} from "lucide-react";
import ContentForms from "@/components/ContentForms";
import SocialLinksForm from "@/components/qr/SocialLinksForm";
import useQrGenerator from "@/hooks/useQrGenerator";

const PRO_TABS = [
  { id: "event",    icon: Calendar,       label: "Event",        description: "Calendar invite — date, time, location, details." },
  { id: "bitcoin",  icon: Bitcoin,        label: "Bitcoin",      description: "Crypto payment with address and amount." },
  { id: "mp3",      icon: Music,          label: "MP3",          description: "Upload an audio file and share the link." },
  { id: "vcard",    icon: Contact,        label: "vCard",        description: "Full digital business card with all details." },
  { id: "mecard",   icon: CreditCard,     label: "meCard",       description: "Compact contact card for older devices." },
  { id: "video",    icon: Video,          label: "Video",        description: "Upload a video and share via QR." },
  { id: "pdf",      icon: FileText,       label: "PDF",          description: "Distribute documents — menus, brochures, guides." },
  { id: "social",   icon: Share2,         label: "Social Media", description: "Hosted page bundling all your social links." },
  { id: "appstore", icon: Smartphone,     label: "App Store",    description: "Link to your App Store or Play Store listing." },
  { id: "gallery",  icon: Images,         label: "Gallery",      description: "Upload an image and share the gallery URL." },
  { id: "rating",   icon: Star,           label: "Rating",       description: "Direct customers to your review page." },
  { id: "feedback", icon: MessageCircle,  label: "Feedback",     description: "Send people to your feedback form." },
];

/* ── Modal ── */
function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Customize launcher card ── */
function CustomizeCard({ icon: Icon, title, summary, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left p-5 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-xl hover:border-blue-300 transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{summary}</p>
      <span className="mt-3 inline-block text-xs font-bold text-blue-600 group-hover:text-blue-700">
        Customize →
      </span>
    </button>
  );
}

/* ── Color picker ── */
function ColorPick({ id, label, value, onChange }) {
  return (
    <div className="flex-1 group">
      <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
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

export default function ProGenerator() {
  const qr = useQrGenerator();
  const [chosenType, setChosenType] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  const chosen = chosenType ? PRO_TABS.find((t) => t.id === chosenType) : null;
  const valid = chosenType ? qr.isValid(chosenType) : false;

  return (
    <div className="flex-grow flex flex-col items-center w-full">
      <AnimatePresence mode="wait">
        {!chosen ? (
          /* ── Step 1: Type Picker ── */
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl"
          >
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm text-xs font-bold text-blue-700 uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Pro Mode · Step 1 of 3
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Pick a{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  QR type
                </span>
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Twelve advanced types — pick one to start.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PRO_TABS.map((tab, i) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => setChosenType(tab.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative text-left p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-2xl hover:border-blue-300 transition-all overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/10 transition-all" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                      <tab.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{tab.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tab.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── Step 2 + 3: Form + Customize + Preview ── */
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl"
          >
            {/* Chosen-type header bar */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <chosen.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Pro Mode · Step 2 of 3
                  </p>
                  <h2 className="text-base font-bold text-gray-900">{chosen.label}</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setChosenType(null); setOpenModal(null); }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Change type
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left column */}
              <div className="lg:col-span-3 space-y-6">
                {/* Content form */}
                <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                    Content
                  </h3>
                  {chosenType === "social" ? (
                    <SocialLinksForm
                      links={qr.socialLinks}
                      onAdd={qr.addSocialLink}
                      onRemove={qr.removeSocialLink}
                      onUpdate={qr.updateSocialLink}
                      pageTitle={qr.socialPageTitle}
                      onPageTitle={qr.setSocialPageTitle}
                      pageDesc={qr.socialPageDescription}
                      onPageDesc={qr.setSocialPageDescription}
                    />
                  ) : (
                    <ContentForms activeTab={chosenType} s={qr.fields} set={qr.set} />
                  )}
                </div>

                {/* Customize cards */}
                <div>
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                    Step 3 · Customize
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CustomizeCard
                      icon={Palette}
                      title="Colors"
                      summary={qr.useGradient ? "Gradient · " + qr.gradientType : "Solid · " + qr.fgColor}
                      onClick={() => setOpenModal("colors")}
                    />
                    <CustomizeCard
                      icon={ImagePlus}
                      title="Logo"
                      summary={qr.logo ? "Logo uploaded" : "No logo yet"}
                      onClick={() => setOpenModal("logo")}
                    />
                    <CustomizeCard
                      icon={Sliders}
                      title="Design"
                      summary={`Dots: ${qr.dotPattern} · Eye: ${qr.cornerStyle}`}
                      onClick={() => setOpenModal("design")}
                    />
                    <CustomizeCard
                      icon={Maximize}
                      title="Quality"
                      summary={`${qr.qrSize} × ${qr.qrSize} px`}
                      onClick={() => setOpenModal("quality")}
                    />
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => qr.generateQR(chosenType)}
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
                    <span className="absolute -top-3 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
                      Pro
                    </span>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <Modal isOpen={openModal === "colors"} onClose={() => setOpenModal(null)} title="Customize Colors">
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
              <ColorPick id="pro-fg" label="QR Color" value={qr.fgColor} onChange={qr.setFgColor} />
              <ColorPick id="pro-bg" label="Background" value={qr.bgColor} onChange={qr.setBgColor} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <ColorPick id="pro-gc1" label="Color 1" value={qr.gradientColor1} onChange={qr.setGradientColor1} />
                <ColorPick id="pro-gc2" label="Color 2" value={qr.gradientColor2} onChange={qr.setGradientColor2} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gradient Type</label>
                  <select
                    className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl outline-none cursor-pointer shadow-sm"
                    value={qr.gradientType}
                    onChange={(e) => qr.setGradientType(e.target.value)}
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
                <ColorPick id="pro-bg2" label="Background" value={qr.bgColor} onChange={qr.setBgColor} />
              </div>
            </div>
          )}
          <label className="flex items-center gap-3 p-3 bg-white/50 border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
            <input
              type="checkbox"
              checked={qr.useCustomEyeColor}
              onChange={(e) => qr.setUseCustomEyeColor(e.target.checked)}
              className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-semibold">Custom Eye Color</span>
          </label>
          {qr.useCustomEyeColor && (
            <div className="flex flex-col sm:flex-row gap-3">
              <ColorPick id="pro-ef" label="Eye Frame" value={qr.eyeFrameColor} onChange={qr.setEyeFrameColor} />
              <ColorPick id="pro-eb" label="Eye Ball" value={qr.eyeBallColor} onChange={qr.setEyeBallColor} />
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={openModal === "logo"} onClose={() => setOpenModal(null)} title="Add Logo">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="flex-1 flex flex-col items-center justify-center p-6 bg-white/40 border-2 border-dashed border-gray-300/60 rounded-2xl cursor-pointer hover:bg-white/70 hover:border-blue-400 transition-all">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Click to upload logo</span>
              <input type="file" accept="image/*" className="hidden" onChange={qr.handleLogoUpload} />
            </label>
            {qr.logo && (
              <div className="relative w-24 h-24 rounded-2xl border border-gray-200/50 shadow-md bg-white/80 flex-shrink-0 flex items-center justify-center p-2">
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
            <label className="flex items-center gap-3 p-3 bg-white/50 border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
              <input
                type="checkbox"
                checked={qr.hideBackgroundDots}
                onChange={(e) => qr.setHideBackgroundDots(e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 font-semibold">Remove background behind logo</span>
            </label>
          )}
        </div>
      </Modal>

      <Modal isOpen={openModal === "design"} onClose={() => setOpenModal(null)} title="Customize Design">
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
      </Modal>

      <Modal isOpen={openModal === "quality"} onClose={() => setOpenModal(null)} title="Image Quality">
        <div className="p-4 bg-white/50 border border-gray-200/50 rounded-2xl shadow-sm">
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
      </Modal>
    </div>
  );
}
