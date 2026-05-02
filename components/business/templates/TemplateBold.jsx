"use client";

import { StarRating, SocialIcon, isOpenNow, ProfilePoweredBy } from "./shared";

export default function TemplateBold({ profile }) {
  const p = profile;
  const primary = p.theme?.primaryColor || "#EF4444";
  const openStatus = isOpenNow(p.businessHours);
  const whatsappUrl = p.contact?.whatsapp
    ? `https://wa.me/${p.contact.whatsapp.replace(/\D/g, "")}`
    : null;
  const mapsUrl = p.address?.city
    ? `https://www.google.com/maps/search/${encodeURIComponent(
        [p.businessName, p.address.city, p.address.state].filter(Boolean).join(", ")
      )}`
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-[Inter,system-ui,sans-serif]">
      {/* Full bleed hero */}
      <div className="relative min-h-[60vh] flex flex-col justify-end">
        {p.coverImageUrl ? (
          <img src={p.coverImageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}, #1a1a2e)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto w-full px-5 pb-8">
          {p.logoUrl && (
            <img src={p.logoUrl} alt={p.businessName} className="w-20 h-20 rounded-2xl object-cover mb-5 border-2 border-white/20" />
          )}
          {openStatus !== null && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${openStatus ? "bg-green-400/20 text-green-300 border border-green-400/30" : "bg-red-400/20 text-red-300 border border-red-400/30"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${openStatus ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
              {openStatus ? "Open Now" : "Closed"}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">{p.businessName}</h1>
          {p.tagline && <p className="text-white/70 text-lg">{p.tagline}</p>}

          {/* CTA bar */}
          <div className="flex flex-wrap gap-3 mt-6">
            {p.contact?.phone && (
              <a href={`tel:${p.contact.phone}`} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm">
                📞 Call Now
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-500 transition-colors">
                💬 WhatsApp
              </a>
            )}
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm">
                📍 Directions
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {/* About */}
        {p.about && (
          <Section title="About">
            <p className="text-gray-300 leading-relaxed">{p.about}</p>
          </Section>
        )}

        {/* Services */}
        {p.services?.length > 0 && (
          <Section title="What We Offer">
            <div className="space-y-3">
              {p.services.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: primary }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">{s.title}</p>
                    {s.description && <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>}
                  </div>
                  {s.price && (
                    <p className="font-black text-sm flex-shrink-0" style={{ color: primary }}>
                      {s.currency === "INR" ? "₹" : s.currency}{s.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Gallery */}
        {p.gallery?.length > 0 && (
          <Section title="Gallery">
            <div className="grid grid-cols-3 gap-2">
              {p.gallery.map((img, i) => (
                <img key={i} src={img.imageUrl} alt={img.caption || `Photo ${i+1}`} className="aspect-square object-cover rounded-xl" />
              ))}
            </div>
          </Section>
        )}

        {/* Reviews */}
        {p.reviews?.length > 0 && (
          <Section title="Reviews">
            <div className="space-y-4">
              {p.reviews.map((rev, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm text-white">{rev.authorName}</span>
                    <StarRating rating={rev.rating} />
                  </div>
                  <p className="text-gray-400 text-sm">{rev.text}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Social */}
        {p.socialLinks?.length > 0 && (
          <Section title="Follow Us">
            <div className="flex flex-wrap gap-2">
              {p.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 text-sm font-semibold hover:border-gray-500 transition-colors">
                  <SocialIcon platform={link.platform} />{link.label}
                </a>
              ))}
            </div>
          </Section>
        )}

        <div className="border-t border-gray-800 pt-6 text-center">
          <a href="https://webiox.in/business-profile" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Powered by <strong>Webiox</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">{title}</h2>
      {children}
    </div>
  );
}
