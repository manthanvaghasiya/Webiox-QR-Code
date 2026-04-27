"use client";

export default function Input({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-ink-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full px-4 py-3 bg-surface border border-ink-200 rounded-card",
          "text-sm text-ink-900 placeholder-ink-400",
          "outline-none transition-all",
          "focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500",
          error
            ? "border-red-400 focus:ring-red-400/15 focus:border-red-500"
            : "",
          className,
        ].join(" ")}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-ink-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
