"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function AccordionSection({ title, icon: Icon, isOpen, onToggle, badge, children }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left group">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <Icon className="w-4 h-4" />
        </span>
        <span className="flex-1 text-sm font-bold text-gray-800 uppercase tracking-wider">
          {badge && <span className="mr-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{badge}</span>}
          {title}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
