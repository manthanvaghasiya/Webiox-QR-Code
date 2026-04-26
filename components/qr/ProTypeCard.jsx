"use client";

import { motion } from "framer-motion";

export default function ProTypeCard({ icon: Icon, label, description, onClick, delay = 0 }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative text-left p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-2xl hover:border-blue-300 transition-all overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/10 transition-all" />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{label}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
}
