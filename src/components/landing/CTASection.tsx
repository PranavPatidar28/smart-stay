"use client";

import Link from "next/link";
import { Search, Shield, CheckCircle, Users, ArrowRight } from "lucide-react";
import CountUp from "@/components/reactbits/CountUp";
import StarBorder from "@/components/reactbits/StarBorder";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

const stats = [
  {
    value: <CountUp to={10000} suffix="+" />,
    label: "Students found homes",
    foot: (
      <span className="inline-flex items-center gap-1 text-[#FCD34D]">
        ★ 4.9/5 average rating
      </span>
    ),
  },
  {
    value: <CountUp to={500} suffix="+" />,
    label: "Verified properties",
    foot: (
      <span className="inline-flex items-center gap-1 text-[#6EE7B7]">
        <Shield className="w-4 h-4" aria-hidden="true" /> 100% verified
      </span>
    ),
  },
  {
    value: <span>&lt;24hrs</span>,
    label: "Average response time",
    foot: (
      <span className="inline-flex items-center gap-1 text-[#6EE7B7]">
        <CheckCircle className="w-4 h-4" aria-hidden="true" /> Fast support
      </span>
    ),
  },
];

const CTASection = () => {
  return (
    <section className="relative py-20 lg:py-28" aria-labelledby="cta-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            {/* soft glow accents */}
            <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
              <div className="absolute -top-16 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-[#A78BFA] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/30 bg-white/15 text-white text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" aria-hidden="true" />
                Peak booking season — limited availability
              </div>
              <h2
                id="cta-heading"
                className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight"
              >
                Your perfect room is filling up fast
              </h2>
              <p className="text-white/90 mt-5 text-base sm:text-lg leading-relaxed">
                Join thousands of students who found verified, secure
                accommodation with SmartStay. Start your search today.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 mb-12">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm p-6 text-center"
                >
                  <div className="font-display font-bold text-white text-3xl lg:text-4xl mb-2">
                    {s.value}
                  </div>
                  <div className="text-white/80 text-sm lg:text-base">
                    {s.label}
                  </div>
                  <div className="mt-2 text-sm">{s.foot}</div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/listings"
                prefetch
                aria-label="Find your room now"
                className="group inline-flex items-center justify-center gap-3 min-w-[220px] rounded-2xl px-8 py-4 text-lg font-bold text-[#6D28D9] bg-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6366F1]"
              >
                <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                Find your room now
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              <StarBorder
                as={Link}
                href="/owner-dashboard"
                color="#FBBF24"
                speed="5s"
                aria-label="List your property"
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                List your property
              </StarBorder>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-white/85 text-sm">
              <span className="inline-flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#6EE7B7]" aria-hidden="true" />
                Secure payments
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#FBBF24]" aria-hidden="true" />
                Instant confirmation
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FBCFE8]" aria-hidden="true" />
                24/7 student support
              </span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

export default CTASection;
