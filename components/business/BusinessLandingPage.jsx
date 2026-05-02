"use client";

import { useState } from "react";
import TemplateStarter from "./templates/TemplateStarter";
import TemplateBold from "./templates/TemplateBold";
import TemplateElegant from "./templates/TemplateElegant";
import TemplateModern from "./templates/TemplateModern";
import TemplateStorefront from "./templates/TemplateStorefront";
import TemplateProfessional from "./templates/TemplateProfessional";
import ProfileActionBar from "./ProfileActionBar";

const TEMPLATE_MAP = {
  starter: TemplateStarter,
  bold: TemplateBold,
  elegant: TemplateElegant,
  modern: TemplateModern,
  storefront: TemplateStorefront,
  professional: TemplateProfessional,
};

export default function BusinessLandingPage({ profile }) {
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-xl font-bold text-gray-700">Business profile not found</h1>
          <p className="text-gray-400 text-sm mt-2">This profile may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  const templateKey = profile.theme?.template || "starter";
  const Template = TEMPLATE_MAP[templateKey] || TemplateStarter;

  return (
    <div className="relative">
      {/* Inject Google Font if needed */}
      {profile.theme?.fontFamily && profile.theme.fontFamily !== "Inter" && (
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(profile.theme.fontFamily)}:wght@400;600;700;800;900&display=swap');
          body { font-family: '${profile.theme.fontFamily}', system-ui, sans-serif !important; }
        `}</style>
      )}

      {/* Render selected template */}
      <Template profile={profile} />

      {/* Sticky mobile action bar */}
      <ProfileActionBar profile={profile} />
    </div>
  );
}
