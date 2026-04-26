"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MODES = [
  { id: "basic", label: "Simple" },
  { id: "pro", label: "Pro" },
];

export default function ModeToggle({ mode }) {
  const router = useRouter();

  const select = (id) => {
    if (id === mode) return;
    const params = new URLSearchParams();
    params.set("mode", id);
    router.replace(`/generator?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      role="tablist"
      aria-label="Generator mode"
      className="relative inline-flex items-center bg-white/70 backdrop-blur-xl border border-white/40 rounded-full p-1 shadow-md"
    >
      {MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            onClick={() => select(m.id)}
            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-full transition-colors min-w-[88px] ${
              active ? "text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-toggle-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-600/30"
              />
            )}
            {m.label}
            {m.id === "pro" && (
              <span
                className={`ml-1.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  active ? "bg-white/25 text-white" : "bg-blue-100 text-blue-700"
                }`}
              >
                New
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
