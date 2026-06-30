"use client";

import React from "react";

interface MarqueeProps {
  children: React.ReactNode;
  /** seconds for one full loop */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite horizontal marquee using a duplicated track so the loop is
 * seamless. CSS-keyframe driven, so the global reduced-motion rule freezes
 * it automatically; we also render a single static track when frozen via CSS.
 */
const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  className = "",
}) => {
  return (
    <div
      className={`rb-marquee ${pauseOnHover ? "rb-marquee--pause" : ""} ${className}`.trim()}
    >
      <div
        className="rb-marquee__track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        <div className="rb-marquee__group" aria-hidden={false}>
          {children}
        </div>
        <div className="rb-marquee__group" aria-hidden={true}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
