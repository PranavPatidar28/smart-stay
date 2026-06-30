"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Marquee from "@/components/reactbits/Marquee";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

const testimonials = [
  {
    name: "Rahul Verma",
    university: "BITS Pilani",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "As an outstation student, SmartStay made finding a place near campus easy. The photos matched the actual room exactly.",
  },
  {
    name: "Zara Khan",
    university: "St. Xavier's, Mumbai",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    text: "Found a lovely studio in Bandra. The deposit process was transparent and completely hassle-free.",
  },
  {
    name: "Vikram Singh",
    university: "Manipal University",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    text: "WiFi, food, laundry — every amenity I needed was clearly listed. Perfect for a busy medical student.",
  },
  {
    name: "Ananya Rao",
    university: "Christ University, Bengaluru",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    text: "Compared five PGs in an afternoon and booked the same day. It genuinely took the stress out of moving.",
  },
  {
    name: "Aditya Nair",
    university: "VIT Vellore",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "The verified badge gave my parents real confidence. No site visits needed before I signed.",
  },
];

const TestimonialCard = ({ t }: { t: (typeof testimonials)[number] }) => (
  <figure className="mx-3 w-[300px] sm:w-[360px] shrink-0 rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-6 lg:p-7">
    <div className="flex items-center gap-2 mb-4" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 text-[#FBBF24] fill-current"
          aria-hidden="true"
        />
      ))}
    </div>
    <blockquote className="text-gray-200 leading-relaxed text-sm lg:text-base mb-6">
      “{t.text}”
    </blockquote>
    <figcaption className="flex items-center gap-3">
      <Image
        src={t.image}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 rounded-xl object-cover border border-white/10"
        loading="lazy"
      />
      <div>
        <div className="font-semibold text-white text-sm">{t.name}</div>
        <div className="text-gray-400 text-xs">{t.university}</div>
      </div>
    </figcaption>
  </figure>
);

const TestimonialsSection = () => {
  return (
    <section
      className="relative py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <AnimatedContent>
        <div className="text-center mb-14 lg:mb-16 max-w-2xl mx-auto px-4">
          <span className="inline-block px-4 py-1.5 mb-5 text-sm font-medium rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FCD34D]">
            Loved by students
          </span>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight"
          >
            Thousands have found their place
          </h2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
            Real students, real moves, across campuses all over India.
          </p>
        </div>
      </AnimatedContent>

      <Marquee speed={45} pauseOnHover>
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </Marquee>
    </section>
  );
};

export default TestimonialsSection;
