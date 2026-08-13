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

const h1Size = `
  font-manrope font-bold
  leading-[120%]
  text-[24px] md:text-[32px] lg:text-[46px]
  tracking-wide
`;

const h2Size = `
  font-manrope font-semibold
  leading-[120%]
  text-[20px] md:text-[24px] lg:text-[32px]
  tracking-wide
`;

const h3Size = `
  font-manrope font-semibold
  leading-[120%]
  text-[18px] md:text-[18px] lg:text-[24px]
  tracking-wide
`;

const h4Size = `
  font-manrope font-semibold
  leading-[120%]
  text-[16px] md:text-[16px] lg:text-[18px]
  tracking-wide
`;

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
    className={`
      font-para font-normal
      leading-[120%] md:leading-[20px]
      text-[10px] md:text-[12px] lg:text-[14px]
      tracking-[0.05em]
      text-fade-in
      ${className}
    `}
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
    className={`
      font-para font-normal
      leading-[120%]
      text-[12px] md:text-[14px] lg:text-[16px]
      tracking-[0.05em]
      ${className}
    `}
    style={style}
  >
    {children}
  </p>
);

const Typography = { H1, H2, H3, H4, P, SupportingText };
export default Typography;
