"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ config, onContinue }) {
  const [show, setShow] = useState(true);

  if (!config?.welcomeScreenEnabled || !show) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          {/* Logo */}
          {config.welcomeScreenLogo && (
            <div className="mb-6 flex justify-center">
              <img
                src={config.welcomeScreenLogo}
                alt="Logo"
                className="h-24 w-24 rounded-xl object-cover shadow-2xl"
              />
            </div>
          )}

          {/* Name/Brand */}
          {config.welcomeScreenName && (
            <h1 className="text-4xl font-bold text-white mb-3">
              {config.welcomeScreenName}
            </h1>
          )}

          {/* Title */}
          {config.welcomeScreenTitle && (
            <p className="text-lg text-purple-200 mb-2">
              {config.welcomeScreenTitle}
            </p>
          )}

          {/* Description */}
          {config.welcomeScreenDescription && (
            <p className="text-sm text-gray-300 mb-8">
              {config.welcomeScreenDescription}
            </p>
          )}

          {/* Continue Button */}
          <button
            onClick={() => setShow(false)}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
