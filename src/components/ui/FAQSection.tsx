'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

const faqs = [
  {
    question: "How do I know if a property is verified?",
    answer: "Verified properties carry a badge and have been physically inspected by our team. We check 15 parameters including legal documents, safety features, amenities, and landlord background.",
  },
  {
    question: "What happens if I need to cancel my booking?",
    answer: "Cancellation is flexible and depends on timing. 30+ days before check-in gets a full refund minus the processing fee, 15–30 days gets 50%, and under 15 days gets 25%.",
  },
  {
    question: "Are there any hidden fees or charges?",
    answer: "None. Rent, security deposit, maintenance, and our service fee are all shown upfront. What you see is exactly what you pay.",
  },
  {
    question: "Can I visit the property before booking?",
    answer: "Absolutely. We arrange visits at your convenience, and offer virtual tours plus 360° photos and video walkthroughs for students who can't visit in person.",
  },
  {
    question: "What if I have issues with my accommodation?",
    answer: "Our 24/7 team coordinates with landlords for quick fixes. For major problems, we'll help you relocate to another verified property at no extra cost.",
  },
  {
    question: "Do you help with roommate matching?",
    answer: "Yes. Our matching considers study habits, lifestyle, and interests to suggest compatible roommates, and a community feature lets you connect with fellow students.",
  },
  {
    question: "How secure are my payments?",
    answer: "Payments run through bank-grade 256-bit SSL encryption and secure gateways. We never store card details, and funds stay in escrow until you confirm move-in.",
  },
  {
    question: "Can I extend my stay if needed?",
    answer: "Extensions depend on availability and landlord approval. Discuss it before booking and our team will help coordinate a smooth extension with the owner.",
  },
];

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="relative py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent>
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block px-4 py-1.5 mb-5 text-sm font-medium rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
              Questions, answered
            </span>
            <h2
              id="faq-heading"
              className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight"
            >
              Everything you might be wondering
            </h2>
          </div>
        </AnimatedContent>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-[#8B5CF6]/40"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8B5CF6]"
                >
                  <h3 className="font-semibold text-white text-base lg:text-lg">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#A78BFA]' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-300 leading-relaxed text-sm lg:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact support */}
        <AnimatedContent delay={0.1}>
          <div className="text-center mt-12 rounded-2xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/[0.08] backdrop-blur-sm p-8">
            <h3 className="font-display font-semibold text-white text-xl lg:text-2xl mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6 text-sm lg:text-base">
              Our friendly support team is here to help, 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@smartstay.com"
                className="rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] transition-all duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070510]"
              >
                Email support
              </a>
              <a
                href="tel:+91-9876543210"
                className="rounded-xl px-6 py-3 font-semibold text-white border border-[#8B5CF6]/50 bg-white/[0.03] transition-all duration-300 hover:bg-[#8B5CF6]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070510]"
              >
                Call us
              </a>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

export default FAQSection;
