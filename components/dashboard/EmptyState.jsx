import Link from "next/link";

export default function EmptyState({ icon: Icon, title, description, cta, ctaHref }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-brand-500/20">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-ink-900 mb-2">{title}</h3>
      <p className="text-sm text-ink-500 mb-7 max-w-xs leading-relaxed">{description}</p>
      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/25 hover:opacity-90 transition-opacity cursor-pointer"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
