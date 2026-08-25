import { type ReactNode, type CSSProperties } from "react";
import { LetterStrip } from "../LetterStrip";

const TextFloat = ({ children }: { children: ReactNode }) => {
  return <span className="inline text-fade-in">{children}</span>;
};

type TypographyProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Skip letter-strip (custom motion / complex children) */
  animate?: boolean;
  /** Animate on mount when already in view (e.g. hero remounts) */
  immediate?: boolean;
};

function plainText(children: ReactNode): string | null {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return null;
}

/* Fluid type lives in index.css (.zephyr-type-*) — 1920 baseline + 75% caps */
const h1Size = `font-manrope font-bold zephyr-type-h1`;
const h2Size = `font-manrope font-semibold zephyr-type-h2`;
const h3Size = `font-manrope font-semibold zephyr-type-h3`;
const h4Size = `font-manrope font-semibold zephyr-type-h4`;

export const H1 = ({
  children,
  className = "",
  style,
  animate = true,
  immediate = false,
}: TypographyProps) => {
  const text = plainText(children);
  if (animate && text) {
    return (
      <LetterStrip
        as="h1"
        text={text}
        variant="inherit"
        className={`${h1Size} ${className}`}
        style={style}
        immediate={immediate}
      />
    );
  }
  return (
    <h1 className={`${h1Size} ${className}`} style={style}>
      <TextFloat>{children}</TextFloat>
    </h1>
  );
};

export const H2 = ({
  children,
  className = "",
  style,
  animate = true,
  immediate = false,
}: TypographyProps) => {
  const text = plainText(children);
  if (animate && text) {
    return (
      <LetterStrip
        as="h2"
        text={text}
        variant="inherit"
        className={`${h2Size} ${className}`}
        style={style}
        immediate={immediate}
      />
    );
  }
  return (
    <h2 className={`${h2Size} ${className}`} style={style}>
      <TextFloat>{children}</TextFloat>
    </h2>
  );
};

export const H3 = ({
  children,
  className = "",
  style,
  animate = true,
  immediate = false,
}: TypographyProps) => {
  const text = plainText(children);
  if (animate && text) {
    return (
      <LetterStrip
        as="h3"
        text={text}
        variant="inherit"
        className={`${h3Size} ${className}`}
        style={style}
        immediate={immediate}
      />
    );
  }
  return (
    <h3 className={`${h3Size} ${className}`} style={style}>
      <TextFloat>{children}</TextFloat>
    </h3>
  );
};

export const H4 = ({
  children,
  className = "",
  style,
  animate = true,
  immediate = false,
}: TypographyProps) => {
  const text = plainText(children);
  if (animate && text) {
    return (
      <LetterStrip
        as="h4"
        text={text}
        variant="inherit"
        className={`${h4Size} ${className}`}
        style={style}
        immediate={immediate}
      />
    );
  }
  return (
    <h4 className={`${h4Size} ${className}`} style={style}>
      <TextFloat>{children}</TextFloat>
    </h4>
  );
};

export const P = ({ children, className = "", style }: TypographyProps) => (
  <p
    className={`font-para font-normal zephyr-type-p text-fade-in ${className}`}
    style={style}
  >
    {children}
  </p>
);

export const SupportingText = ({
  children,
  className = "",
  style,
}: TypographyProps) => (
  <p
    className={`font-para font-normal zephyr-type-support ${className}`}
    style={style}
  >
    {children}
  </p>
);

const Typography = { H1, H2, H3, H4, P, SupportingText };
export default Typography;
