// ─────────────────────────────────────────────────────────────────────────────
// BioLinkLandingPage — public /link/[slug] bio-link renderer
//
// Picks a bio-link template (currently feature-rich for all keys) from
// biolink.theme.template, injects optional Google Font, and renders it.
// Used in: app/link/[slug]/page.js (public bio-link route).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import BioLinkTemplateFeatureRich from './templates/BioLinkTemplateFeatureRich';

const TEMPLATE_MAP = {
  'feature-rich': BioLinkTemplateFeatureRich,
  'minimal': BioLinkTemplateFeatureRich, // placeholder for now
  'gradient': BioLinkTemplateFeatureRich, // placeholder for now
};

export default function BioLinkLandingPage({ biolink }) {
  if (!biolink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-xl font-bold text-gray-700">Bio Link not found</h1>
          <p className="text-gray-400 text-sm mt-2">This link may have been removed or is private.</p>
        </div>
      </div>
    );
  }

  const templateKey = biolink.theme?.template || 'feature-rich';
  const Template = TEMPLATE_MAP[templateKey] || BioLinkTemplateFeatureRich;

  return (
    <div className="relative">
      {/* Inject Google Font if needed */}
      {biolink.theme?.fontFamily && biolink.theme.fontFamily !== 'Inter' && (
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(biolink.theme.fontFamily)}:wght@400;600;700;800;900&display=swap');
          body { font-family: '${biolink.theme.fontFamily}', system-ui, sans-serif !important; }
        `}</style>
      )}

      {/* Render selected template */}
      <Template biolink={biolink} />
    </div>
  );
}
