"use client";

import { Play, Share2 } from "lucide-react";

function isYouTube(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url || "");
}
function isVimeo(url) {
  return /vimeo\.com/i.test(url || "");
}
function youTubeEmbed(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
function vimeoEmbed(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

export default function VideoPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#3F8FD3";
  const {
    title, description, videos = [], ctaLabel, ctaUrl,
  } = cfg;

  const main = videos[0];

  return (
    <div className="min-h-screen bg-ink-50 pb-12">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: primary, color: "#fff" }}>
            <div>
              <h1 className="text-base font-bold">{title || "Video"}</h1>
              {description && <p className="text-xs opacity-90 mt-0.5">{description}</p>}
            </div>
            <button aria-label="Share" className="p-2 rounded-full hover:bg-white/10">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Main video */}
          <div className="aspect-video bg-black flex items-center justify-center">
            {!main ? (
              <Play className="w-16 h-16 text-white/30" />
            ) : isYouTube(main.url) ? (
              <iframe
                src={youTubeEmbed(main.url)}
                title={main.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : isVimeo(main.url) ? (
              <iframe
                src={vimeoEmbed(main.url)}
                title={main.title || "Video"}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video src={main.url} controls className="w-full h-full" />
            )}
          </div>

          {ctaUrl && (
            <div className="px-5 py-4 border-t border-ink-100">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center h-10 rounded-md font-bold text-sm text-white"
                style={{ background: primary }}
              >
                {ctaLabel || "Buy Now"}
              </a>
            </div>
          )}

          {/* Additional videos */}
          {videos.length > 1 && (
            <div className="divide-y divide-ink-100">
              {videos.slice(1).map((v, i) => (
                <a
                  key={i}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-ink-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-ink-100 flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-ink-400 fill-current ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">
                      {v.title || `Video ${i + 2}`}
                    </p>
                    <p className="text-xs text-ink-400 truncate">{v.url}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
