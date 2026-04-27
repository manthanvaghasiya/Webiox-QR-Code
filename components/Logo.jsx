"use client";

import { useId } from "react";
import { motion } from "framer-motion";

const PX = { sm: 24, md: 32, lg: 40 };
const TEXT = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

export default function Logo({ variant = "full", size = "md", light = false, className = "" }) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const px = PX[size] ?? PX.md;
  const gradId = `logo-g-${uid}`;

  const mark = (
    <motion.div
      whileHover={{ rotate: 3, scale: 1.05 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ width: px, height: px, flexShrink: 0 }}
    >
      <svg viewBox="0 0 56 56" width={px} height={px} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
        </defs>
        {/* Outer frame ring */}
        <rect x="0" y="0" width="56" height="56" rx="13" fill={`url(#${gradId})`} />
        {/* White cutout — creates the QR-ring silhouette */}
        <rect x="8" y="8" width="40" height="40" rx="7" fill="white" />
        {/* Inner solid square */}
        <rect x="16" y="16" width="24" height="24" rx="4" fill={`url(#${gradId})`} />
      </svg>
    </motion.div>
  );

  if (variant === "mark") {
    return <div className={className}>{mark}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      <span
        className={`font-bold tracking-tight leading-none select-none ${TEXT[size]} ${light ? "text-white" : "text-ink-900"
          }`}
      >
        Webiox
        <span
          className={`font-normal ${light ? "text-accent-400" : "text-accent-500"}`}
        >
          QR Studio
        </span>
      </span>
    </div>
  );
}
