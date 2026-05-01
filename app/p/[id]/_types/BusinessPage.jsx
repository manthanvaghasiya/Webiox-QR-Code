"use client";

import { Phone, Mail, MapPin, Clock, Globe, Share2 } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isOpenNow(hours) {
  if (!hours) return false;
  const now = new Date();
  const dayKey = DAYS[(now.getDay() + 6) % 7];
  const today = hours[dayKey];
  if (!today?.open || !today?.close) return false;
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = today.open.split(":").map(Number);
  const [ch, cm] = today.close.split(":").map(Number);
  return cur >= oh * 60 + om && cur <= ch * 60 + cm;
}

export default function BusinessPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#3F8FD3";
  const {
    name, tagline, description, coverImage, ctaLabel, ctaUrl,
    phone, email, address, website, hours,
  } = cfg;
  const open = isOpenNow(hours);

  return (
    <div className="min-h-screen bg-ink-50 pb-12">
      {/* Cover */}
      <div className="relative h-56 bg-ink-200">
        {coverImage ? (
          <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: primary }} />
        )}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-md mx-auto -mt-10 px-4">
        {/* Hero card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-5" style={{ background: primary, color: "#fff" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{name}</p>
            <h1 className="text-2xl font-bold mb-1">{tagline || name || "Welcome"}</h1>
            {description && <p className="text-sm opacity-90 leading-relaxed">{description}</p>}
            {ctaUrl && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4 items-center justify-center px-5 h-10 rounded-md bg-white font-bold text-sm"
                style={{ color: primary }}
              >
                {ctaLabel || "Learn more"}
              </a>
            )}
          </div>
        </div>

        {/* Hours */}
        {hours && (
          <div className="bg-white rounded-2xl mt-3 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-ink-400" />
              <span className="text-sm font-bold text-ink-900">Opening Hours</span>
              <span className={`ml-auto text-xs font-bold ${open ? "text-emerald-600" : "text-red-500"}`}>
                {open ? "Open Now" : "Closed"}
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              {DAYS.map((d) => (
                <div key={d} className="flex items-center justify-between text-ink-600">
                  <span className="font-semibold w-12">{d}</span>
                  <span className="font-mono text-ink-500">
                    {hours[d]?.open && hours[d]?.close
                      ? `${hours[d].open} – ${hours[d].close}`
                      : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="bg-white rounded-2xl mt-3 divide-y divide-ink-100 shadow-sm overflow-hidden">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-3 px-5 py-4 hover:bg-ink-50">
              <Phone className="w-5 h-5" style={{ color: primary }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Phone</p>
                <p className="text-sm font-semibold text-ink-900">{phone}</p>
              </div>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-3 px-5 py-4 hover:bg-ink-50">
              <Mail className="w-5 h-5" style={{ color: primary }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Email</p>
                <p className="text-sm font-semibold text-ink-900 break-all">{email}</p>
              </div>
            </a>
          )}
          {address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 hover:bg-ink-50"
            >
              <MapPin className="w-5 h-5" style={{ color: primary }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Address</p>
                <p className="text-sm font-semibold text-ink-900">{address}</p>
              </div>
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-4 hover:bg-ink-50">
              <Globe className="w-5 h-5" style={{ color: primary }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400">Website</p>
                <p className="text-sm font-semibold text-ink-900 break-all">{website.replace(/^https?:\/\//, "")}</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
