"use client";

import { Download, Phone, MapPin, Mail, Globe, MessageCircle, Instagram, Linkedin, Twitter, Facebook, Youtube } from "lucide-react";

// Helper to escape vCard values
const escVCard = (v) =>
  String(v ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

function generatePersonalVCard(s) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${escVCard(s.mcName)};;;`,
    `FN:${escVCard(s.mcName)}`,
  ];
  
  if (s.mcPhone) lines.push(`TEL;TYPE=CELL:${escVCard(s.mcPhone)}`);
  if (s.mcEmail) lines.push(`EMAIL:${escVCard(s.mcEmail)}`);
  
  if (s.mcAddress || s.mcCity) {
    lines.push(`ADR;TYPE=HOME:;;${escVCard(s.mcAddress || "")};${escVCard(s.mcCity || "")};;;`);
  }
  
  if (s.mcUrl) lines.push(`URL:${escVCard(s.mcUrl)}`);
  if (s.mcBio) lines.push(`NOTE:${escVCard(s.mcBio)}`);
  
  if (s.mcLinkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escVCard(s.mcLinkedin)}`);
  if (s.mcInstagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${escVCard(s.mcInstagram)}`);
  if (s.mcTwitter) lines.push(`X-SOCIALPROFILE;TYPE=twitter:${escVCard(s.mcTwitter)}`);
  if (s.mcFacebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${escVCard(s.mcFacebook)}`);
  if (s.mcYoutube) lines.push(`X-SOCIALPROFILE;TYPE=youtube:${escVCard(s.mcYoutube)}`);
  
  lines.push("END:VCARD");
  return lines.join("\n");
}

export default function MecardPage({ page }) {
  const config = page.config || {};
  
  // Generate download URL
  const vcardString = generatePersonalVCard(config);
  const downloadUrl = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardString);
  const downloadName = (config.mcName || "contact").replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".vcf";

  // Action URLs
  const phoneUrl = config.mcPhone ? `tel:${config.mcPhone}` : null;
  const emailUrl = config.mcEmail ? `mailto:${config.mcEmail}` : null;
  const websiteUrl = config.mcUrl ? (config.mcUrl.startsWith('http') ? config.mcUrl : `https://${config.mcUrl}`) : null;
  
  const addressQuery = [config.mcAddress, config.mcCity].filter(Boolean).join(" ");
  const mapUrl = addressQuery ? `https://maps.google.com/?q=${encodeURIComponent(addressQuery)}` : null;

  const socialLinks = [
    { icon: Instagram, url: config.mcInstagram, label: "Instagram", color: "text-pink-400", bg: "bg-pink-500/10" },
    { icon: Twitter, url: config.mcTwitter, label: "Twitter", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Linkedin, url: config.mcLinkedin, label: "LinkedIn", color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: Facebook, url: config.mcFacebook, label: "Facebook", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Youtube, url: config.mcYoutube, label: "YouTube", color: "text-red-400", bg: "bg-red-500/10" }
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-[#101415] text-white selection:bg-purple-500/30 font-sans pb-24 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none" />

      <main className="relative z-10 max-w-md mx-auto px-6 pt-16 flex flex-col items-center">
        
        {/* Profile Avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-20"></div>
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center border-4 border-[#101415] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] text-5xl font-bold text-white">
            {(config.mcName || "M").charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="text-center mb-10 w-full">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {config.mcName || "Your Name"}
          </h1>
          {config.mcBio && (
            <p className="text-gray-300 text-[15px] leading-relaxed mx-auto max-w-[90%] mt-3 opacity-90">
              {config.mcBio}
            </p>
          )}
        </div>

        {/* Contact Action Pills (Row layout for personal cards) */}
        <div className="w-full grid grid-cols-2 gap-3 mb-10">
          {phoneUrl && (
            <a 
              href={phoneUrl} 
              className="group relative flex flex-col items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors mb-2">
                <Phone className="w-4 h-4" />
              </div>
              <p className="text-white font-semibold text-sm">Call Me</p>
            </a>
          )}
          
          {emailUrl && (
            <a 
              href={emailUrl} 
              className="group relative flex flex-col items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors mb-2">
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-white font-semibold text-sm">Email</p>
            </a>
          )}
          
          {mapUrl && (
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex flex-col items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-white font-semibold text-sm">Location</p>
            </a>
          )}

          {websiteUrl && (
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex flex-col items-center p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors mb-2">
                <Globe className="w-4 h-4" />
              </div>
              <p className="text-white font-semibold text-sm">Website</p>
            </a>
          )}
        </div>

        {/* Social Media Links */}
        {socialLinks.length > 0 && (
          <div className="w-full">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Connect with me</p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {socialLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <a
                    key={idx}
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:scale-110 transition-all duration-300"
                    title={link.label}
                  >
                    <Icon className={`w-5 h-5 ${link.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  </a>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Sticky Save Contact Button */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#101415] via-[#101415]/90 to-transparent z-50">
        <a 
          href={downloadUrl}
          download={downloadName}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-[15px] shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Download className="w-5 h-5 relative z-10" />
          <span className="relative z-10 tracking-wide">Save to Contacts</span>
        </a>
      </div>
    </div>
  );
}
