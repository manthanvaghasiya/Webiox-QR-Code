"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Share2 } from "lucide-react";
import WelcomeScreen from "../_components/WelcomeScreen";

function formatTime(s) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export default function Mp3Page({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#FF6B6B";
  const accent = theme.accentColor || "#3D2A4D";
  const {
    artist, trackTitle, audioUrl, coverImage, ctaLabel, ctaUrl,
  } = cfg;

  const audioRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setTime(a.currentTime);
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(a.duration);
    const onEnded = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play();
    setPlaying(!playing);
  }

  function seek(e) {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
  }

  if (showWelcome && cfg.welcomeScreenEnabled) {
    return <WelcomeScreen config={cfg} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: accent }}>
      <div className="w-full max-w-sm bg-black/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-5 pt-5 flex items-center justify-end">
          <button aria-label="Share" className="p-2 rounded-full bg-white/10 text-white">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cover */}
        <div className="px-8 pt-2 pb-6">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl" style={{ background: primary }}>
            {coverImage ? (
              <img src={coverImage} alt={trackTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-6xl font-black">
                ♪
              </div>
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="px-8 text-center text-white">
          <p className="text-xs uppercase tracking-widest opacity-70">{artist || "Unknown Artist"}</p>
          <h1 className="text-xl font-bold mt-1">{trackTitle || "Untitled Track"}</h1>
        </div>

        {/* Controls */}
        <div className="px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <div className="flex-1">
              <div
                onClick={seek}
                className="h-1.5 w-full rounded-full bg-white/15 cursor-pointer"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: primary }}
                />
              </div>
              <div className="flex justify-between text-xs opacity-60 mt-1.5 font-mono">
                <span>{formatTime(time)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />}

          {ctaUrl && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center px-5 h-10 rounded-full border border-white/40 text-sm font-bold hover:bg-white/10 transition-colors"
            >
              {ctaLabel || "Buy now"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
