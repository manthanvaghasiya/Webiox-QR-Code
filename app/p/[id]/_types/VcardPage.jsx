"use client";

import { useState } from "react";
import {
  Download, Phone, MapPin, Mail, Globe, MessageCircle,
  Camera as Instagram, Briefcase as Linkedin, MessageCircle as Twitter,
  Users as Facebook, Video as Youtube,
} from "lucide-react";
import WelcomeScreen from "../_components/WelcomeScreen";

const escVCard = (v) =>
  String(v ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

function generateVCardString(s) {
  const displayName = s.vcCompany
    ? s.vcCompany
    : `${s.vcFirstName || ""} ${s.vcLastName || ""}`.trim();

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escVCard(s.vcLastName)};${escVCard(s.vcFirstName)};;;`,
    `FN:${escVCard(displayName)}`,
  ];
  if (s.vcPhone) lines.push(`TEL;TYPE=CELL:${escVCard(s.vcPhone)}`);
  if (s.vcWorkPhone) lines.push(`TEL;TYPE=WORK:${escVCard(s.vcWorkPhone)}`);
  if (s.vcEmail) lines.push(`EMAIL:${escVCard(s.vcEmail)}`);
  if (s.vcCompany) lines.push(`ORG:${escVCard(s.vcCompany)}`);
  if (s.vcTitle) lines.push(`TITLE:${escVCard(s.vcTitle)}`);

  const hasStructuredAddr = s.vcStreet || s.vcCity || s.vcState || s.vcZip || s.vcCountry;
  if (hasStructuredAddr) {
    lines.push(`ADR;TYPE=WORK:;;${escVCard(s.vcStreet || "")};${escVCard(s.vcCity || "")};${escVCard(s.vcState || "")};${escVCard(s.vcZip || "")};${escVCard(s.vcCountry || "")}`);
  }
  if (s.vcWebsite) lines.push(`URL:${escVCard(s.vcWebsite)}`);
  if (s.vcSummary) lines.push(`NOTE:${escVCard(s.vcSummary)}`);
  if (s.vcLinkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escVCard(s.vcLinkedin)}`);
  if (s.vcInstagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${escVCard(s.vcInstagram)}`);
  if (s.vcTwitter) lines.push(`X-SOCIALPROFILE;TYPE=twitter:${escVCard(s.vcTwitter)}`);
  if (s.vcFacebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${escVCard(s.vcFacebook)}`);
  if (s.vcYoutube) lines.push(`X-SOCIALPROFILE;TYPE=youtube:${escVCard(s.vcYoutube)}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export default function VcardPage({ page }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const config = page.config || {};
  
  // Generate download URL
  const vcardString = generateVCardString(config);
  const downloadUrl = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardString);
  const downloadName = (config.vcCompany || config.vcFirstName || "contact").replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".vcf";

  // Action URLs
  const whatsappNumber = config.vcPhone ? config.vcPhone.replace(/\D/g, '') : null;
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const phoneUrl = config.vcPhone ? `tel:${config.vcPhone}` : null;
  const emailUrl = config.vcEmail ? `mailto:${config.vcEmail}` : null;
  const websiteUrl = config.vcWebsite ? (config.vcWebsite.startsWith('http') ? config.vcWebsite : `https://${config.vcWebsite}`) : null;
  
  const addressQuery = [config.vcStreet, config.vcCity, config.vcState, config.vcCountry].filter(Boolean).join(" ");
  const mapUrl = addressQuery ? `https://maps.google.com/?q=${encodeURIComponent(addressQuery)}` : null;

  if (showWelcome && config.welcomeScreenEnabled) {
    return <WelcomeScreen config={config} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#101415] text-white selection:bg-emerald-500/30 font-sans pb-24 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <main className="relative z-10 max-w-md mx-auto px-6 pt-16 flex flex-col items-center">
        
        {/* Profile Avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20"></div>
          {config.vcImage ? (
            <img 
              src={config.vcImage} 
              alt={config.vcCompany || config.vcFirstName} 
              className="relative w-28 h-28 rounded-full object-cover border-4 border-[#101415] shadow-[0_0_0_2px_rgba(255,255,255,0.1)]"
            />
          ) : (
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center border-4 border-[#101415] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] text-4xl font-bold text-white">
              {(config.vcCompany || config.vcFirstName || "B").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Identity & Bio */}
        <div className="text-center mb-10 w-full">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {config.vcCompany || `${config.vcFirstName} ${config.vcLastName}`.trim()}
          </h1>
          {config.vcTitle && (
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-[0.1em] mb-4">
              {config.vcTitle}
            </p>
          )}
          {config.vcSummary && (
            <p className="text-gray-400 text-[15px] leading-relaxed mx-auto max-w-[90%]">
              {config.vcSummary}
            </p>
          )}
          {/* Owner details if company is primary and no summary is provided */}
          {!config.vcSummary && config.vcCompany && (config.vcFirstName || config.vcLastName) && (
             <p className="text-gray-400 text-[15px]">
               {config.vcFirstName} {config.vcLastName}
             </p>
          )}
        </div>

        {/* Link Tree Stack */}
        <div className="w-full flex flex-col gap-4 mb-12">
          {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-2xl transition-colors"></div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-white font-semibold text-base">WhatsApp Me</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">Direct message for inquiries</p>
              </div>
            </a>
          )}

          {phoneUrl && (
            <a 
              href={phoneUrl} 
              className="group relative flex items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-2xl transition-colors"></div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-white font-semibold text-base">Call Us</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{config.vcPhone}</p>
              </div>
            </a>
          )}

          {emailUrl && (
            <a 
              href={emailUrl} 
              className="group relative flex items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 rounded-2xl transition-colors"></div>
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <p className="text-white font-semibold text-base">Email</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{config.vcEmail}</p>
              </div>
            </a>
          )}

          {websiteUrl && (
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 rounded-2xl transition-colors"></div>
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <p className="text-white font-semibold text-base">Website</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{config.vcWebsite.replace(/^https?:\/\//i, '')}</p>
              </div>
            </a>
          )}

          {mapUrl && (
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 rounded-2xl transition-colors"></div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <p className="text-white font-semibold text-base">Location</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{addressQuery}</p>
              </div>
            </a>
          )}
        </div>

        {/* Social Icons Row */}
        {(config.vcLinkedin || config.vcInstagram || config.vcTwitter || config.vcFacebook || config.vcYoutube) && (
          <div className="flex items-center justify-center gap-4 w-full px-2 mb-8 flex-wrap">
            {config.vcInstagram && (
              <a href={config.vcInstagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-pink-600 hover:border-pink-500 hover:scale-110 transition-all shadow-lg hover:shadow-pink-500/20">
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {config.vcFacebook && (
              <a href={config.vcFacebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:scale-110 transition-all shadow-lg hover:shadow-blue-500/20">
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {config.vcTwitter && (
              <a href={config.vcTwitter} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-700 hover:scale-110 transition-all shadow-lg hover:shadow-gray-800/50">
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {config.vcLinkedin && (
              <a href={config.vcLinkedin} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-700 hover:border-blue-600 hover:scale-110 transition-all shadow-lg hover:shadow-blue-700/20">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {config.vcYoutube && (
              <a href={config.vcYoutube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-600 hover:border-red-500 hover:scale-110 transition-all shadow-lg hover:shadow-red-600/20">
                <Youtube className="w-6 h-6" />
              </a>
            )}
          </div>
        )}
      </main>

      {/* Floating Save Button Footer */}
      <div className="fixed bottom-0 inset-x-0 p-4 z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          {/* Blur backdrop specifically for the button area */}
          <div className="absolute inset-0 bg-[#101415]/80 backdrop-blur-2xl -top-8 -bottom-8 [mask-image:linear-gradient(to_top,black_60%,transparent)] -z-10"></div>
          
          <a 
            href={downloadUrl} 
            download={downloadName}
            className="w-full group relative flex items-center justify-center h-16 rounded-full overflow-hidden transition-all hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-black/10"></div> {/* Subtle inner shadow effect */}
            
            <div className="relative flex items-center justify-center gap-3 text-white font-bold tracking-wide text-[15px]">
              <div className="bg-white/20 p-2 rounded-full">
                <Download className="w-4 h-4" />
              </div>
              SAVE CONTACT
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
