"use client";

import { StarRating, SocialIcon, isOpenNow, ProfilePoweredBy } from "./shared";

export default function TemplateStarter({ profile }) {
  const p = profile;
  const openStatus = isOpenNow(p.businessHours);
  const primary = p.theme?.primaryColor || "#4F46E5";
  const whatsappUrl = p.contact?.whatsapp
    ? `https://wa.me/${p.contact.whatsapp.replace(/\D/g, "")}`
    : null;
  const mapsUrl = p.address?.city
    ? `https://www.google.com/maps/search/${encodeURIComponent(
        [p.businessName, p.address.city, p.address.state].filter(Boolean).join(", ")
      )}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,system-ui,sans-serif]">
      {/* Hero / Cover */}
      <div
        className="relative h-48 sm:h-64"
        style={{ background: p.coverImageUrl ? undefined : `linear-gradient(135deg, ${primary}20, ${primary}40)` }}
      >
        {p.coverImageUrl && (
          <img src={p.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Logo + Identity */}
        <div className="relative -mt-12 mb-6 flex items-end gap-4">
          <div
            className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${primary}20` }}
          >
            {p.logoUrl ? (
              <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover" />
            ) : (
              <span>{p.businessName?.[0] || "B"}</span>
            )}
          </div>
          <div className="pb-2 flex-1 min-w-0">
            {openStatus !== null && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mb-1 ${
                  openStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${openStatus ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                {openStatus ? "Open Now" : "Closed"}
              </span>
            )}
            <h1 className="text-2xl font-extrabold text-gray-900 truncate">{p.businessName}</h1>
            {p.tagline && <p className="text-gray-500 text-sm">{p.tagline}</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {p.contact?.phone && (
            <a
              href={`tel:${p.contact.phone}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 transition-all flex-shrink-0 shadow-sm"
            >
              📞 Call
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors flex-shrink-0 shadow-sm"
            >
              💬 WhatsApp
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 transition-all flex-shrink-0 shadow-sm"
            >
              📍 Directions
            </a>
          )}
          {p.contact?.website && (
            <a
              href={p.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 transition-all flex-shrink-0 shadow-sm"
            >
              🌐 Website
            </a>
          )}
        </div>

        {/* About */}
        {p.about && (
          <Card title="About">
            <p className="text-gray-600 text-sm leading-relaxed">{p.about}</p>
          </Card>
        )}

        {/* Services */}
        {p.services?.length > 0 && (
          <Card title="Products & Services">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.services.map((s, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                    style={{ backgroundColor: primary }}
                  >
                    {s.title?.[0] || "S"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{s.title}</p>
                    {s.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.description}</p>}
                    {s.price && (
                      <p className="text-xs font-bold mt-1" style={{ color: primary }}>
                        {s.currency === "INR" ? "₹" : s.currency} {s.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Gallery */}
        {p.gallery?.length > 0 && (
          <Card title="Gallery">
            <div className="grid grid-cols-3 gap-2">
              {p.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  alt={img.caption || `Photo ${i + 1}`}
                  className="aspect-square object-cover rounded-xl"
                />
              ))}
            </div>
          </Card>
        )}

        {/* Reviews */}
        {p.reviews?.length > 0 && (
          <Card title="Reviews">
            <div className="space-y-4">
              {p.reviews.map((rev, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0 overflow-hidden">
                    {rev.authorPhotoUrl ? (
                      <img src={rev.authorPhotoUrl} alt={rev.authorName} className="w-full h-full object-cover" />
                    ) : (
                      rev.authorName?.[0] || "?"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{rev.authorName}</p>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{rev.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Social */}
        {p.socialLinks?.length > 0 && (
          <Card title="Follow Us">
            <div className="flex flex-wrap gap-2">
              {p.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <SocialIcon platform={link.platform} />
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        )}

        {/* Contact */}
        {(p.contact?.email || p.address?.city) && (
          <Card title="Contact Information">
            <div className="space-y-2">
              {p.contact?.email && (
                <a href={`mailto:${p.contact.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-brand-600">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-base">📧</span>
                  {p.contact.email}
                </a>
              )}
              {p.address?.city && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-base flex-shrink-0 mt-0.5">📍</span>
                  <span>{[p.address.addressLine1, p.address.city, p.address.state, p.address.postalCode].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        <ProfilePoweredBy />
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <h2 className="text-base font-extrabold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}
