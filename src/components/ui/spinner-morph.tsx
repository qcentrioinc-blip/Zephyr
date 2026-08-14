import type { SVGProps } from "react";
import { SPINNER_MORPH_D_INITIAL, SPINNER_MORPH_D_VALUES } from "./spinner-morph-paths";

export type SpinnerMorphProps = SVGProps<SVGSVGElement> & {
  size?: number;
  bg?: string;
  fill?: string;
  rotateDur?: string;
  morphDur?: string;
};

export default function SpinnerMorph({
  size = 240,
  bg = "#ffffff",
  fill = "#113227",
  rotateDur = "6s",
  morphDur = "6s",
  className,
  ...rest
}: SpinnerMorphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      fill={bg}
      {...rest}
      aria-hidden={rest["aria-hidden"] ?? true}
    >
      <animate
        attributeName="fill"
        values={`${bg};${bg};${bg}`}
        dur="3s"
        repeatCount="indefinite"
        fill="freeze"
        calcMode="spline"
        keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
      />
      <path
        d={SPINNER_MORPH_D_INITIAL}
        fill={fill}
        fillRule="evenodd"
        stroke="none"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 120 120"
          to="-360 120 120"
          dur={rotateDur}
          repeatCount="indefinite"
        />
        <animate
          attributeName="d"
          values={SPINNER_MORPH_D_VALUES}
          dur={morphDur}
          repeatCount="indefinite"
          fill="freeze"
        />
        <animate
          attributeName="fill"
          values={`${fill};${fill};${fill}`}
          dur={morphDur}
          repeatCount="indefinite"
          fill="freeze"
          calcMode="spline"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
        />
      </path>
    </svg>
  );
}
