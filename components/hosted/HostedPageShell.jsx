import Link from "next/link";
import ShareButton from "./ShareButton";

const WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function HostedPageShell({ page, width = "md", children }) {
  const theme = page?.theme ?? {};
  const meta = page?.meta ?? {};
  const lang = meta.lang || "en";
  const title = meta.title || "";
  const logoUrl = theme.logoUrl;
  const bgColor = theme.bgColor;
  const textColor = theme.textColor || "#0A0F1E";

  const useGradientMesh = !bgColor || bgColor === "#ffffff" || bgColor === "#fff";

  const wrapperStyle = useGradientMesh
    ? { color: textColor }
    : { backgroundColor: bgColor, color: textColor };

  const containerWidth = WIDTH_MAP[width] ?? WIDTH_MAP.md;

  return (
    <div
      lang={lang}
      style={wrapperStyle}
      className={`relative min-h-screen flex flex-col hosted-fade-in ${
        useGradientMesh ? "animate-gradient-mesh" : ""
      }`}
    >
      <ShareButton title={title} />

      {title && (
        <header className={`${containerWidth} w-full mx-auto px-4 pt-6 pb-2 flex items-center gap-3`}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-black/5"
            />
          ) : null}
          <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
        </header>
      )}

      <main className={`${containerWidth} w-full mx-auto flex-1 px-4 py-6`}>
        {children}
      </main>

      <footer className="py-6 px-4 text-center">
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity motion-reduce:transition-none"
        >
          Powered by <span className="font-semibold">Webiox QR Studio</span>
        </Link>
      </footer>
    </div>
  );
}
