"use client";

import { StarRating, SocialIcon, isOpenNow } from "./shared";

export default function TemplateStorefront({ profile }) {
  const p = profile;
  const primary = p.theme?.primaryColor || "#10B981";
  const accent = p.theme?.accentColor || "#F59E0B";
  const openStatus = isOpenNow(p.businessHours);
  const whatsappUrl = p.contact?.whatsapp ? `https://wa.me/${p.contact.whatsapp.replace(/\D/g,"")}` : null;
  const mapsUrl = p.address?.city ? `https://www.google.com/maps/search/${encodeURIComponent([p.businessName, p.address.city].filter(Boolean).join(", "))}` : null;

  return (
    <div className="min-h-screen bg-white font-[Inter,system-ui,sans-serif]">
      {/* Top strip */}
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${primary}, ${accent})` }} />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl font-black" style={{ background: `${primary}15`, color: primary }}>
            {p.logoUrl ? <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover" /> : p.businessName?.[0] || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 truncate">{p.businessName}</h1>
            {p.tagline && <p className="text-sm text-gray-500 truncate">{p.tagline}</p>}
          </div>
          {openStatus !== null && (
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${openStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {openStatus ? "Open" : "Closed"}
            </span>
          )}
        </div>

        {/* Action bar */}
        <div className="max-w-2xl mx-auto px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {p.contact?.phone && (
            <a href={`tel:${p.contact.phone}`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white" style={{ backgroundColor: primary }}>📞 Call</a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-green-500">💬 WhatsApp</a>
          )}
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-600 bg-gray-100">📍 Directions</a>
          )}
        </div>
      </div>

      {/* Cover image */}
      {p.coverImageUrl && (
        <img src={p.coverImageUrl} alt="Cover" className="w-full h-48 object-cover" />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Products / Services — FOCUS */}
        {p.services?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-gray-900">Our Products</h2>
              <span className="text-xs font-semibold text-gray-400">{p.services.length} items</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {p.services.map((s, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video flex items-center justify-center text-3xl" style={{ background: `${primary}10` }}>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      "🛍️"
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-gray-900 truncate">{s.title}</p>
                    {s.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.description}</p>}
                    {s.price ? (
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-black text-sm" style={{ color: primary }}>{s.currency === "INR" ? "₹" : s.currency}{s.price}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: accent }}>Add</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About */}
        {p.about && (
          <section className="bg-gray-50 rounded-2xl p-5">
            <h2 className="text-sm font-black text-gray-700 mb-2">About Us</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{p.about}</p>
          </section>
        )}

        {/* Gallery */}
        {p.gallery?.length > 0 && (
          <section>
            <h2 className="text-base font-black text-gray-900 mb-3">Gallery</h2>
            <div className="grid grid-cols-3 gap-2">
              {p.gallery.map((img, i) => (
                <img key={i} src={img.imageUrl} alt={img.caption || `Photo ${i+1}`} className="aspect-square object-cover rounded-xl" />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {p.reviews?.length > 0 && (
          <section>
            <h2 className="text-base font-black text-gray-900 mb-3">Customer Reviews</h2>
            <div className="space-y-3">
              {p.reviews.map((rev, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                    {rev.authorName?.[0] || "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{rev.authorName}</span>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{rev.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social */}
        {p.socialLinks?.length > 0 && (
          <section>
            <h2 className="text-sm font-black text-gray-700 mb-3">Follow & Connect</h2>
            <div className="flex flex-wrap gap-2">
              {p.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border" style={{ borderColor: `${primary}40`, color: primary }}>
                  <SocialIcon platform={link.platform} />{link.label}
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="pt-4 text-center border-t border-gray-100">
          <a href="https://webiox.in/business-profile" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400">
            Powered by <strong>Webiox</strong>
          </a>
        </div>
      </div>
    </div>
  );
}
