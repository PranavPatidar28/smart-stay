"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** locale-aware thousands separators */
  separator?: boolean;
  className?: string;
}

/**
 * Ramps a number from `from` to `to` when scrolled into view.
 * Reduced-motion users see the final value immediately.
 */
const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  separator = true,
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setValue(from + (to - from) * ease(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, from, to, duration]);

  const rounded = Math.round(value);
  const formatted = separator ? rounded.toLocaleString("en-US") : String(rounded);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;
