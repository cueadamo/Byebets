interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
}

export function Logo({
  variant = "dark",
  className = "h-12 w-auto",
  showTagline = true,
}: LogoProps) {
  const isLight = variant === "light";
  const byeColor = isLight ? "#FFFFFF" : "#0B2340";
  const betsColor = "#2979FF";
  const taglineColor = "#B98B3E";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 110"
      className={className}
      aria-label="ByeBets — Escolhas hoje. Liberdade sempre."
    >
      <defs>
        <linearGradient id={`doorGrad_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2979FF" />
          <stop offset="100%" stopColor="#64B5F6" />
        </linearGradient>
      </defs>

      {/* Door Arch Icon */}
      <g transform="translate(10, 12)">
        <path
          d="M 35 10 C 15 10 5 24 5 44 L 5 80 C 5 83 7 85 10 85 L 60 85 C 63 85 65 83 65 80 L 65 44 C 65 24 55 10 35 10 Z"
          fill={isLight ? "#FFFFFF" : "#0B2340"}
        />
        <path
          d="M 35 16 C 20 16 12 28 12 44 L 12 79 L 58 79 L 58 44 C 58 28 50 16 35 16 Z"
          fill={`url(#doorGrad_${variant})`}
        />
        <path d="M 22 25 L 12 79 L 28 73 L 34 29 Z" fill="#0B2340" opacity="0.85" />
        <path d="M 28 30 L 52 20 L 58 79 L 28 73 Z" fill="#FFFFFF" opacity="0.4" />
      </g>

      {/* Brand Text */}
      <text
        x="88"
        y="60"
        fontFamily="'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="44"
        letterSpacing="-1"
      >
        <tspan fill={byeColor}>Bye</tspan>
        <tspan fill={betsColor}>Bets</tspan>
      </text>

      {showTagline && (
        <text
          x="89"
          y="82"
          fontFamily="'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="9"
          fill={taglineColor}
          letterSpacing="1.8"
        >
          ESCOLHAS HOJE. LIBERDADE SEMPRE.
        </text>
      )}
    </svg>
  );
}
