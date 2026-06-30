"use client";

import React from "react";

type StarBorderProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "color" | "children">;

/**
 * Wraps content in a pill with two travelling star-glow trails along the
 * border. Trails are CSS-animated, so reduced-motion freezes them.
 */
function StarBorder<T extends React.ElementType = "button">({
  as,
  className = "",
  color = "#A78BFA",
  speed = "6s",
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = (as || "button") as React.ElementType;

  return (
    <Component className={`rb-star-border ${className}`.trim()} {...rest}>
      <span
        className="rb-star-border__trail rb-star-border__trail--bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <span
        className="rb-star-border__trail rb-star-border__trail--top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <span className="rb-star-border__inner">{children}</span>
    </Component>
  );
}

export default StarBorder;
