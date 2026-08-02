import { type ReactNode, type CSSProperties } from "react";

const TextFloat = ({ children }: { children: ReactNode }) => {
  return <span className="inline text-fade-in">{children}</span>;
};

type TypographyProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const H1 = ({ children, className = "", style }: TypographyProps) => (
  <h1
    className={`
      font-manrope font-bold
      leading-[120%]
      text-[24px] md:text-[32px] lg:text-[46px]
      tracking-wide
      ${className}
    `}
    style={style}
  >
    <TextFloat>{children}</TextFloat>
  </h1>
);

export const H2 = ({ children, className = "", style }: TypographyProps) => (
  <h2
    className={`
      font-manrope font-semibold
      leading-[120%]
      text-[20px] md:text-[24px] lg:text-[32px]
      tracking-wide
      ${className}
    `}
    style={style}
  >
    <TextFloat>{children}</TextFloat>
  </h2>
);

export const H3 = ({ children, className = "", style }: TypographyProps) => (
  <h3
    className={`
      font-manrope font-semibold
      leading-[120%]
      text-[18px] md:text-[18px] lg:text-[24px]
      tracking-wide
      ${className}
    `}
    style={style}
  >
    <TextFloat>{children}</TextFloat>
  </h3>
);

export const H4 = ({ children, className = "", style }: TypographyProps) => (
  <h4
    className={`
      font-manrope font-semibold
      leading-[120%]
      text-[16px] md:text-[16px] lg:text-[18px]
      tracking-wide
      ${className}
    `}
    style={style}
  >
    <TextFloat>{children}</TextFloat>
  </h4>
);

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
