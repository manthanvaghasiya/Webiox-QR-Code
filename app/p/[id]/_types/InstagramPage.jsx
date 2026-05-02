"use client";

import { useEffect, useState } from "react";
import { Camera as Instagram, ExternalLink } from "lucide-react";
import WelcomeScreen from "../_components/WelcomeScreen";

export default function InstagramPage({ page }) {
  const cfg = page.config || {};
  const [showWelcome, setShowWelcome] = useState(true);
  const username = (cfg.username || "").replace(/^@/, "");

  useEffect(() => {
    if (username && !showWelcome) {
      const url = `https://instagram.com/${encodeURIComponent(username)}`;
      window.location.href = url;
    }
  }, [username, showWelcome]);

  if (showWelcome && cfg.welcomeScreenEnabled) {
    return <WelcomeScreen config={cfg} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
          <Instagram className="w-10 h-10 text-white" />
        </div>
        {username ? (
          <>
            <h1 className="text-xl font-bold text-ink-900 mb-1">@{username}</h1>
            <p className="text-sm text-ink-500 mb-6">Opening Instagram…</p>
            <a
              href={`https://instagram.com/${encodeURIComponent(username)}`}
              className="inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold cursor-pointer"
            >
              View Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <p className="text-sm text-ink-500">No username configured.</p>
        )}
      </div>
    </div>
  );
}
