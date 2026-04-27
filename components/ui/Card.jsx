"use client";

import { motion } from "framer-motion";

export default function Card({
  children,
  padded = true,
  elevated = false,
  interactive = false,
  className = "",
  as: Tag,
  ...rest
}) {
  const base = [
    "rounded-card bg-surface border border-white/50",
    elevated ? "shadow-glow" : "shadow-card",
    padded ? "p-6" : "",
    interactive ? "transition-all duration-200 cursor-pointer" : "",
    className,
  ].join(" ");

  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: "var(--shadow-glow)" }}
        transition={{ duration: 0.2 }}
        className={base}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  const Element = Tag ?? "div";
  return (
    <Element className={base} {...rest}>
      {children}
    </Element>
  );
}
