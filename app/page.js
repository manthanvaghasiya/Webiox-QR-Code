"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Palette, Layers, ImagePlus, Maximize, ShieldCheck, UserX,
  ArrowRight, QrCode, MousePointerClick, Wand2, Download, Star, Zap,
} from "lucide-react";

const FEATURES = [
  { icon: Sparkles,    title: "Free Forever",        desc: "Every feature, every type, every export. No paywall hiding the basics." },
  { icon: Palette,     title: "Logos & Colors",      desc: "Solid, gradient, or per-element colors plus your logo right in the middle." },
  { icon: Layers,      title: "22+ QR Types",        desc: "URL, vCard, WiFi, payments, events, file uploads, hosted social pages, more." },
  { icon: Maximize,    title: "High Resolution",     desc: "Export up to 2000×2000 px — print-ready PNG, SVG, and WebP." },
  { icon: ShieldCheck, title: "No Watermark",        desc: "Your design, your QR. Nothing of ours appears on it. Use it commercially." },
  { icon: UserX,       title: "No Sign-up Required", desc: "Open the generator and ship. No accounts, no email, no friction." },
];

const STEPS = [
  { icon: MousePointerClick, title: "Pick your type",    desc: "Start with URL, WiFi, vCard, or any of 22+ supported content types." },
  { icon: Wand2,             title: "Style it",          desc: "Add a logo, pick colors or a gradient, choose dot patterns and eye shapes." },
  { icon: Download,          title: "Download & share",  desc: "Export PNG, SVG, or WebP at print quality. Drop it into anything." },
];

const TESTIMONIALS = [
  { name: "Priya R.",   role: "Café owner",     quote: "Used it for our menu QR and the design options blew my mind. Free, no ads — felt suspicious until I downloaded the file." },
  { name: "Marco D.",   role: "Freelance dev",  quote: "I've been pasting curl into qr-code generators for years. This one finally makes pretty ones I can hand to clients." },
  { name: "Aanya S.",   role: "Wedding planner", quote: "Made vCards for the entire vendor list in an evening. The contact-card output is exactly what guests need." },
];

function MockQR({ palette }) {
  const cells = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      const idx = y * 9 + x;
      const fill = corner ? false : ((idx * palette.seed) % 7) > 3;
      if (corner || fill) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x * 10 + 2}
            y={y * 10 + 2}
            width={8}
            height={8}
            rx={palette.rounded ? 3 : 0.5}
            fill={`url(#${palette.id}-grad)`}
          />,
        );
      }
    }
  }
  return (
    <div
      className="w-full aspect-square rounded-2xl flex items-center justify-center p-6 shadow-md border border-white/30"
      style={{ background: palette.bg }}
    >
      <svg viewBox="0 0 94 94" className="w-full h-full">
        <defs>
          <linearGradient id={`${palette.id}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.c1} />
            <stop offset="100%" stopColor={palette.c2} />
          </linearGradient>
        </defs>
        {[[2, 2], [62, 2], [2, 62]].map(([ex, ey]) => (
          <g key={`${ex}-${ey}`}>
            <rect x={ex} y={ey} width={30} height={30} rx={palette.rounded ? 8 : 2} fill="none" stroke={`url(#${palette.id}-grad)`} strokeWidth={4} />
            <rect x={ex + 10} y={ey + 10} width={10} height={10} rx={palette.rounded ? 5 : 1} fill={`url(#${palette.id}-grad)`} />
          </g>
        ))}
        {cells}
      </svg>
    </div>
  );
}

const SAMPLES = [
  { id: "indigo",  bg: "#ffffff", c1: "#2563eb", c2: "#7c3aed", rounded: true,  seed: 7,  label: "Gradient" },
  { id: "rose",    bg: "#fff7ed", c1: "#e11d48", c2: "#f97316", rounded: false, seed: 11, label: "Brand" },
  { id: "emerald", bg: "#ecfdf5", c1: "#059669", c2: "#0ea5e9", rounded: true,  seed: 13, label: "Soft" },
];

export default function Home() {
  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col w-full">
      {/* ── Hero ── */}
      <section className="relative px-4 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm text-xs font-bold text-blue-700 uppercase tracking-wider mb-6"
            >
              <Zap className="w-3.5 h-3.5" /> 100% Free · No Signup
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.05]"
            >
              The 100% Free{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Premium
              </span>{" "}
              QR Code Generator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 font-medium mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Custom colors, logos, and 22+ content types. Generated in your
              browser, exported in print-ready quality. Pick the mode that fits.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/generator?mode=basic"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-blue-600/25 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Try Simple Generator
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/generator?mode=pro"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 text-gray-800 font-bold shadow-md hover:bg-white transition-all"
              >
                Try Pro Generator
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  New
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Hero showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
            <div className="relative grid grid-cols-3 gap-4">
              {SAMPLES.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className={i === 1 ? "translate-y-6" : ""}
                >
                  <MockQR palette={s} />
                  <p className="text-center text-xs font-semibold text-gray-600 mt-2 uppercase tracking-wider">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Everything you need.{" "}
            <span className="text-gray-400 font-medium">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Built for creators, marketers, and developers who want a tool that
            just works — without the upsell.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 sm:px-8 pb-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/40 text-xs font-bold text-blue-700 uppercase tracking-wider mb-4">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Three steps. About ten seconds.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-7 text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                {i + 1}
              </div>
              <div className="w-14 h-14 mx-auto mt-3 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            What people are saying
          </h2>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            From café owners to freelance devs — everyone&apos;s tired of paywalls.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-4 sm:px-8 pb-24 max-w-5xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-10 md:p-16 text-center overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <QrCode className="w-12 h-12 text-white/80 mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to build your first QR?
            </h2>
            <p className="text-blue-100 text-lg font-medium mb-8 max-w-xl mx-auto">
              Free, no account required. Takes about ten seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/generator?mode=basic"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-blue-700 font-bold shadow-xl hover:bg-blue-50 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Open Simple
              </Link>
              <Link
                href="/generator?mode=pro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-bold transition-colors"
              >
                Open Pro
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
