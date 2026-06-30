"use client";

import React, { useRef } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * Card with a radial glow that follows the pointer. The glow is a CSS
 * variable updated on pointer move, so it costs nothing when idle and
 * is purely decorative (no reduced-motion concern).
 */
const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(139, 92, 246, 0.25)",
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--rb-spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--rb-spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`rb-spotlight-card ${className}`.trim()}
      style={{ ["--rb-spot-color" as string]: spotlightColor }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
