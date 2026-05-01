"use client";

import { useState } from "react";
import { Share2, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#3c4245";
  const {
    title, description, images = [], website,
    ctaLabel, ctaUrl, gridView,
  } = cfg;

  const [lightbox, setLightbox] = useState(null);

  function next() {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % images.length);
  }
  function prev() {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + images.length) % images.length);
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: primary, color: "#fff" }}>
      {/* Hero */}
      <div className="px-6 pt-8 pb-6 text-center max-w-md mx-auto relative">
        <button
          aria-label="Share"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <Share2 className="w-4 h-4" />
        </button>
        {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
        {description && (
          <p className="text-sm opacity-80 leading-relaxed mb-4">{description}</p>
        )}
        {ctaUrl && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 h-9 rounded-md bg-white text-sm font-bold"
            style={{ color: primary }}
          >
            {ctaLabel || "Shop Now"}
          </a>
        )}
      </div>

      {/* Gallery */}
      <div className={`max-w-md mx-auto px-3 ${gridView ? "grid grid-cols-2 gap-2" : "space-y-2"}`}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className={[
              "block w-full overflow-hidden rounded-xl bg-black/20",
              gridView ? "aspect-square" : "aspect-[4/3]",
            ].join(" ")}
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
        {images.length === 0 && (
          <p className="text-center text-sm opacity-60 py-12">No images uploaded</p>
        )}
      </div>

      {website && (
        <div className="text-center mt-8">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-60 hover:opacity-100 hover:underline"
          >
            {website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            className="absolute left-4 p-2 rounded-full bg-white/10 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img
            src={images[lightbox]}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
