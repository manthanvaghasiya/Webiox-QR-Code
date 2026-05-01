"use client";

import { Calendar, Clock, MapPin, Share2, Plus } from "lucide-react";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function buildIcs({ title, description, location, start, end }) {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title || "Event"}`,
    description ? `DESCRIPTION:${description.replace(/\n/g, "\\n")}` : "",
    location ? `LOCATION:${location}` : "",
    start ? `DTSTART:${fmt(start)}` : "",
    end ? `DTEND:${fmt(end)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\n"));
}

export default function EventPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#3F8FD3";
  const accent = theme.accentColor || "#F09A23";
  const {
    title, description, coverImage, start, end,
    location, ctaLabel, ctaUrl,
  } = cfg;

  return (
    <div className="min-h-screen bg-ink-50 pb-12">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero */}
          <div className="relative">
            {coverImage ? (
              <img src={coverImage} alt={title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48" style={{ background: primary }} />
            )}
            <button aria-label="Share" className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5" style={{ background: primary, color: "#fff" }}>
            <h1 className="text-xl font-bold">{title || "Untitled Event"}</h1>
            {description && (
              <p className="text-sm opacity-90 leading-relaxed mt-2">{description}</p>
            )}
            {ctaUrl && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4 items-center justify-center px-5 h-10 rounded-md font-bold text-sm text-white"
                style={{ background: accent }}
              >
                {ctaLabel || "Get Tickets"}
              </a>
            )}
          </div>

          {/* Details */}
          <div className="divide-y divide-ink-100">
            {start && (
              <div className="flex items-start gap-3 px-5 py-4">
                <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primary }} />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider font-bold text-ink-400">When</p>
                  <p className="text-sm font-semibold text-ink-900">{fmtDate(start)}</p>
                  <p className="text-xs text-ink-500">
                    <Clock className="inline w-3 h-3 mr-1" />
                    {fmtTime(start)} {end ? `– ${fmtTime(end)}` : ""}
                  </p>
                </div>
              </div>
            )}
            {location && (
              <div className="flex items-start gap-3 px-5 py-4">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primary }} />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider font-bold text-ink-400">Where</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-ink-900 hover:underline"
                  >
                    {location}
                  </a>
                </div>
              </div>
            )}
          </div>

          {start && (
            <a
              href={buildIcs({ title, description, location, start, end })}
              download="event.ics"
              className="flex items-center justify-center gap-2 py-4 text-sm font-bold border-t border-ink-100 hover:bg-ink-50 transition-colors"
              style={{ color: primary }}
            >
              <Plus className="w-4 h-4" />
              Add to Calendar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
