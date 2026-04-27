export default function Section({
  children,
  className = "",
  maxWidth = "7xl",
  py = "pb-24",
}) {
  return (
    <section
      className={[
        "px-4 sm:px-8",
        py,
        `max-w-${maxWidth} mx-auto w-full`,
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
