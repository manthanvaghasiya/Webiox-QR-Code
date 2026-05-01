"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Mail, MapPin, FileText, Clock, Calendar,
  Star, ThumbsUp, Tag, Camera, Play, Pause, Globe,
  Smartphone, MousePointer2,
} from "lucide-react";

function PhoneFrame({ children }) {
  return (
    <div className="relative w-[260px] h-[520px] mx-auto rounded-[2.5rem] border-[10px] border-ink-900 bg-white shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink-900 rounded-b-2xl z-20" />
      <div className="w-full h-full overflow-hidden">{children}</div>
    </div>
  );
}

function VcardMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-[#455a64] h-1/3 flex flex-col items-center justify-end pb-4 text-white">
        <div className="w-16 h-16 rounded-full bg-white/20 mb-2 flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <p className="font-bold">Emily Bates</p>
        <p className="text-xs opacity-75">Designer</p>
      </div>
      <div className="grid grid-cols-3 bg-[#455a64] text-white text-[10px] py-2 border-t border-white/10">
        {[Phone, Mail, MapPin].map((Ic, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <Ic className="w-3.5 h-3.5" />
            <span className="text-[8px]">{["CALL", "EMAIL", "MAP"][i]}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 text-[10px] text-ink-700 leading-relaxed">
        Seeking for freelance work with over 10 years of design experience.
      </div>
      <div className="px-4 text-[10px] text-ink-500">
        <p className="font-mono">+1-555-555-1234</p>
        <p>Mobile</p>
      </div>
    </div>
  );
}

function PdfMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-[#da5167] px-4 pt-3 pb-2 text-white">
        <p className="text-[9px] font-bold opacity-80">Bike Cycles, LLC</p>
        <p className="text-sm font-bold">Catalogue 2.18</p>
        <p className="text-[10px] opacity-90">Spring/Summer collection</p>
      </div>
      <div className="flex-1 bg-ink-100 flex items-center justify-center p-4">
        <FileText className="w-20 h-20 text-ink-300" />
      </div>
      <div className="bg-[#464154] py-3 text-center text-white text-xs font-bold">View PDF</div>
    </div>
  );
}

function BusinessMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-1/3 bg-gradient-to-br from-amber-400 to-amber-600 relative">
        <Camera className="absolute inset-0 m-auto w-12 h-12 text-white/40" />
      </div>
      <div className="bg-[#3F8FD3] px-4 py-3 text-white">
        <p className="text-[9px] uppercase tracking-wider opacity-80">Joy's Cafe</p>
        <p className="text-sm font-bold">Eat. Refresh. Go.</p>
        <p className="text-[10px] opacity-90 mt-1">Fresh & healthy snacks</p>
        <button className="mt-2 px-3 py-1 bg-white text-[#3F8FD3] text-[10px] font-bold rounded">VIEW MENU</button>
      </div>
      <div className="px-4 py-3 text-[10px] flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-ink-700">Wed 8:00 am – 8:00 pm</span>
        <span className="ml-auto text-emerald-500 font-bold">Open Now</span>
      </div>
    </div>
  );
}

function SocialMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-1/3 bg-[#447fb6] flex items-center justify-center text-white text-2xl font-black">
        Follow Us
      </div>
      <div className="bg-[#447fb6] px-4 py-2 text-white">
        <p className="text-[11px] font-bold">Connect with us on social media</p>
      </div>
      <div className="divide-y divide-ink-100">
        {[
          { Ic: Globe, name: "Visit us online", color: "bg-ink-700" },
          { Ic: ThumbsUp, name: "Facebook", color: "bg-blue-600" },
          { Ic: Play, name: "YouTube", color: "bg-red-600" },
        ].map((it, i) => (
          <div key={i} className="px-4 py-2.5 flex items-center gap-2.5">
            <span className={`w-7 h-7 rounded-full ${it.color} flex items-center justify-center`}>
              <it.Ic className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-[11px] font-semibold">{it.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-2/5 bg-gradient-to-br from-cyan-400 to-blue-500" />
      <div className="px-4 py-4 text-center">
        <p className="text-[11px] font-bold text-ink-900 mb-1">The Lake Cruisers</p>
        <p className="text-xs text-ink-600 mb-3">How was your rental experience?</p>
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="w-5 h-5 text-ink-300" />
          ))}
        </div>
        <div className="bg-orange-500 text-white py-2 rounded text-xs font-bold">SEND RATING</div>
      </div>
    </div>
  );
}

function FeedbackMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-[#E5A82A] px-4 py-3 text-white">
        <p className="text-sm font-bold">HOTEL PARADISO</p>
      </div>
      <div className="px-4 py-3">
        <p className="text-[11px] font-bold text-ink-900 mb-1">Give us your feedback</p>
        <p className="text-[10px] text-ink-500 mb-3">Please select to review a category.</p>
        <div className="space-y-1.5">
          {["Restaurant", "Bar", "Room", "Wellness & Spa"].map((c) => (
            <div key={c} className="flex items-center justify-between px-3 py-2 border border-ink-100 rounded text-[10px] font-semibold">
              {c}
              <span>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CouponMock() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-[#E11D67] flex-1 flex flex-col items-center justify-center text-white p-4">
        <p className="text-[9px] font-bold uppercase tracking-wider mb-1">Elle Boutique</p>
        <p className="text-xl font-black mb-1">Big Holiday Sale</p>
        <span className="px-3 py-1 bg-white/20 text-xs font-bold rounded">25% OFF</span>
      </div>
      <div className="bg-white px-4 py-3 text-center">
        <p className="text-[10px] text-ink-600 mb-2">Discounted items on all designer clothing.</p>
        <div className="bg-[#E11D67] text-white py-2 rounded text-xs font-bold">GET COUPON</div>
      </div>
    </div>
  );
}

function GalleryMock() {
  return (
    <div className="w-full h-full flex flex-col bg-[#3c4245] text-white">
      <div className="px-4 py-3">
        <p className="text-sm font-bold">Winter 2017 Lookbook</p>
        <p className="text-[10px] opacity-70 mt-0.5">New collection arrived just in time.</p>
        <button className="mt-2 bg-white text-ink-900 text-[10px] font-bold px-3 py-1 rounded">SHOP NOW</button>
      </div>
      <div className="grid grid-cols-2 gap-1 px-2 pb-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-ink-300 to-ink-500 rounded" />
        ))}
      </div>
    </div>
  );
}

function Mp3Mock() {
  return (
    <div className="w-full h-full flex flex-col bg-[#3D2A4D] text-white p-4">
      <div className="aspect-square bg-gradient-to-br from-rose-400 to-orange-500 rounded-xl mb-3 flex items-center justify-center text-4xl font-black">
        ♪
      </div>
      <p className="text-[10px] uppercase tracking-wider opacity-70">The Reluctant</p>
      <p className="text-base font-bold mb-3">Stars</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
          <Play className="w-3.5 h-3.5 fill-white" />
        </div>
        <div className="flex-1 h-1 bg-white/15 rounded-full">
          <div className="h-full w-1/4 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}

function VideoMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-[#3F8FD3] px-4 py-3 text-white">
        <p className="text-sm font-bold">Ultimate X-100 Juicer</p>
        <p className="text-[10px] opacity-90 mt-0.5">Siekens & Co.</p>
        <button className="mt-2 bg-white text-[#3F8FD3] text-[10px] font-bold px-3 py-1 rounded">BUY NOW</button>
      </div>
      <div className="aspect-video bg-gradient-to-br from-orange-300 to-red-500 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white" />
        </div>
      </div>
    </div>
  );
}

function EventMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-600" />
      <div className="bg-[#3F8FD3] px-4 py-3 text-white">
        <p className="text-sm font-bold">Online B2B Conference</p>
        <p className="text-[10px] opacity-90 mt-0.5">Insights from world-renowned leaders</p>
        <button className="mt-2 bg-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded">GET TICKETS</button>
      </div>
      <div className="px-4 py-3 flex gap-2 text-[10px]">
        <Calendar className="w-3.5 h-3.5 text-ink-400" />
        <div>
          <p className="font-bold">Tue, 27 Jun</p>
          <p className="text-ink-400">11:00 am</p>
        </div>
      </div>
    </div>
  );
}

