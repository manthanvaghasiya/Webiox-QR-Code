"use client";

import { StarRating, SocialIcon, isOpenNow, ProfilePoweredBy } from "./shared";

export default function TemplateElegant({ profile }) {
  const p = profile;
  const primary = p.theme?.primaryColor || "#D97706";
  const openStatus = isOpenNow(p.businessHours);
  const whatsappUrl = p.contact?.whatsapp ? `https://wa.me/${p.contact.whatsapp.replace(/\D/g,"")}` : null;
  const mapsUrl = p.address?.city ? `https://www.google.com/maps/search/${encodeURIComponent([p.businessName, p.address.city].filter(Boolean).join(", "))}` : null;

  return (
    <div className="min-h-screen font-[Georgia,serif]" style={{ background: "#FDFAF5" }}>
      {/* Decorative top bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${primary}, transparent)` }} />

      {/* Hero */}
      <div className="relative">
        {p.coverImageUrl ? (
          <div className="h-56">
            <img src={p.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #FDFAF5)" }} />
          </div>
        ) : (
          <div className="h-24" style={{ background: `linear-gradient(135deg, ${primary}10, ${primary}20)` }} />
        )}
      </div>

      <div className="max-w-xl mx-auto px-5">
        {/* Identity */}
        <div className="text-center py-8">
          {p.logoUrl && (
            <img src={p.logoUrl} alt={p.businessName} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4" style={{ borderColor: `${primary}30` }} />
          )}
          {openStatus !== null && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold tracking-wide mb-3 ${openStatus ? "text-green-600" : "text-red-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${openStatus ? "bg-green-500" : "bg-red-400"}`} />
              {openStatus ? "Open Now" : "Closed"}
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1A0E00" }}>{p.businessName}</h1>
          {p.tagline && <p className="mt-2 text-base italic" style={{ color: `${primary}CC` }}>{p.tagline}</p>}

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ background: `${primary}40` }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
            <div className="h-px w-16" style={{ background: `${primary}40` }} />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            {p.contact?.phone && (
              <a href={`tel:${p.contact.phone}`} className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: primary }}>
                📞 {p.contact.phone}
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-green-500 text-white">
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* About */}
        {p.about && (
          <ElegantSection title="Our Story" primary={primary}>
            <p className="text-sm leading-relaxed text-gray-700 text-center">{p.about}</p>
          </ElegantSection>
        )}

        {/* Services */}
        {p.services?.length > 0 && (
          <ElegantSection title="Services" primary={primary}>
            <div className="space-y-3">
              {p.services.map((s, i) => (
                <div key={i} className="flex justify-between items-start py-3 border-b border-dashed last:border-0" style={{ borderColor: `${primary}20` }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#1A0E00" }}>{s.title}</p>
                    {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
                  </div>
                  {s.price && (
                    <p className="font-bold text-sm ml-4 flex-shrink-0" style={{ color: primary }}>
                      {s.currency === "INR" ? "₹" : s.currency}{s.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ElegantSection>
        )}

        {/* Gallery */}
        {p.gallery?.length > 0 && (
          <ElegantSection title="Gallery" primary={primary}>
            <div className="grid grid-cols-2 gap-3">
              {p.gallery.map((img, i) => (
                <img key={i} src={img.imageUrl} alt={img.caption || `Photo ${i+1}`} className="aspect-video object-cover rounded-xl" />
              ))}
            </div>
          </ElegantSection>
        )}

        {/* Reviews */}
        {p.reviews?.length > 0 && (
          <ElegantSection title="What Clients Say" primary={primary}>
            <div className="space-y-5">
              {p.reviews.map((rev, i) => (
                <div key={i} className="text-center">
                  <p className="text-sm text-gray-600 italic mb-2">"{rev.text}"</p>
                  <StarRating rating={rev.rating} />
                  <p className="text-xs font-semibold mt-1" style={{ color: primary }}>— {rev.authorName}</p>
                </div>
              ))}
            </div>
          </ElegantSection>
        )}

        {/* Social */}
        {p.socialLinks?.length > 0 && (
          <ElegantSection title="Connect With Us" primary={primary}>
            <div className="flex flex-wrap justify-center gap-2">
              {p.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border" style={{ borderColor: `${primary}30`, color: primary }}>
                  <SocialIcon platform={link.platform} />{link.label}
                </a>
              ))}
            </div>
          </ElegantSection>
        )}

        {/* Contact + Address */}
        {(p.contact?.email || p.address?.city || mapsUrl) && (
          <ElegantSection title="Find Us" primary={primary}>
            <div className="text-center space-y-2">
              {p.address?.addressLine1 && <p className="text-sm text-gray-600">{p.address.addressLine1}</p>}
              {p.address?.city && <p className="text-sm text-gray-600">{[p.address.city, p.address.state].filter(Boolean).join(", ")}</p>}
              {p.contact?.email && (
                <a href={`mailto:${p.contact.email}`} className="block text-sm font-semibold" style={{ color: primary }}>{p.contact.email}</a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold mt-2" style={{ color: primary }}>
                  📍 View on Google Maps →
                </a>
              )}
            </div>
          </ElegantSection>
        )}

        <div className="mt-12 pb-8 text-center">
          <a href="https://webiox.in/business-profile" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Powered by <strong>Webiox</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

function ElegantSection({ title, primary, children }) {
  return (
    <div className="mb-8">
      <div className="text-center mb-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: primary }}>{title}</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8" style={{ background: `${primary}40` }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${primary}60` }} />
          <div className="h-px w-8" style={{ background: `${primary}40` }} />
        </div>
      </div>
      {children}
    </div>
  );
}
