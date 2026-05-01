"use client";

import { useEffect } from "react";
import { ThumbsUp, ArrowRight } from "lucide-react";

export default function FacebookPage({ page }) {
  const cfg = page.config || {};
  const url = cfg.pageUrl || cfg.url;
  const { pageName, headline, likeCount } = cfg;

  useEffect(() => {
    if (cfg.autoRedirect && url) {
      window.location.href = url;
    }
  }, [url, cfg.autoRedirect]);

  return (
    <div className="min-h-screen bg-[#1877F2] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 bg-[#1877F2] text-white text-center">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">{pageName || "Facebook Page"}</p>
        </div>
        <div className="p-6 text-center">
          <ThumbsUp className="w-12 h-12 mx-auto text-[#1877F2] mb-3 fill-current" />
          <h1 className="text-base font-bold text-ink-900 mb-4">
            {headline || "Click on the Like Button to follow us on Facebook."}
          </h1>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-md bg-[#1877F2] text-white text-sm font-bold hover:bg-[#0d65d9] transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4" />
              Like {likeCount ? `${likeCount}` : ""}
            </a>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1877F2] hover:underline"
            >
              Go to our Facebook Page <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
