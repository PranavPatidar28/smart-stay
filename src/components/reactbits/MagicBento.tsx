"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface BentoCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** brand hex for this card's glow + accent, e.g. "#8B5CF6" */
  color: string;
  /** tailwind col/row span classes for an asymmetric layout */
  spanClass?: string;
}

interface MagicBentoProps {
  cards: BentoCard[];
  className?: string;
  glow?: string;
}

/**
 * Glow-grid of cards. A radial glow follows the pointer within each card
 * (CSS vars updated via a GSAP quickTo for buttery tracking), and the card
 * border lights up near the cursor. Idle cards cost nothing; the glow only
 * animates while the pointer is over the grid, so there is no always-on loop
 * for reduced-motion to worry about.
 */
const MagicBento: React.FC<MagicBentoProps> = ({
  cards,
  className = "",
  glow = "139, 92, 246",
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".rb-bento-card");
      const setters = cardEls.map((el) => ({
        x: gsap.quickTo(el, "--rb-glow-x", { duration: 0.4, ease: "power3" }),
        y: gsap.quickTo(el, "--rb-glow-y", { duration: 0.4, ease: "power3" }),
      }));

      const handleMove = (e: PointerEvent) => {
        cardEls.forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          setters[i].x(e.clientX - rect.left);
          setters[i].y(e.clientY - rect.top);
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          el.style.setProperty("--rb-glow-opacity", inside ? "1" : "0");
        });
      };

      window.addEventListener("pointermove", handleMove);
      return () => window.removeEventListener("pointermove", handleMove);
    },
    { scope: gridRef }
  );

  return (
    <div
      ref={gridRef}
      className={`rb-bento-grid ${className}`.trim()}
      style={{ ["--rb-glow" as string]: glow }}
    >
      {cards.map((card, i) => (
        <article
          key={i}
          className={`rb-bento-card ${card.spanClass ?? ""}`.trim()}
          style={{ ["--rb-card-accent" as string]: card.color }}
        >
          <div className="rb-bento-card__glow" />
          <div className="rb-bento-card__content">
            <div
              className="rb-bento-card__icon"
              style={{
                background: `linear-gradient(135deg, ${card.color}, ${card.color}99)`,
              }}
              aria-hidden="true"
            >
              {card.icon}
            </div>
            <h3 className="rb-bento-card__title">{card.title}</h3>
            <p className="rb-bento-card__desc">{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default MagicBento;
