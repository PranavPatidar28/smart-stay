"use client";

import Link from "next/link";
import { Shield, Lock, Phone, Users, CheckCircle, ArrowRight } from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

const trust = [
  {
    icon: <Lock className="w-7 h-7" />,
    title: "Secure payments",
    description: "Encrypted checkout with funds held in escrow until you move in.",
    color: "#8B5CF6",
    spot: "rgba(139, 92, 246, 0.22)",
  },
  {
    icon: <Phone className="w-7 h-7" />,
    title: "24/7 support",
    description: "A real team on call whenever something needs sorting out.",
    color: "#F59E0B",
    spot: "rgba(245, 158, 11, 0.2)",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Trusted owners",
    description: "Every landlord is background-verified before they can list.",
    color: "#6366F1",
    spot: "rgba(99, 102, 241, 0.22)",
  },
  {
    icon: <CheckCircle className="w-7 h-7" />,
    title: "Transparent pricing",
    description: "Rent, deposit, and fees shown upfront. No hidden charges, ever.",
    color: "#10B981",
    spot: "rgba(16, 185, 129, 0.2)",
  },
];

const SafetySection = () => {
  return (
    <section className="relative py-20 lg:py-28" aria-labelledby="safety-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent>
          <div className="text-center mb-14 lg:mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-5 text-sm font-medium rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#6EE7B7]">
              Safety first
            </span>
            <h2
              id="safety-heading"
              className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight"
            >
              Booking you can actually trust
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              The whole journey is built to protect your money and your peace of
              mind, from first search to move-in day.
            </p>
          </div>
        </AnimatedContent>

        {/* Hero verification card */}
        <AnimatedContent delay={0.05}>
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.18)"
            className="mb-8 border border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/[0.07] to-[#8B5CF6]/[0.07] backdrop-blur-sm p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                  aria-hidden="true"
                >
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="font-display font-bold text-white text-2xl lg:text-3xl mb-4">
                  Every property, personally verified
                </h3>
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-6">
                  Our team visits and inspects each home — confirming it matches
                  its photos, meets safety standards, and delivers the quality
                  you're paying for.
                </p>
                <div className="inline-flex items-center gap-2 text-[#6EE7B7] font-semibold">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                  100% verified properties
                </div>
              </div>

              <ScrollReveal
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                stagger={0.08}
              >
                {trust.map((t, i) => (
                  <ScrollReveal.Item key={i}>
                    <SpotlightCard
                      spotlightColor={t.spot}
                      className="group h-full border border-white/8 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20 focus-within:border-white/20"
                    >
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                        }}
                        aria-hidden="true"
                      >
                        {t.icon}
                      </div>
                      <h4 className="font-semibold text-white text-lg mb-2">
                        {t.title}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {t.description}
                      </p>
                    </SpotlightCard>
                  </ScrollReveal.Item>
                ))}
              </ScrollReveal>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <div className="text-center mt-12">
          <Link
            href="/listings"
            prefetch
            className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold text-white bg-gradient-to-r from-[#10B981] to-[#059669] shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070510]"
          >
            <Shield className="w-5 h-5" aria-hidden="true" />
            Browse verified properties
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
