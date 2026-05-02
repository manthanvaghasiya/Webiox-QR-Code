"use client";

import { StarRating, SocialIcon, isOpenNow } from "./shared";

export default function TemplateModern({ profile }) {
  const p = profile;
  const primary = p.theme?.primaryColor || "#06B6D4";
  const secondary = p.theme?.secondaryColor || "#3B82F6";
  const openStatus = isOpenNow(p.businessHours);
  const whatsappUrl = p.contact?.whatsapp ? `https://wa.me/${p.contact.whatsapp.replace(/\D/g,"")}` : null;
  const mapsUrl = p.address?.city ? `https://www.google.com/maps/search/${encodeURIComponent([p.businessName, p.address.city].filter(Boolean).join(", "))}` : null;

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,system-ui,sans-serif]">
      {/* Gradient header */}
      <div className="relative pb-24 px-4 pt-10" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
        <div className="max-w-lg mx-auto text-center">
          {p.logoUrl && (
            <img src={p.logoUrl} alt={p.businessName} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-xl border-4 border-white/30" />
          )}
          {openStatus !== null && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm ${openStatus ? "text-white" : "text-white/70"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${openStatus ? "bg-white" : "bg-white/50"} animate-pulse`} />
              {openStatus ? "Open Now" : "Closed"}
            </span>
          )}
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">{p.businessName}</h1>
          {p.tagline && <p className="text-white/80 text-sm">{p.tagline}</p>}
        </div>
      </div>

      {/* Floating action card */}
      <div className="max-w-lg mx-auto px-4 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 flex flex-wrap gap-2 justify-center mb-6">
          {p.contact?.phone && (
            <a href={`tel:${p.contact.phone}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
              📞 Call
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-500 flex-shrink-0">
              💬 WhatsApp
            </a>
          )}
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 flex-shrink-0">
              📍 Directions
            </a>
          )}
          {p.contact?.website && (
            <a href={p.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 flex-shrink-0">
              🌐 Website
            </a>
          )}
        </div>

        {/* About */}
        {p.about && (
          <Card>
            <GradTag primary={primary} secondary={secondary}>About</GradTag>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">{p.about}</p>
          </Card>
        )}

        {/* Services */}
        {p.services?.length > 0 && (
          <Card>
            <GradTag primary={primary} secondary={secondary}>Services</GradTag>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {p.services.map((s, i) => (
                <div key={i} className="p-3 rounded-2xl border border-gray-100" style={{ background: `${primary}08` }}>
                  <p className="font-bold text-sm text-gray-900">{s.title}</p>
                  {s.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.description}</p>}
                  {s.price && <p className="text-xs font-black mt-1" style={{ color: primary }}>{s.currency === "INR" ? "₹" : s.currency}{s.price}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Gallery */}
        {p.gallery?.length > 0 && (
          <Card>
            <GradTag primary={primary} secondary={secondary}>Gallery</GradTag>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {p.gallery.map((img, i) => (
                <img key={i} src={img.imageUrl} alt={img.caption || `Photo ${i+1}`} className="aspect-square object-cover rounded-xl" />
              ))}
            </div>
          </Card>
        )}

        {/* Reviews */}
        {p.reviews?.length > 0 && (
          <Card>
            <GradTag primary={primary} secondary={secondary}>Reviews</GradTag>
            <div className="space-y-3 mt-3">
              {p.reviews.map((rev, i) => (
                <div key={i} className="p-3 rounded-2xl" style={{ background: `${primary}08` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-gray-900">{rev.authorName}</p>
                    <StarRating rating={rev.rating} />
                  </div>
                  <p className="text-xs text-gray-500">{rev.text}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Social */}
        {p.socialLinks?.length > 0 && (
          <Card>
            <GradTag primary={primary} secondary={secondary}>Follow</GradTag>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${primary}CC, ${secondary}CC)` }}>
                  <SocialIcon platform={link.platform} />{link.label}
                </a>
              ))}
            </div>
          </Card>
        )}

        <div className="py-8 text-center">
          <a href="https://webiox.in/business-profile" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Powered by <strong>Webiox</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4">{children}</div>;
}

function GradTag({ primary, secondary, children }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-black text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
      {children}
    </span>
  );
}
