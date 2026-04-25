"use client";

import { useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, QrCode, Upload, Link2, Type, Mail, Phone, MessageSquare, Contact,
  Wifi, FileImage, FileCode, Palette, ImagePlus, Sliders, Maximize, ChevronDown,
  Sparkles, MapPin, Globe, MessageCircle, Video, Calendar, Bitcoin, Music, FileText, Share2, Smartphone, Images, Star, CreditCard, Loader2
} from "lucide-react";
import ContentForms from "@/components/ContentForms";
import formatQrData from "@/lib/formatQrData";

/* ── Sub-components ── */
function AccordionSection({ title, icon: Icon, isOpen, onToggle, badge, children }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left group">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <Icon className="w-4 h-4" />
        </span>
        <span className="flex-1 text-sm font-bold text-gray-800 uppercase tracking-wider">{badge && <span className="mr-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{badge}</span>}{title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShapeBtn({ label, value, active, onClick, preview }) {
  return (
    <button onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${active ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/30 shadow-md" : "border-gray-200/60 bg-white/50 text-gray-500 hover:border-gray-300 hover:bg-white/80"}`}>
      <span className="text-lg">{preview}</span><span>{label}</span>
    </button>
  );
}

function ColorPick({ id, label, value, onChange }) {
  return (
    <div className="flex-1 group">
      <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <input type="color" id={id} value={value} onChange={(e) => onChange(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
        </div>
        <label htmlFor={id} className="text-sm text-gray-700 font-semibold cursor-pointer">{label}</label>
      </div>
    </div>
  );
}

/* ── Tabs Config ── */
const TABS = [
  { id: "url", icon: Link2, label: "URL" },
  { id: "text", icon: Type, label: "Text" },
  { id: "email", icon: Mail, label: "Email" },
  { id: "phone", icon: Phone, label: "Phone" },
  { id: "sms", icon: MessageSquare, label: "SMS" },
  { id: "vcard", icon: Contact, label: "vCard" },
  { id: "mecard", icon: CreditCard, label: "meCard" },
  { id: "location", icon: MapPin, label: "Location" },
  { id: "facebook", icon: Globe, label: "Facebook" },
  { id: "twitter", icon: MessageCircle, label: "Twitter" },
  { id: "youtube", icon: Video, label: "YouTube" },
  { id: "wifi", icon: Wifi, label: "WiFi" },
  { id: "event", icon: Calendar, label: "Event" },
  { id: "bitcoin", icon: Bitcoin, label: "Bitcoin" },
  { id: "mp3", icon: Music, label: "MP3" },
  { id: "video", icon: Video, label: "Video" },
  { id: "pdf", icon: FileText, label: "PDF" },
  { id: "social", icon: Share2, label: "Social" },
  { id: "appstore", icon: Smartphone, label: "App Store" },
  { id: "gallery", icon: Images, label: "Gallery" },
  { id: "rating", icon: Star, label: "Rating" },
  { id: "feedback", icon: MessageCircle, label: "Feedback" },
];

const FILE_TABS = ["mp3", "video", "pdf", "gallery"];

/* ── Main Component ── */
export default function Home() {
  const [activeTab, setActiveTab] = useState("url");
  const [openSections, setOpenSections] = useState({ content: true, colors: false, logo: false, design: false, quality: false });
  const [isGenerating, setIsGenerating] = useState(false);

  // Unified input state
  const [fields, setFields] = useState({
    content: "", emailAddress: "", emailSubject: "", emailMessage: "",
    phone: "", smsPhone: "", smsMessage: "",
    vcFirstName: "", vcLastName: "", vcPhone: "", vcEmail: "", vcCompany: "", vcTitle: "", vcAddress: "", vcWebsite: "",
    mcName: "", mcReading: "", mcPhone: "", mcEmail: "", mcAddress: "", mcUrl: "",
    lat: "", lng: "",
    wifiSsid: "", wifiPassword: "", wifiEncryption: "WPA",
    evTitle: "", evStart: "", evEnd: "", evLocation: "", evDescription: "",
    btcAddress: "", btcAmount: "", btcMessage: "",
    uploadFile: null,
  });
  const set = (partial) => setFields((prev) => ({ ...prev, ...partial }));

  // Style state
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#000000");
  const [gradientColor2, setGradientColor2] = useState("#4F46E5");
  const [gradientType, setGradientType] = useState("linear");
  const [useCustomEyeColor, setUseCustomEyeColor] = useState(false);
  const [eyeFrameColor, setEyeFrameColor] = useState("#000000");
  const [eyeBallColor, setEyeBallColor] = useState("#000000");
  const [logo, setLogo] = useState(null);
  const [hideBackgroundDots, setHideBackgroundDots] = useState(true);
  const [dotPattern, setDotPattern] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [eyeBallStyle, setEyeBallStyle] = useState("square");
  const [qrSize, setQrSize] = useState(1000);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null);

  const toggle = (k) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  const handleLogoUpload = (e) => { const f = e.target.files?.[0]; if (f) setLogo(URL.createObjectURL(f)); };

  /* Validation */
  const isValid = () => {
    const s = fields;
    switch (activeTab) {
      case "url": case "text": case "facebook": case "twitter": case "youtube":
      case "social": case "appstore": case "rating": case "feedback": return !!s.content.trim();
      case "email": return !!s.emailAddress.trim();
      case "phone": return !!s.phone.trim();
      case "sms": return !!s.smsPhone.trim();
      case "vcard": return !!(s.vcFirstName.trim() || s.vcLastName.trim());
      case "mecard": return !!s.mcName.trim();
      case "location": return !!(s.lat && s.lng);
      case "wifi": return !!s.wifiSsid.trim();
      case "event": return !!(s.evTitle.trim() && s.evStart);
      case "bitcoin": return !!s.btcAddress.trim();
      case "mp3": case "video": case "pdf": case "gallery": return !!s.uploadFile;
      default: return false;
    }
  };

  const generateQR = async () => {
    if (!isValid() || isGenerating) return;
    setIsGenerating(true);
    try {
      const finalContent = await formatQrData(activeTab, fields);
      if (!finalContent) { setIsGenerating(false); return; }

      const dotsOpts = { type: dotPattern };
      if (useGradient) { dotsOpts.gradient = { type: gradientType, rotation: 0, colorStops: [{ offset: 0, color: gradientColor1 }, { offset: 1, color: gradientColor2 }] }; }
      else { dotsOpts.color = fgColor; }

      const cornersOpts = { type: cornerStyle };
      if (useCustomEyeColor) { cornersOpts.color = eyeFrameColor; }
      else if (useGradient) { cornersOpts.gradient = { type: gradientType, rotation: 0, colorStops: [{ offset: 0, color: gradientColor1 }, { offset: 1, color: gradientColor2 }] }; }
      else { cornersOpts.color = fgColor; }

      const cornersDotOpts = { type: eyeBallStyle };
      if (useCustomEyeColor) { cornersDotOpts.color = eyeBallColor; }
      else if (useGradient) { cornersDotOpts.gradient = { type: gradientType, rotation: 0, colorStops: [{ offset: 0, color: gradientColor1 }, { offset: 1, color: gradientColor2 }] }; }
      else { cornersDotOpts.color = fgColor; }

      const qrCode = new QRCodeStyling({
        width: qrSize, height: qrSize, data: finalContent, image: logo || undefined,
        dotsOptions: dotsOpts, backgroundOptions: { color: bgColor },
        cornersSquareOptions: cornersOpts, cornersDotOptions: cornersDotOpts,
        imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.4, hideBackgroundDots },
      });
      qrCodeInstance.current = qrCode;
      if (qrCodeRef.current) { qrCodeRef.current.innerHTML = ""; qrCode.append(qrCodeRef.current); }
      setQrCodeUrl("generated");

      fetch("/api/qrcodes", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: finalContent, fgColor, bgColor, hasLogo: !!logo }),
      }).catch(() => {});
    } catch (err) { console.error("Error generating QR code", err); }
    setIsGenerating(false);
  };

  const downloadQR = (ext) => { if (qrCodeInstance.current) qrCodeInstance.current.download({ name: "webiox-qr", extension: ext }); };

  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col items-center py-12 px-4 sm:px-8 w-full min-h-screen">
      {/* Hero */}
      <div className="text-center mb-12 max-w-3xl mx-auto mt-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          The 100% Free <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Premium</span> QR Code Generator
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-lg text-gray-600 font-medium">
          Create custom QR Codes with logos, colors, and high-quality designs for your brand.
        </motion.p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all backdrop-blur-sm ${activeTab === tab.id ? "bg-white/90 text-blue-700 shadow-md border border-blue-200/50" : "text-gray-500 hover:bg-white/50 hover:text-gray-900 border border-transparent"}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>

          {/* 1. Content */}
          <AccordionSection title="Enter Content" icon={Link2} isOpen={openSections.content} onToggle={() => toggle("content")} badge="1">
            <ContentForms activeTab={activeTab} s={fields} set={set} />
          </AccordionSection>

          {/* 2. Colors */}
          <AccordionSection title="Set Colors" icon={Palette} isOpen={openSections.colors} onToggle={() => toggle("colors")} badge="2">
            <div className="space-y-4">
              <div className="flex bg-gray-100/80 rounded-xl p-1">
                <button onClick={() => setUseGradient(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!useGradient ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Single Color</button>
                <button onClick={() => setUseGradient(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${useGradient ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Gradient</button>
              </div>
              {!useGradient ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <ColorPick id="fgColor" label="QR Color" value={fgColor} onChange={setFgColor} />
                  <ColorPick id="bgColor" label="Background" value={bgColor} onChange={setBgColor} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ColorPick id="gc1" label="Color 1" value={gradientColor1} onChange={setGradientColor1} />
                    <ColorPick id="gc2" label="Color 2" value={gradientColor2} onChange={setGradientColor2} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gradient Type</label>
                      <select className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl outline-none appearance-none cursor-pointer shadow-sm" value={gradientType} onChange={(e) => setGradientType(e.target.value)}>
                        <option value="linear">Linear</option><option value="radial">Radial</option>
                      </select>
                    </div>
                    <ColorPick id="bgColor2" label="BG Color" value={bgColor} onChange={setBgColor} />
                  </div>
                </div>
              )}
              <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
                <input type="checkbox" checked={useCustomEyeColor} onChange={(e) => setUseCustomEyeColor(e.target.checked)} className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-sm text-gray-700 font-semibold">Custom Eye Color</span>
              </label>
              <AnimatePresence>
                {useCustomEyeColor && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <ColorPick id="eyeFrame" label="Eye Frame" value={eyeFrameColor} onChange={setEyeFrameColor} />
                      <ColorPick id="eyeBall" label="Eye Ball" value={eyeBallColor} onChange={setEyeBallColor} />
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
                  <Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm font-medium text-gray-600">Click to upload logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                {logo && (
                  <div className="relative w-24 h-24 rounded-2xl border border-gray-200/50 shadow-md bg-white/80 backdrop-blur-sm flex-shrink-0 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    <button onClick={(e) => { e.preventDefault(); setLogo(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-md">×</button>
                  </div>
                )}
              </div>
              {logo && (
                <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl cursor-pointer hover:bg-white/80 transition-all shadow-sm">
                  <input type="checkbox" checked={hideBackgroundDots} onChange={(e) => setHideBackgroundDots(e.target.checked)} className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
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
                  <ShapeBtn label="Square" value="square" active={dotPattern === "square"} onClick={setDotPattern} preview="▪️" />
                  <ShapeBtn label="Dots" value="dots" active={dotPattern === "dots"} onClick={setDotPattern} preview="⚫" />
                  <ShapeBtn label="Rounded" value="rounded" active={dotPattern === "rounded"} onClick={setDotPattern} preview="🔵" />
                  <ShapeBtn label="Classy" value="classy" active={dotPattern === "classy"} onClick={setDotPattern} preview="💎" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Eye Frame Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  <ShapeBtn label="Square" value="square" active={cornerStyle === "square"} onClick={setCornerStyle} preview="⬛" />
                  <ShapeBtn label="Dot" value="dot" active={cornerStyle === "dot"} onClick={setCornerStyle} preview="🔴" />
                  <ShapeBtn label="Rounded" value="extra-rounded" active={cornerStyle === "extra-rounded"} onClick={setCornerStyle} preview="🟢" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Eye Ball Shape</label>
                <div className="grid grid-cols-2 gap-2 max-w-[50%]">
                  <ShapeBtn label="Square" value="square" active={eyeBallStyle === "square"} onClick={setEyeBallStyle} preview="⬛" />
                  <ShapeBtn label="Dot" value="dot" active={eyeBallStyle === "dot"} onClick={setEyeBallStyle} preview="⚫" />
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* 5. Quality */}
          <AccordionSection title="Image Quality" icon={Maximize} isOpen={openSections.quality} onToggle={() => toggle("quality")} badge="5">
            <div className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-gray-500">200px</span>
                <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{qrSize} × {qrSize} px</span>
                <span className="text-xs font-semibold text-gray-500">2000px</span>
              </div>
              <input type="range" min={200} max={2000} step={100} value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full" />
            </div>
          </AccordionSection>

          {/* CTA */}
          <motion.button onClick={generateQR} disabled={!isValid() || isGenerating} whileHover={{ scale: isValid() ? 1.02 : 1 }} whileTap={{ scale: isValid() ? 0.97 : 1 }}
            className={`w-full py-5 px-6 font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer ${isValid() ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-blue-600/25" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"}`}>
            {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" />Generating...</> : <><Sparkles className="w-6 h-6" />Create QR Code</>}
          </motion.button>
        </div>

        {/* Right Column — Sticky Preview */}
        <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-delayed" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-full aspect-square bg-white/80 border-2 border-dashed border-gray-200/60 rounded-2xl flex items-center justify-center overflow-hidden mb-6 shadow-sm p-6 backdrop-blur-sm">
                <div ref={qrCodeRef} className={`flex items-center justify-center [&_canvas]:!max-w-full [&_canvas]:!h-auto ${!qrCodeUrl ? "hidden" : ""}`} />
                {!qrCodeUrl && (
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-4"><QrCode className="w-10 h-10 opacity-40" /></div>
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
                  <motion.button key={b.ext} onClick={() => downloadQR(b.ext)} disabled={!qrCodeUrl} whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-3.5 px-4 ${b.cls} disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl disabled:shadow-none cursor-pointer`}>
                    <b.icon className="w-4 h-4" />{b.ext.toUpperCase()}
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
