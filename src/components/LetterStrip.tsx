import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type LetterStripAs = "h1" | "h2" | "h3" | "h4" | "span" | "a";

type LetterStripProps = {
  text: string;
  className?: string;
  as?: LetterStripAs;
  href?: string;
  id?: string;
  /** Color mode — default inherits from parent / className */
  variant?: "inherit" | "black" | "green" | "white";
  style?: CSSProperties;
  /**
   * When true, animate on mount without waiting for IntersectionObserver.
   * Use for hero slide titles that remount already in-view.
   */
  immediate?: boolean;
};

/** Skip letter-split on very long titles (performance). */
const MAX_LETTERS = 72;

/** Break only at hyphens so a compound stays readable ("Development-" / "to-" / "manufacturing"). */
function hyphenChunks(word: string): string[] {
  if (!word.includes("-")) return [word];
  const parts = word.split("-");
  const chunks: string[] = [];
  parts.forEach((part, index) => {
    if (index < parts.length - 1) chunks.push(`${part}-`);
    else if (part) chunks.push(part);
  });
  return chunks.filter(Boolean);
}

/**
 * CloudDiet / Qcentrio strip-slide letter reveal.
 * Ported for Vitalcore — inherit text color by default.
 */
function LetterStripInner({
  text,
  className = "",
  as = "h2",
  href,
  id,
  variant = "inherit",
  style,
  immediate = false,
}: LetterStripProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reveal, setReveal] = useState(false);

  const trimmed = text.trim();
  const letterCount = trimmed.replace(/\s+/g, "").length;
  const useStrip = letterCount > 0 && letterCount <= MAX_LETTERS;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !useStrip) {
      setVisible(true);
      setReveal(true);
      return;
    }

    if (immediate) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -5% 0px", threshold: 0.12 },
    );
    io.observe(el);

    // Safari / first-paint safety (same idea as Reveal)
    const forceIfNear = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > -40) {
        setVisible(true);
        io.disconnect();
      }
    };
    const t1 = window.setTimeout(forceIfNear, 220);
    const t2 = window.setTimeout(forceIfNear, 900);

    return () => {
      io.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [immediate, useStrip, trimmed]);

  useEffect(() => {
    if (!visible || reveal) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setReveal(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [visible, reveal]);

  const words = trimmed.split(/\s+/).filter(Boolean);
  let letterIndex = 0;

  const body: ReactNode = useStrip ? (
    <>
      {words.map((word, wi) => {
        const chunks = hyphenChunks(word);
        return chunks.map((chunk, ci) => {
          const isLastChunk = ci === chunks.length - 1;
          return (
            <span key={`${wi}-${ci}-${chunk}`} className="row">
              {chunk.split("").map((ch, li) => {
                const delay = 15 * letterIndex;
                letterIndex += 1;
                const isLastLetter = li === chunk.length - 1;
                return (
                  <span
                    key={`${wi}-${ci}-${li}`}
                    className={reveal ? "letter-slide-animate" : undefined}
                    style={reveal ? { transitionDelay: `${delay}ms` } : undefined}
                  >
                    {isLastChunk && isLastLetter ? `${ch}\u00A0` : ch}
                  </span>
                );
              })}
            </span>
          );
        });
      })}
    </>
  ) : (
    trimmed
  );

  const variantClass =
    variant === "green"
      ? "strip-slide-green"
      : variant === "white"
        ? "strip-slide-white"
        : variant === "black"
          ? "strip-slide-black"
          : "strip-slide-inherit";

  const cls = `strip-slide-up ${variantClass} ${className}`.trim();
  const mergedStyle: CSSProperties = {
    ...style,
    opacity: visible ? 1 : 0,
  };

  const Tag = (as === "a" && href ? "a" : as) as ElementType;
  const tagProps =
    as === "a" && href
      ? { href, id, ref, className: cls, style: mergedStyle }
      : { id, ref, className: cls, style: mergedStyle };

  return <Tag {...tagProps}>{body}</Tag>;
}

export const LetterStrip = memo(LetterStripInner);
export default LetterStrip;
