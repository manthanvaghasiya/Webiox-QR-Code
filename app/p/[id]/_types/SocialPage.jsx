"use client";

import { useState } from 'react';
import {
  Globe, Mail, Music, Video, Send, MessageCircle,
  Code2, Users, Briefcase, ExternalLink, Camera, Phone, Hash,
} from 'lucide-react';
import WelcomeScreen from "../_components/WelcomeScreen";

const PLATFORM_CONFIG = {
  Instagram: { icon: Camera,        gradient: 'from-purple-500 via-pink-500 to-orange-400' },
  Twitter:   { icon: MessageCircle, gradient: 'from-sky-400 to-blue-500' },
  LinkedIn:  { icon: Briefcase,     gradient: 'from-blue-600 to-blue-800' },
  Facebook:  { icon: Users,         gradient: 'from-blue-500 to-blue-700' },
  YouTube:   { icon: Video,         gradient: 'from-red-500 to-red-700' },
  TikTok:    { icon: Music,         gradient: 'from-gray-700 to-black' },
  GitHub:    { icon: Code2,         gradient: 'from-gray-600 to-gray-900' },
  Website:   { icon: Globe,         gradient: 'from-emerald-500 to-teal-600' },
  Email:     { icon: Mail,          gradient: 'from-orange-400 to-red-500' },
  WhatsApp:  { icon: Phone,         gradient: 'from-green-400 to-green-600' },
  Telegram:  { icon: Send,          gradient: 'from-sky-400 to-cyan-600' },
  Discord:   { icon: Hash,          gradient: 'from-indigo-500 to-purple-700' },
};

export default function SocialPage({ page }) {
  const config = page.config ?? {};
  const { pageTitle, pageDescription, links = [] } = config;
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome && config.welcomeScreenEnabled) {
    return <WelcomeScreen config={config} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center py-16 px-4 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-25" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-25" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto">
        {/* Avatar + Title */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl ring-4 ring-white/10 mb-4 select-none">
            {pageTitle?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{pageTitle}</h1>
          {pageDescription && (
            <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">{pageDescription}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link, i) => {
            const cfg = PLATFORM_CONFIG[link.platform] ?? { icon: ExternalLink, gradient: 'from-gray-500 to-gray-700' };
            const Icon = cfg.icon;
            const href =
              link.platform === 'Email' && !link.url.startsWith('mailto:')
                ? `mailto:${link.url}`
                : link.url;
            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white font-semibold hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-md flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </span>
                <span className="flex-1 text-left text-[15px]">{link.label || link.platform}</span>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
              </a>
            );
          })}
        </div>

        {/* Watermark */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
            Powered by <span className="text-gray-400 font-semibold ml-1">Webiox QR Studio</span>
          </span>
        </div>
      </div>
    </div>
  );
}
