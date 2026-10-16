type Props = {
  className?: string;
  wheelFill?: string;
};

/** Line-art car from the hero artwork. Prototype only. */
export function HeroLineCar({ className, wheelFill = "#252D29" }: Props) {
  return (
    <svg viewBox="-10 -40 800 310" fill="none" aria-hidden className={className}>
      <path
        d="M0 140l45-80 110-12 100-75h250l120 85 117 35 35 47v72H0z"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path d="M172 48h390 M275-19l-45 67 M475-19l47 67" stroke="currentColor" strokeWidth="5" />
      <circle cx="155" cy="204" r="55" fill={wheelFill} stroke="currentColor" strokeWidth="5" />
      <circle cx="610" cy="204" r="55" fill={wheelFill} stroke="currentColor" strokeWidth="5" />
      <path d="M23 129h98 M605 108h89" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}
