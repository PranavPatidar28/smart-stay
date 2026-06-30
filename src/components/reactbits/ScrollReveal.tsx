"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** stagger between direct children, in seconds */
  stagger?: number;
  className?: string;
  as?: "div" | "ul" | "section";
}

/**
 * Container that staggers its direct children into view (fade + rise).
 * Wrap each child in <ScrollReveal.Item> to opt it into the stagger.
 */
const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const ScrollReveal: React.FC<ScrollRevealProps> & {
  Item: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({ children, stagger = 0.1, className = "", as = "div" }) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </MotionTag>
  );
};

const Item: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};

ScrollReveal.Item = Item;

export default ScrollReveal;
