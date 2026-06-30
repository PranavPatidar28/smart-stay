"use client";

import { useRef } from "react";
import { Search, Building2, Camera, Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    title: "Search & filter",
    description:
      "Enter your university or area, then narrow by budget, room type, and the amenities you need.",
    icon: <Search className="w-7 h-7" />,
    color: "#8B5CF6",
  },
  {
    title: "Browse & compare",
    description:
      "Open detailed photos, read real reviews, and line properties up side by side.",
    icon: <Building2 className="w-7 h-7" />,
    color: "#6366F1",
  },
  {
    title: "Visit & verify",
    description:
      "Book an in-person visit or take a virtual tour to confirm it's the right fit.",
    icon: <Camera className="w-7 h-7" />,
    color: "#10B981",
  },
  {
    title: "Book securely",
    description:
      "Pay through our protected checkout and get instant, verified confirmation.",
    icon: <Shield className="w-7 h-7" />,
    color: "#F59E0B",
  },
];

const HowItWorksSection = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".rb-step", {
          y: 48,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from(".rb-step-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative py-20 lg:py-28"
      aria-labelledby="how-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-5 text-sm font-medium rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A5B4FC]">
              Four simple steps
            </span>
            <h2
              id="how-heading"
              className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight"
            >
              From search to keys in hand
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              No agents to chase, no guesswork. Here's the whole journey.
            </p>
          </div>
        </AnimatedContent>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* connecting line behind the step cards (desktop) */}
          <div
            className="rb-step-line hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/50 to-[#8B5CF6]/0"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={i} className="rb-step relative">
              <div
                className="relative z-10 flex items-center justify-center w-[4.5rem] h-[4.5rem] mx-auto mb-6 rounded-2xl text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
                style={{
                  background: `linear-gradient(135deg, ${step.color}, ${step.color}99)`,
                }}
              >
                {step.icon}
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-[#0c0a1a] border border-white/15 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <div className="text-center rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm px-5 py-6 h-full">
                <h3 className="font-display font-semibold text-white text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
