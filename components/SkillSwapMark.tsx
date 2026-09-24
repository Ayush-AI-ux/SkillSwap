type SkillSwapMarkProps = {
  size?: number;
  className?: string;
};

/**
 * The SkillSwap logo mark: two arced arrows exchanging places,
 * representing the creator <-> client skill exchange.
 * Colors are fixed brand colors (not currentColor) since this is a two-tone mark.
 */
export default function SkillSwapMark({ size = 18, className = "" }: SkillSwapMarkProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 148 196 A 130 130 0 0 1 366 176"
        fill="none"
        stroke="#E8467C"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <polygon points="366,176 322,150 330,196" fill="#E8467C" />
      <path
        d="M 364 316 A 130 130 0 0 1 146 336"
        fill="none"
        stroke="#1B2340"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <polygon points="146,336 190,362 182,316" fill="#1B2340" />
    </svg>
  );
}