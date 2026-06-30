"use client";

import { Shield, Star, Home as HomeIcon, MapPin, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import MagicBento, { type BentoCard } from "@/components/reactbits/MagicBento";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

const cards: BentoCard[] = [
  {
    icon: <Shield className="w-7 h-7" />,
    title: "100% Verified Listings",
    description:
      "Every property clears a 15-point check — legal documents, safety, amenities, and a real visit — before it reaches you.",
    color: "#10B981",
    spanClass: "md:col-span-4",
  },
  {
    icon: <Star className="w-7 h-7" />,
    title: "Premium Curation",
    description:
      "Handpicked homes with the amenities students actually ask for. No filler, no surprises.",
    color: "#8B5CF6",
    spanClass: "md:col-span-2",
  },
  {
    icon: <HomeIcon className="w-7 h-7" />,
    title: "Every Type of Stay",
    description:
      "Budget hostels to private studios — filter to exactly the lifestyle and price that fit.",
    color: "#F59E0B",
    spanClass: "md:col-span-2",
  },
  {
    icon: <MapPin className="w-7 h-7" />,
    title: "Close to Campus",
    description:
      "Walkable or a short commute to your university, with transport and daily essentials nearby.",
    color: "#EC4899",
    spanClass: "md:col-span-4",
  },
];

const FeaturesSection = () => {
  return (
    <section
      className="relative py-20 lg:py-28"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent>
          <div className="text-center mb-14 lg:mb-16 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-5 text-sm font-medium rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
              Why students choose us
            </span>
            <h2
              id="features-heading"
              className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight"
            >
              A better way to find your{" "}
              <span className="text-[#A78BFA]">student home</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              We rebuilt the search around the things that actually matter when
              you're moving somewhere new: trust, fit, and location.
            </p>
          </div>
        </AnimatedContent>

        <AnimatedContent delay={0.1}>
          <MagicBento cards={cards} />
        </AnimatedContent>

        <div className="text-center mt-14">
          <Link
            href="/listings"
            prefetch
            className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] shadow-[0_10px_40px_-10px_rgba(139,92,246,0.7)] transition-all duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070510]"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            Start your search
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

export default FeaturesSection;
