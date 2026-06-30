"use client";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

/**
 * Sweeps a soft highlight across text. Pure CSS animation, so it is
 * automatically frozen by the global prefers-reduced-motion rule.
 */
const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = "",
}) => {
  return (
    <span
      className={`rb-shiny-text ${disabled ? "rb-shiny-text--off" : ""} ${className}`.trim()}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
