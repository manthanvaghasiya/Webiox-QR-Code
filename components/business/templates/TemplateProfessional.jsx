"use client";

import { StarRating, SocialIcon, isOpenNow } from "./shared";

export default function TemplateProfessional({ profile }) {
  const p = profile;
  const primary = p.theme?.primaryColor || "#1E3A5F";
  const openStatus = isOpenNow(p.businessHours);
  const whatsappUrl = p.contact?.whatsapp ? `https://wa.me/${p.contact.whatsapp.replace(/\D/g,"")}` : null;
  const mapsUrl = p.address?.city ? `https://www.google.com/maps/search/${encodeURIComponent([p.businessName, p.address.city].filter(Boolean).join(", "))}` : null;

  return (
    <div className="min-h-screen bg-slate-50 font-[Inter,system-ui,sans-serif]">
      {/* Sidebar layout (card on top on mobile) */}
      <div className="max-w-3xl mx-auto px-4 py-8 lg:flex lg:gap-8">
        {/* Left/Top: Profile card */}
        <div className="lg:w-72 lg:flex-shrink-0 mb-6 lg:mb-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            {/* Color band */}
            <div className="h-20" style={{ backgroundColor: primary }} />
            <div className="px-5 pb-5 -mt-8">
              <div className="w-16 h-16 rounded-xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-2xl font-black mb-3" style={{ backgroundColor: `${primary}20` }}>
                {p.logoUrl ? <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover" /> : p.businessName?.[0] || "B"}
              </div>
              <h1 className="text-lg font-black text-gray-900">{p.businessName}</h1>
              {p.tagline && <p className="text-sm text-gray-500 mt-0.5">{p.tagline}</p>}
              {openStatus !== null && (
                <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-bold ${openStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${openStatus ? "bg-green-500" : "bg-red-400"}`} />
                  {openStatus ? "Open Now" : "Closed"}
                </span>
              )}

              {/* Contact list */}
              <div className="mt-4 space-y-2.5">
                {p.contact?.phone && (
                  <a href={`tel:${p.contact.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 group">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs group-hover:bg-gray-100 transition-colors" style={{ backgroundColor: `${primary}10` }}>📞</span>
                    <span className="font-medium">{p.contact.phone}</span>
                  </a>
                )}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                    <span className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-xs">💬</span>
                    <span className="font-medium">WhatsApp</span>
                  </a>
                )}
                {p.contact?.email && (
                  <a href={`mailto:${p.contact.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: `${primary}10` }}>📧</span>
                    <span className="font-medium truncate">{p.contact.email}</span>
                  </a>
                )}
                {p.contact?.website && (
                  <a href={p.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: `${primary}10` }}>🌐</span>
                    <span className="font-medium">Website</span>
                  </a>
                )}
                {p.address?.city && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5" style={{ backgroundColor: `${primary}10` }}>📍</span>
                    <span>{[p.address.city, p.address.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Social */}
              {p.socialLinks?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Connect</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.socialLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:bg-gray-100 transition-colors" style={{ backgroundColor: `${primary}08` }}>
                        <SocialIcon platform={link.platform} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-5">
          {/* About */}
          {p.about && (
            <ProfCard title="About" primary={primary}>
              <p className="text-sm text-gray-600 leading-relaxed">{p.about}</p>
            </ProfCard>
          )}

          {/* Services */}
          {p.services?.length > 0 && (
            <ProfCard title="Services & Offerings" primary={primary}>
              <div className="divide-y divide-gray-50">
                {p.services.map((s, i) => (
                  <div key={i} className="flex justify-between items-start py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{s.title}</p>
                      {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
                    </div>
                    {s.price && (
                      <span className="ml-4 text-sm font-black flex-shrink-0 px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: primary }}>
                        {s.currency === "INR" ? "₹" : s.currency}{s.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ProfCard>
          )}

          {/* Gallery */}
          {p.gallery?.length > 0 && (
            <ProfCard title="Portfolio / Gallery" primary={primary}>
              <div className="grid grid-cols-3 gap-2">
                {p.gallery.map((img, i) => (
                  <img key={i} src={img.imageUrl} alt={img.caption || `Photo ${i+1}`} className="aspect-video object-cover rounded-xl" />
                ))}
              </div>
            </ProfCard>
          )}

          {/* Reviews */}
          {p.reviews?.length > 0 && (
            <ProfCard title="Testimonials" primary={primary}>
              <div className="space-y-4">
                {p.reviews.map((rev, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-gray-600 italic mb-2">"{rev.text}"</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} />
                      <span className="text-xs font-semibold text-gray-500">— {rev.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ProfCard>
          )}

          <div className="pt-4 text-center">
            <a href="https://webiox.in/business-profile" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400">
              Powered by <strong>Webiox</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfCard({ title, primary, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: primary }} />
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}
