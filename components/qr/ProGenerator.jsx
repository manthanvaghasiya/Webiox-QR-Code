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
import TypePickerPreview from "./TypePickerPreview";
import SaveAsTemplateModal from "./SaveAsTemplateModal";
import { Bookmark } from "lucide-react";

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
  const isVcard = tab === "vcard";
  const isMecard = tab === "mecard";
  const isAppstore = tab === "appstore";
  const isPdf = tab === "pdf";
  const isEvent = tab === "event";
  const isSocial = tab === "social";
  const isVideo = tab === "video";
  const isBusiness = tab === "business";
  const isGallery = ["gallery", "images"].includes(tab);
  const isRating = tab === "rating";
  const isFeedback = tab === "feedback";
  const isCoupon = tab === "coupon";
  const isInstagram = tab === "instagram";
  const isFacebook = tab === "facebook";
  const isMp3 = ["mp3", "audio"].includes(tab);
  const isUrl = ["url","twitter","youtube"].includes(tab);

  if (isVcard) {
    const name = fields.vcCompany || `${fields.vcFirstName || ""} ${fields.vcLastName || ""}`.trim() || "Your Name";
    const avatarChar = name.charAt(0).toUpperCase();

    return (
      <div className="bg-[#101415] rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-800">
        <div className="absolute top-[-10%] left-[-20%] w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="pt-6 px-4 pb-4 text-center relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center border-2 border-[#101415] shadow-lg text-white font-bold text-xl mb-3 shrink-0">
            {avatarChar}
          </div>
          
          <h4 className="text-[13px] font-bold text-white leading-tight truncate w-full">{name}</h4>
          <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-1 truncate w-full">
            {fields.vcTitle || "Job Title"}
          </p>
          
          <div className="w-full flex flex-col gap-2 mt-4">
            {/* Mini Link Pill 1 */}
            <div className="w-full h-10 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2.5 shrink-0">
               <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                 <Phone className="w-3 h-3 text-emerald-400" />
               </div>
               <div className="text-left overflow-hidden">
                 <div className="text-[9px] font-semibold text-white">Call Us</div>
                 <div className="text-[8px] text-gray-400 truncate w-24">{fields.vcPhone || "123-456-7890"}</div>
               </div>
            </div>
            {/* Mini Link Pill 2 */}
            <div className="w-full h-10 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2.5 shrink-0">
               <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                 <Mail className="w-3 h-3 text-indigo-400" />
               </div>
               <div className="text-left overflow-hidden">
                 <div className="text-[9px] font-semibold text-white">Email</div>
                 <div className="text-[8px] text-gray-400 truncate w-24">{fields.vcEmail || "email@example.com"}</div>
               </div>
            </div>
            {/* Mini Link Pill 3 */}
            <div className="w-full h-10 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2.5 shrink-0">
               <div className="w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                 <Globe className="w-3 h-3 text-pink-400" />
               </div>
               <div className="text-left overflow-hidden">
                 <div className="text-[9px] font-semibold text-white">Website</div>
                 <div className="text-[8px] text-gray-400 truncate w-24">{fields.vcWebsite ? fields.vcWebsite.replace(/^https?:\/\//i, '') : "website.com"}</div>
               </div>
            </div>
          </div>

          {/* Social Row Mini */}
          <div className="flex gap-2 justify-center mt-5 w-full">
            <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"><div className="w-3 h-3 bg-white/20 rounded-sm" /></div>
            <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"><div className="w-3 h-3 bg-white/20 rounded-sm" /></div>
            <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"><div className="w-3 h-3 bg-white/20 rounded-sm" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (isMecard) {
    const name = fields.mcName || "Your Name";
    const avatarChar = name.charAt(0).toUpperCase();

    return (
      <div className="bg-[#101415] rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-800">
        <div className="absolute top-[-10%] left-[-20%] w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="pt-6 px-4 pb-4 text-center relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center border-2 border-[#101415] shadow-lg text-white font-bold text-2xl mb-3 shrink-0">
            {avatarChar}
          </div>
          
          <h4 className="text-[14px] font-bold text-white leading-tight truncate w-full">{name}</h4>
          {fields.mcBio ? (
            <p className="text-[8px] text-purple-200 mt-2 line-clamp-2 w-full px-2 leading-relaxed opacity-80">
              {fields.mcBio}
            </p>
          ) : (
            <p className="text-[8px] text-purple-200 mt-2 line-clamp-2 w-full px-2 leading-relaxed opacity-50">
              Your personal bio goes here.
            </p>
          )}
          
          <div className="w-full flex flex-col gap-2 mt-4">
            {/* Mini Link Pill 1 */}
            <div className="w-full h-10 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2.5 shrink-0">
               <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                 <Phone className="w-3 h-3 text-purple-400" />
               </div>
               <div className="text-left overflow-hidden">
                 <div className="text-[9px] font-semibold text-white">Call Me</div>
                 <div className="text-[8px] text-gray-400 truncate w-24">{fields.mcPhone || "123-456-7890"}</div>
               </div>
            </div>
            {/* Mini Link Pill 2 */}
            <div className="w-full h-10 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2.5 shrink-0">
               <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                 <Mail className="w-3 h-3 text-pink-400" />
               </div>
               <div className="text-left overflow-hidden">
                 <div className="text-[9px] font-semibold text-white">Email</div>
                 <div className="text-[8px] text-gray-400 truncate w-24">{fields.mcEmail || "hello@example.com"}</div>
               </div>
            </div>
            {/* Mini Link Pill 3 */}
            <div className="w-full h-10 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2.5 shrink-0">
               <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                 <MapPin className="w-3 h-3 text-indigo-400" />
               </div>
               <div className="text-left overflow-hidden">
                 <div className="text-[9px] font-semibold text-white">Location</div>
                 <div className="text-[8px] text-gray-400 truncate w-24">{fields.mcCity || "New York, NY"}</div>
               </div>
            </div>
          </div>

          {/* Social Row Mini */}
          <div className="flex gap-2 justify-center mt-5 w-full">
            <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"><div className="w-3 h-3 bg-white/20 rounded-sm" /></div>
            <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"><div className="w-3 h-3 bg-white/20 rounded-sm" /></div>
            <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"><div className="w-3 h-3 bg-white/20 rounded-sm" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (isAppstore) {
    const appName = fields.asName || "Your App Name";
    const avatarChar = appName.charAt(0).toUpperCase();
    return (
      <div className="bg-[#101415] rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-800 flex flex-col justify-between">
        <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="pt-8 px-4 pb-4 text-center relative z-10 flex flex-col items-center flex-1 w-full h-full">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border-2 border-[#101415] shadow-lg text-white font-bold text-3xl mb-4 shrink-0">
             {avatarChar}
          </div>

          <h4 className="text-[14px] font-bold text-white leading-tight truncate w-full">{appName}</h4>
          <p className="text-[9px] text-gray-400 mt-2 line-clamp-3 w-full px-2 leading-relaxed">
            {fields.asDesc || "Download the ultimate app today. Available on iOS and Android."}
          </p>

          <div className="w-full flex flex-col gap-2 mt-auto pt-6">
             <div className="w-full h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center px-2.5 gap-2 shrink-0 backdrop-blur-md">
               <div className="text-[10px] font-semibold text-white">App Store</div>
             </div>
             <div className="w-full h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center px-2.5 gap-2 shrink-0 backdrop-blur-md">
               <div className="text-[10px] font-semibold text-white">Google Play</div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSocial) {
    const pageTitle = fields.pageTitle || "Your Page";
    const titleChar = pageTitle.charAt(0).toUpperCase();
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-800 flex flex-col p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
            {titleChar}
          </div>
          <h4 className="text-[12px] font-bold text-white">{pageTitle}</h4>
          <p className="text-[8px] text-gray-400">{fields.pageDescription || "Your description"}</p>
        </div>
        <div className="flex flex-col gap-2 mt-4 space-y-2">
          <div className="w-full h-8 rounded-lg bg-white/10 border border-white/10 flex items-center px-2 gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/30" />
            <div className="text-[8px] text-white font-semibold">Link 1</div>
          </div>
          <div className="w-full h-8 rounded-lg bg-white/10 border border-white/10 flex items-center px-2 gap-2">
            <div className="w-4 h-4 rounded bg-pink-500/30" />
            <div className="text-[8px] text-white font-semibold">Link 2</div>
          </div>
        </div>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-200">
        <div className="w-full h-32 bg-black flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1" />
          </div>
        </div>
        <div className="p-3">
          <h4 className="text-[11px] font-bold text-gray-900">{fields.title || "Video Title"}</h4>
          <p className="text-[8px] text-gray-500 mt-1">{fields.description || "Video description"}</p>
          <button className="w-full mt-3 h-7 rounded-md bg-blue-600 text-white text-[9px] font-bold">Watch</button>
        </div>
      </div>
    );
  }

  if (isBusiness) {
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-200">
        <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-blue-600" />
        <div className="p-3 -mt-8 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold flex items-center justify-center text-sm mb-2">
            {(fields.name || "B").charAt(0).toUpperCase()}
          </div>
          <h4 className="text-[11px] font-bold text-gray-900">{fields.name || "Business Name"}</h4>
          <p className="text-[8px] text-gray-500 mt-1">{fields.tagline || "Business tagline"}</p>
          <div className="flex flex-col gap-1 mt-3">
            <div className="flex items-center gap-2 text-[8px] text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Open now</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGallery) {
    return (
      <div className="bg-gray-900 rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-800 flex flex-col p-3">
        <div className="text-center text-white mb-3">
          <h4 className="text-[11px] font-bold">{fields.title || "Gallery"}</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="bg-gray-700 rounded h-12" />
          <div className="bg-gray-700 rounded h-12" />
          <div className="bg-gray-700 rounded h-12" />
          <div className="bg-gray-700 rounded h-12" />
        </div>
      </div>
    );
  }

  if (isRating) {
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-200 flex flex-col p-4">
        <h4 className="text-[11px] font-bold text-gray-900 text-center">{fields.businessName || "Rate Us"}</h4>
        <p className="text-[8px] text-gray-500 text-center mt-2">{fields.question || "How was your experience?"}</p>
        <div className="flex gap-1 justify-center mt-4">
          {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 rounded-full bg-yellow-400 text-[6px] flex items-center justify-center text-yellow-700 font-bold">★</div>)}
        </div>
      </div>
    );
  }

  if (isFeedback) {
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-200 flex flex-col p-4">
        <h4 className="text-[11px] font-bold text-gray-900">{fields.businessName || "Feedback"}</h4>
        <p className="text-[8px] text-gray-500 mt-2">{fields.prompt || "Give us your feedback"}</p>
        <button className="w-full mt-4 h-7 rounded-md bg-blue-600 text-white text-[9px] font-bold">Start</button>
      </div>
    );
  }

  if (isCoupon) {
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-200">
        <div className="p-3 bg-red-600 text-white">
          <h4 className="text-[10px] font-bold uppercase">{fields.businessName || "Coupon"}</h4>
        </div>
        <div className="p-4 text-center">
          <div className="text-[20px] font-black text-red-600">{fields.discount || "50% OFF"}</div>
          <p className="text-[9px] text-gray-600 mt-2">{fields.headline || "Special Offer"}</p>
          <div className="mt-3 px-2 py-1 bg-gray-100 rounded border-2 border-dashed border-gray-300">
            <p className="text-[8px] font-mono font-bold text-gray-700">{fields.code || "SAVE50"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isInstagram) {
    return (
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-300 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-600 mb-2">
          <Briefcase className="w-6 h-6" />
        </div>
        <p className="text-white font-bold text-[11px]">@{fields.username || "username"}</p>
        <p className="text-white text-[8px] mt-1 opacity-80">View Profile</p>
      </div>
    );
  }

  if (isFacebook) {
    return (
      <div className="bg-white rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-200 flex flex-col p-4">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-2">f</div>
        <p className="text-[9px] font-bold text-gray-900">{fields.pageName || "Facebook Page"}</p>
        <button className="w-full mt-4 h-7 rounded-md bg-blue-600 text-white text-[9px] font-bold">Like</button>
      </div>
    );
  }

  if (isMp3) {
    return (
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl shadow-inner overflow-hidden h-full relative font-sans border border-gray-700 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-lg bg-purple-700 flex items-center justify-center text-white mb-2 text-xl">♪</div>
        <p className="text-white font-bold text-[11px] text-center">{fields.trackTitle || "Track Title"}</p>
        <p className="text-purple-200 text-[8px] text-center mt-1">{fields.artist || "Artist Name"}</p>
        <button className="mt-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">▶</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-inner h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <QrCode className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-xs font-bold text-gray-700">Preview</p>
      <p className="text-[10px] text-gray-400 mt-1">Fill in details to see preview</p>
    </div>
  );
}

export default function ProGenerator({ qr, qrContainerRef }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewType, setPreviewType] = useState(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
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

            {/* Two-column: cards + live preview */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div className="min-w-0">
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
                        onMouseEnter={() => setPreviewType(tab)}
                        onFocus={() => setPreviewType(tab)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className={`group relative text-left p-4 rounded-2xl border bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer ${
                          previewType?.id === tab.id ? "border-blue-400 ring-2 ring-blue-200" : "border-white/40 hover:border-blue-300"
                        }`}
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
            </div>

            {/* Live preview pane */}
            <div className="hidden lg:block">
              <TypePickerPreview tab={previewType} />
            </div>
            </div>
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
                onClick={async () => {
                  if (qr.activeTab === "social" || qr.activeTab === "vcard") {
                    await qr.generateQR({ skipSave: false });
                  }
                  goTo(3);
                }}
                disabled={!valid || qr.isGenerating}
                whileHover={{ scale: (valid && !qr.isGenerating) ? 1.03 : 1 }}
                whileTap={{ scale: (valid && !qr.isGenerating) ? 0.97 : 1 }}
                className={`py-3.5 px-8 font-bold text-sm rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  (valid && !qr.isGenerating)
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {qr.isGenerating ? (
                  <>Generating... <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /></>
                ) : (
                  <>Customize Design <ArrowRight className="w-4 h-4" /></>
                )}
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
                      <button
                        onClick={() => setShowSaveTemplate(true)}
                        className="py-2 px-3 bg-white/80 border border-gray-200/60 rounded-xl text-xs font-bold text-gray-700 hover:bg-white transition-all flex items-center justify-center gap-1.5"
                        title="Save current design as a reusable template"
                      >
                        <Bookmark className="w-3.5 h-3.5" /> Save as template
                      </button>
                      <button onClick={qr.resetAll}
                        className="py-2 px-3 bg-white/80 border border-gray-200/60 rounded-xl text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>

                    <SaveAsTemplateModal
                      open={showSaveTemplate}
                      onClose={() => setShowSaveTemplate(false)}
                      design={{
                        fgColor: qr.fgColor,
                        bgColor: qr.bgColor,
                        useGradient: qr.useGradient,
                        gradientColor1: qr.gradientColor1,
                        gradientColor2: qr.gradientColor2,
                        gradientType: qr.gradientType,
                        dotPattern: qr.dotPattern,
                        cornerStyle: qr.cornerStyle,
                        eyeBallStyle: qr.eyeBallStyle,
                        useCustomEyeColor: qr.useCustomEyeColor,
                        eyeFrameColor: qr.eyeFrameColor,
                        eyeBallColor: qr.eyeBallColor,
                        logo: qr.logo,
                        errorCorrectionLevel: qr.errorCorrectionLevel,
                        frameStyle: qr.frameStyle,
                        frameText: qr.frameText,
                        frameTextColor: qr.frameTextColor,
                        frameFillColor: qr.frameFillColor,
                      }}
                    />

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
