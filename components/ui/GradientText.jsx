export default function GradientText({ children, className = "" }) {
  return (
    <span
      className={[
        "bg-brand-gradient bg-clip-text text-transparent",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
