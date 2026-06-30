"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

interface AnimatedContentProps {
  children: React.ReactNode;
  /** translate distance in px before settling */
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * Generic entrance wrapper sharing the page's motion grammar:
 * fade + rise, fired once when scrolled into view. Honours reduced motion.
 */
const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 40,
  direction = "vertical",
  reverse = false,
  duration = 0.7,
  delay = 0,
  className = "",
}) => {
  const reduce = useReducedMotion();
  const axis = direction === "horizontal" ? "x" : "y";
  const offset = reverse ? -distance : distance;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, [axis]: offset }}
      whileInView={{ opacity: 1, [axis]: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContent;
