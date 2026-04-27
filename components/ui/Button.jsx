"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:   "bg-brand-gradient text-white shadow-cta hover:opacity-90",
  secondary: "bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50",
  ghost:     "text-brand-600 hover:bg-brand-50",
  danger:    "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "text-xs font-semibold px-4 py-2 rounded-pill gap-1.5",
  md: "text-sm font-bold px-6 py-3 rounded-pill gap-2",
  lg: "text-base font-bold px-8 py-4 rounded-pill gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  href,
  className = "",
  onClick,
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;
  const cls = [
    "inline-flex items-center justify-center transition-all",
    VARIANTS[variant],
    SIZES[size],
    isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    className,
  ].join(" ");

  const inner = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      className={cls}
      {...rest}
    >
      {inner}
    </motion.button>
  );
}
