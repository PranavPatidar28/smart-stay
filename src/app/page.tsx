import Navbar from "@/components/ui/Navbar";
import { Search, Shield, Star, CheckCircle } from "lucide-react";
import DarkVeil from "@/components/animatedBackground/DarkVeil";
import FAQSection from "@/components/ui/FAQSection";
import Image from "next/image";
import InstantNavigationWrapper from "@/components/ui/InstantNavigationWrapper";
import AmbientBackground from "@/components/landing/AmbientBackground";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SafetySection from "@/components/landing/SafetySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import ShinyText from "@/components/reactbits/ShinyText";

const HeroSection = () => {
  return (
    <div className="w-full bg-black relative overflow-hidden min-h-[100svh] lg:min-h-[100vh]">
      <div className="absolute inset-0 pointer-events-none">
        <DarkVeil
          hueShift={20}
          noiseIntensity={0.02}
          scanlineIntensity={0.5}
          scanlineFrequency={1}
          warpAmount={0.1}
          speed={0.35}
          resolutionScale={1}
        />
      </div>

      {/* Subtle overlays to integrate beams and improve contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1C]/70 via-transparent to-[#0B0F1C]/40" />
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(80%_80%_at_50%_40%,black,transparent_70%)]" />

      {/* Desktop Hero Section (lg and above) */}
      <div className="hidden lg:flex relative z-10 items-center justify-center w-full min-h-[100vh] py-8 xl:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-y-8 gap-x-8 xl:gap-x-16 2xl:gap-x-20 items-center justify-center min-h-[70vh] max-w-7xl mx-auto relative">



            {/* Left Side: Content */}
            <div className="flex flex-col justify-center items-start hero-content-fade-in max-w-2xl mx-auto">
              <div className="mb-8 hero-content-item text-center lg:text-left" style={{animationDelay: '0.5s'}}>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 backdrop-blur-md rounded-full border border-[#8B5CF6]/30 text-[#A78BFA] font-medium mb-6 text-sm lg:text-base">
                  Smart, safe, and Secured
                </div>
                <h1 className="font-bold text-white mb-6 leading-tight max-w-3xl text-4xl lg:text-6xl xl:text-6xl 2xl:text-6xl">
                  Find Your Perfect
                  <span className="shining-text block">
                    Student Home
                  </span>
                </h1>
                <p className="text-gray-300 mb-8 max-w-2xl leading-relaxed font-medium text-lg lg:text-xl xl:text-xl">
                Discover verified Hostels, PGs, and Flats near your campus.
                Because finding a room shouldn't feel like an exam.
                </p>
                {/* Search Bar */}
          <form action="/listings" method="GET" className="w-full max-w-4xl mx-auto mb-8 hero-content-item" role="search" aria-label="Search for student accommodation">
            <div className="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border border-gray-800/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by university, city, or hostel"
                    autoComplete="off"
                    aria-label="Search by university, city, or hostel"
                    className="w-full pl-4 sm:pl-6 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base rounded-2xl bg-gray-900/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-gray-900 transition-all duration-200 shadow-lg"
                  />
                </div>
                <button type="submit" aria-label="Search for accommodation" className="group relative overflow-hidden bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] hover:from-[#A78BFA] hover:via-[#8B5CF6] hover:to-[#818CF8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.6)] hover:scale-105 text-sm sm:text-base whitespace-nowrap border border-[#8B5CF6]/30 hover:border-[#A78BFA]/50">
                  {/* Animated background shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>

                  {/* Icon with animation */}
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />

                  {/* Text with gradient effect */}
                  <span className="hidden sm:inline relative z-10 bg-gradient-to-r from-white to-[#F3E8FF] bg-clip-text text-transparent font-extrabold">
                    Explore
                  </span>
                  <span className="sm:hidden relative z-10 bg-gradient-to-r from-white to-[#F3E8FF] bg-clip-text text-transparent font-extrabold">
                    Search
                  </span>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </form>
              </div>



              {/* Enhanced Trust Indicators with Stats */}
              <div className="hero-content-item" style={{animationDelay: '1.1s'}}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-8 text-gray-200 font-light text-sm lg:text-base mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" aria-hidden="true" />
                    <span>Trusted by 10,000+ students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#A78BFA]" aria-hidden="true" />
                    <span>Verified listings onlys</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#818CF8]" aria-hidden="true" />
                    <span>24/7 support
                    </span>
                  </div>
                </div>

              </div>
            </div>
            {/* Right Side: Image */}
            <div className="flex items-center justify-center hero-content-item w-full max-w-xl m-auto" style={{animationDelay: '1s'}}>
              <div className="relative group w-full flex justify-center">
                {/* Staggered Image Layout */}
                <div className="relative w-full max-w-lg lg:max-w-xl h-[400px] lg:h-[480px] xl:h-[520px]">
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 rounded-3xl blur-2xl opacity-60"></div>

                  {/* Image 1 - Bottom Left */}
                  <div className="absolute -bottom-4 lg:-bottom-6 left-2 lg:left-4 w-48 h-64 lg:w-60 lg:h-80 xl:w-64 xl:h-84 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#312E81]/40 hover:scale-105 hover:-rotate-1 transition-transform duration-200 ease-out hover:border-[#8B5CF6]/60 z-10 hover:z-20">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/50 via-transparent to-transparent rounded-2xl"></div>

                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#6366F1]/55 to-[#8B5CF6]/55 backdrop-blur-xl px-2 py-1 rounded-2xl border border-[#6366F1]/40 shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-105 transition-all duration-300 ease-out min-w-[90px] z-40 hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] group">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-[#F3E8FF] transition-colors duration-300">50+</div>
                    <div className="text-[#DDD6FE] text-xs font-semibold group-hover:text-white transition-colors duration-300">Cities</div>
                  </div>
                </div>

                    <Image
                      src="/images/Gemini_Generated_Image_LandingPage.png"
                      alt="Student Accommodation in a modern city setting"
                      width={192}
                      height={256}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      priority={false}
                    />
                  </div>

                  {/* Image 2 - Top Right */}
                  <div className="absolute -top-4 lg:-top-6 right-1 lg:right-2 w-48 h-64 lg:w-60 lg:h-80 xl:w-64 xl:h-84 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#312E81]/40 hover:scale-105 hover:-rotate-1 transition-transform duration-200 ease-out hover:border-[#8B5CF6]/60 z-10 hover:z-20">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/50 via-transparent to-transparent rounded-2xl"></div>

                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#6366F1]/55 to-[#8B5CF6]/55 backdrop-blur-xl px-2 py-1 rounded-2xl border border-[#6366F1]/40 shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-105 transition-all duration-300 ease-out min-w-[90px] z-40 hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] group">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-[#F3E8FF] transition-colors duration-300">500+</div>
                    <div className="text-[#DDD6FE] text-xs font-semibold group-hover:text-white transition-colors duration-300">Properties</div>
                  </div>
                </div>

                    <Image
                      src="/images/Gemini_Generated_Image_plv6quplv6quplv6.png"
                      alt="Premium student accommodation with modern amenities"
                      width={192}
                      height={256}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      priority={false}
                    />
                  </div>

                  {/* Image 3 - Center (Main) */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 lg:w-80 lg:h-[27.5rem] xl:w-84 xl:h-[30rem] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#8B5CF6]/50 hover:scale-105 hover:rotate-1 transition-transform duration-200 ease-out hover:border-[#A78BFA]/80 z-10 hover:z-30">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/50 via-transparent to-transparent rounded-2xl"></div>
                    <Image
                      src="/images/Gemini_Generated_Image_4chicb4chicb4chi.png"
                      alt="Featured luxury student accommodation with premium features"
                      width={256}
                      height={320}
                      className="w-full h-full object-cover"
                      loading="eager"
                      priority={true}
                    />
                    {/* Featured Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#8B5CF6]/90 to-[#6366F1]/90 px-3 py-1.5 flex items-center justify-center rounded-full shadow-lg">
                      <span className="text-white text-xs font-bold text-center">FEATURED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Hero Section (below lg) */}
      <div className="lg:hidden relative z-10 flex flex-col items-center justify-center w-full min-h-[100svh] px-4 py-8">
        <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center h-full relative">

          {/* Trust Badge */}
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 backdrop-blur-md rounded-full border border-[#8B5CF6]/30 text-[#A78BFA] font-medium mb-6 mt-6 text-sm lg:text-base">
            Smart, safe, and Secured
          </div>

          {/* Main Heading */}
          <h1 className="font-bold text-white mb-6 leading-tight max-w-3xl text-6xl lg:text-6xl xl:text-6xl 2xl:text-6xl">
            Find Your Perfect
            <span className="shining-text block">
              Student Home
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 mb-8 max-w-2xl leading-relaxed font-medium text-lg lg:text-xl">
            Discover verified Hostels, PGs, and Flats near your campus.
            Because finding a room shouldn't feel like an exam.
          </p>

          {/* Mobile Search Bar */}
          <form action="/listings" method="GET" className="w-full max-w-4xl mx-auto mb-8" role="search" aria-label="Search for student accommodation">
            <div className="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border border-gray-800/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by university, city, or hostel"
                    autoComplete="off"
                    aria-label="Search by university, city, or hostel"
                    className="w-full pl-4 sm:pl-6 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base rounded-2xl bg-gray-900/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-gray-900 transition-all duration-200 shadow-lg"
                  />
                </div>
                <button type="submit" aria-label="Search for accommodation" className="group relative overflow-hidden bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] hover:from-[#A78BFA] hover:via-[#8B5CF6] hover:to-[#818CF8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.6)] hover:scale-105 text-sm sm:text-base whitespace-nowrap border border-[#8B5CF6]/30 hover:border-[#A78BFA]/50">
                  {/* Animated background shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>

                  {/* Icon with animation */}
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />

                  {/* Text with gradient effect */}
                  <span className="hidden sm:inline relative z-10 bg-gradient-to-r from-white to-[#F3E8FF] bg-clip-text text-transparent font-extrabold">
                    Explore
                  </span>
                  <span className="sm:hidden relative z-10 bg-gradient-to-r from-white to-[#F3E8FF] bg-clip-text text-transparent font-extrabold">
                    Search
                  </span>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </form>


          {/* Mobile Staggered Images */}
          <div className="relative mb-8 w-full max-w-md sm:max-w-lg md:max-w-xl h-[320px] sm:h-[360px] md:h-[420px]">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 rounded-2xl blur-xl opacity-60"></div>

            {/* Mobile Image 1 - Bottom Left */}
            <div className="absolute bottom-1 left-1 w-36 h-44 sm:w-40 sm:h-48 md:w-44 md:h-52 rounded-xl overflow-hidden shadow-xl border border-[#312E81]/40 hover:scale-105 hover:rotate-1 transition-transform duration-200 ease-out hover:border-[#8B5CF6]/60 z-10 hover:z-20">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/50 via-transparent to-transparent rounded-xl"></div>
              <Image
                src="/images/Gemini_Generated_Image_LandingPage.png"
                alt="Student accommodation in city setting"
                width={128}
                height={160}
                className="w-full h-full object-cover"
                loading="lazy"
                priority={false}
              />
            </div>

            {/* Mobile Image 2 - Top Right */}
            <div className="absolute top-1 right-1 w-36 h-48 sm:w-40 sm:h-52 md:w-44 md:h-56 rounded-xl overflow-hidden shadow-xl border border-[#312E81]/40 hover:scale-105 hover:-rotate-1 transition-transform duration-200 ease-out hover:border-[#8B5CF6]/60 z-10 hover:z-20">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/50 via-transparent to-transparent rounded-xl"></div>
              <Image
                src="/images/Gemini_Generated_Image_plv6quplv6quplv6.png"
                alt="Premium student accommodation"
                width={144}
                height={192}
                className="w-full h-full object-cover"
                loading="lazy"
                priority={false}
              />
            </div>

            {/* Mobile Image 3 - Center (Main) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-56 sm:w-52 sm:h-60 md:w-56 md:h-64 rounded-xl overflow-hidden shadow-xl border-2 border-[#8B5CF6]/50 hover:scale-105 hover:rotate-1 transition-transform duration-200 ease-out hover:border-[#A78BFA]/80 z-20 hover:z-30">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/50 via-transparent to-transparent rounded-xl"></div>
              <Image
                src="/images/Gemini_Generated_Image_4chicb4chicb4chi.png"
                alt="Featured luxury student accommodation"
                width={192}
                height={224}
                className="w-full h-full object-cover"
                loading="eager"
                priority={true}
              />
              {/* Featured Badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-[#8B5CF6]/90 to-[#6366F1]/90 px-3 py-0.5 rounded-full shadow-lg">
                      <span className="text-white text-xs font-bold text-center">FEATURED</span>
                    </div>
            </div>
          </div>

          {/* Mobile Enhanced Trust Indicators with Stats */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 text-gray-200 font-light text-sm sm:text-base">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" aria-hidden="true" />
                <span>Trusted by 10,000+ students</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-[#A78BFA]" aria-hidden="true" />
                <span>Verified listings only</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#818CF8]" aria-hidden="true" />
                <span>24/7 support</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative bg-[#070510]/80 backdrop-blur-sm text-gray-100 py-14 lg:py-16 border-t border-white/10" role="contentinfo">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold mb-4 text-2xl">
              <ShinyText text="SmartStay" speed={5} />
            </h3>
            <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
              Helping students find trusted accommodation near their campuses.
            </p>
          </div>
          <nav aria-labelledby="footer-students">
            <h4 id="footer-students" className="font-semibold mb-4 text-white text-base lg:text-lg">For Students</h4>
            <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Browse Properties</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Find Roommates</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Student Guide</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-landlords">
            <h4 id="footer-landlords" className="font-semibold mb-4 text-white text-base lg:text-lg">For Landlords</h4>
            <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">List Property</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Property Management</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Landlord Guide</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-support">
            <h4 id="footer-support" className="font-semibold mb-4 text-white text-base lg:text-lg">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Safety Tips</a></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center text-gray-500 text-sm lg:text-base">
          <p>&copy; 2025 SmartStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <InstantNavigationWrapper>
      <div className="min-h-screen relative">
        <Navbar />
        <HeroSection />
        {/* Shared ambient backdrop unifies every section below the hero */}
        <div className="relative">
          <AmbientBackground />
          <FeaturesSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <CTASection />
          <FAQSection />
          <Footer />
        </div>
      </div>
    </InstantNavigationWrapper>
  );
}
