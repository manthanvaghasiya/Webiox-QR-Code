const VARIANTS = {
  brand:   "bg-brand-100 text-brand-700",
  accent:  "bg-cyan-100 text-cyan-700",
  success: "bg-emerald-100 text-emerald-700",
  neutral: "bg-ink-100 text-ink-600",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-bold uppercase tracking-wider",
        VARIANTS[variant] ?? VARIANTS.neutral,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
