'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I know if a property is verified?",
      answer: "All verified properties display a blue verification badge and have been physically inspected by our team. We check 15 different parameters including legal documents, safety features, amenities, and landlord background verification."
    },
    {
      question: "What happens if I need to cancel my booking?",
      answer: "We offer flexible cancellation policies depending on when you cancel. Cancellations made 30+ days before check-in get full refund minus processing fee. 15-30 days gets 50% refund, and less than 15 days gets 25% refund."
    },
    {
      question: "Are there any hidden fees or charges?",
      answer: "No hidden fees! All costs are clearly displayed upfront including rent, security deposit, maintenance charges, and our service fee. What you see is what you pay - complete transparency in pricing."
    },
    {
      question: "Can I visit the property before booking?",
      answer: "Absolutely! We encourage property visits and can arrange them at your convenience. We also offer virtual tours for students who cannot visit in person. All our verified properties have 360° photos and detailed video walkthroughs."
    },
    {
      question: "What if I have issues with my accommodation?",
      answer: "Our 24/7 support team is always ready to help. For minor issues, we coordinate with landlords for quick resolution. For major problems, we can help you relocate to another verified property at no extra cost."
    },
    {
      question: "Do you help with roommate matching?",
      answer: "Yes! Our smart matching algorithm considers your preferences like study habits, lifestyle, and interests to find compatible roommates. We also have a community feature where you can connect with fellow students."
    },
    {
      question: "How secure are my payments?",
      answer: "All payments are processed through bank-grade security with 256-bit SSL encryption. We use secure payment gateways and never store your card details. Your money is held in escrow until you confirm your move-in."
    },
    {
      question: "Can I extend my stay if needed?",
      answer: "Extensions are subject to availability and landlord approval. We recommend discussing extension possibilities before booking. Our team will help coordinate with the property owner for smooth extension process."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-950 relative overflow-hidden">
      {/* Question Mark Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='50' y='70' font-family='serif' font-size='60' text-anchor='middle' fill='%238B5CF6'%3E%3F%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      {/* Help & Support Elements Grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="grid grid-cols-6 gap-12 h-full w-full p-12">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 4 === 0 && (
                <div className="relative">
                  <div className="w-3 h-3 border-2 border-[#8B5CF6] rounded-full animate-pulse" style={{animationDelay: `${i * 0.3}s`, animationDuration: '3s'}}></div>
                  <div className="absolute top-0.5 left-1 w-1 h-2 bg-[#8B5CF6] rounded animate-pulse" style={{animationDelay: `${i * 0.3 + 0.5}s`, animationDuration: '3s'}}></div>
                </div>
              )}
              {i % 4 === 1 && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-3 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.3}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-1 h-2 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.3 + 0.1}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-1 h-4 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.3 + 0.2}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.3 + 0.3}s`, animationDuration: '2.5s'}}></div>
                </div>
              )}
              {i % 4 === 2 && (
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 border border-[#10B981] rounded animate-pulse" style={{animationDelay: `${i * 0.3}s`, animationDuration: '4s'}}></div>
                  <div className="absolute top-1 left-1 w-2 h-1 bg-[#10B981] rounded"></div>
                  <div className="absolute bottom-1 left-0.5 w-3 h-0.5 bg-[#10B981] rounded"></div>
                </div>
              )}
              {i % 4 === 3 && (
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-0.5 h-2 bg-[#F59E0B] rounded animate-pulse" style={{animationDelay: `${i * 0.3}s`, animationDuration: '3.5s'}}></div>
                  <div className="w-2 h-0.5 bg-[#F59E0B] rounded animate-pulse" style={{animationDelay: `${i * 0.3 + 0.2}s`, animationDuration: '3.5s'}}></div>
                  <div className="w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse" style={{animationDelay: `${i * 0.3 + 0.4}s`, animationDuration: '3.5s'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)]"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-bold text-white mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            Frequently Asked <span className="text-[#8B5CF6]">Questions</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            Got questions? We've got answers to help you find your perfect student accommodation
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-[#8B5CF6]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 lg:px-8 py-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-all duration-300"
              >
                <h3 className="font-semibold text-white text-lg lg:text-xl pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openFAQ === index ? (
                    <ChevronUp className="w-6 h-6 text-[#8B5CF6] transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-[#8B5CF6] transition-all duration-300" />
                  )}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 lg:px-8 pb-6 pt-2">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-[#8B5CF6]/30">
            <h3 className="font-bold text-white text-xl lg:text-2xl mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6 text-sm lg:text-base">
              Our friendly support team is here to help 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@smartstay.com" 
                className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#A78BFA] hover:to-[#818CF8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Email Support
              </a>
              <a 
                href="tel:+91-9876543210" 
                className="border-2 border-[#8B5CF6] bg-gray-800/50 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#8B5CF6]/20 transition-all duration-300 hover:scale-105"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