function FacebookMock() {
  return (
    <div className="w-full h-full flex flex-col bg-[#1877F2] text-white px-4 py-6 items-center justify-center">
      <ThumbsUp className="w-12 h-12 fill-white mb-3" />
      <p className="text-center text-xs font-semibold mb-3">
        Click on the Like Button to follow us on Facebook.
      </p>
      <div className="bg-white text-[#1877F2] px-4 py-2 rounded text-xs font-bold">LIKE 2K</div>
    </div>
  );
}

function InstagramMock() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-2/3 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <Camera className="w-12 h-12 text-white" />
      </div>
      <div className="px-4 py-3 text-center">
        <p className="text-sm font-bold">@betty-baker</p>
        <p className="text-[10px] text-ink-500 mt-0.5">Opening Instagram…</p>
      </div>
    </div>
  );
}

function AppMock() {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-orange-300 to-red-500 px-4 py-6 items-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-purple-700 mb-3 flex items-center justify-center text-2xl font-black">P</div>
      <p className="text-[10px] uppercase opacity-80">PIC INFINYG</p>
      <p className="text-sm font-bold mb-3">Picture editing like a pro</p>
      <div className="space-y-2 w-full">
        <div className="bg-black/80 rounded-md py-1.5 text-center text-[9px] font-bold">App Store</div>
        <div className="bg-black/80 rounded-md py-1.5 text-center text-[9px] font-bold">Google Play</div>
      </div>
    </div>
  );
}

function GenericMock({ tab }) {
  const Icon = tab?.icon || Globe;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-ink-500 bg-ink-50">
      <Icon className="w-12 h-12 mb-3 text-ink-300" />
      <p className="text-sm font-bold text-ink-700 mb-1">{tab?.label}</p>
      <p className="text-[10px] leading-relaxed">{tab?.description}</p>
    </div>
  );
}

const TYPE_MOCKS = {
  vcard: VcardMock,
  mecard: VcardMock,
  pdf: PdfMock,
  business: BusinessMock,
  social: SocialMock,
  rating: RatingMock,
  feedback: FeedbackMock,
  coupon: CouponMock,
  gallery: GalleryMock,
  images: GalleryMock,
  mp3: Mp3Mock,
  audio: Mp3Mock,
  video: VideoMock,
  event: EventMock,
  facebook: FacebookMock,
  instagram: InstagramMock,
  appstore: AppMock,
  app: AppMock,
};

export default function TypePickerPreview({ tab }) {
  const Mock = tab ? TYPE_MOCKS[tab.id] : null;

  return (
    <div className="sticky top-24 flex flex-col items-center justify-center min-h-[560px]">
      <AnimatePresence mode="wait">
        {Mock ? (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center"
          >
            <PhoneFrame>
              <Mock />
            </PhoneFrame>
            <div className="mt-4 text-center">
              <p className="text-sm font-bold text-gray-900">{tab.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tab.description}</p>
            </div>
          </motion.div>
        ) : tab ? (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <PhoneFrame>
              <GenericMock tab={tab} />
            </PhoneFrame>
            <div className="mt-4 text-center">
              <p className="text-sm font-bold text-gray-900">{tab.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tab.description}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center text-gray-400"
          >
            <div className="relative mb-4">
              <Smartphone className="w-32 h-32 text-gray-200" strokeWidth={1.2} />
              <MousePointer2 className="absolute -bottom-2 right-0 w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              Hover a type to view a page preview
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
