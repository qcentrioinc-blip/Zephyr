type Props = {
  items: string[];
  reverse?: boolean;
  speed?: "slow" | "med" | "fast";
  className?: string;
  separator?: string;
};

/** Infinite CSS marquee — paused via prefers-reduced-motion in CSS. */
export default function Marquee({
  items,
  reverse,
  speed = "med",
  className = "",
  separator = " · ",
}: Props) {
  const line = items.join(separator);
  const track = `${line}${separator}${line}${separator}${line}${separator}${line}`;

  return (
    <div
      className={`sil-marquee sil-marquee--${speed} ${reverse ? "is-reverse" : ""} ${className}`}
      aria-hidden
    >
      <div className="sil-marquee-track">
        <span>{track}</span>
        <span>{track}</span>
      </div>
    </div>
  );
}
