import Navbar from "@/components/ui/Navbar";
import { Search, Shield, Star, MapPin, Users, Home as HomeIcon, CheckCircle, ArrowRight, Building2, Heart, Camera, Lock, Phone } from "lucide-react";
import Link from "next/link";
import DarkVeil from "@/components/animatedBackground/DarkVeil";
import FAQSection from "@/components/ui/FAQSection";
import LightRays from "@/components/animatedBackground/LightRays";
import Image from "next/image";
import InstantNavigationWrapper from "@/components/ui/InstantNavigationWrapper";
// Client components will handle their own state

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

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="w-7 h-7 lg:w-8 lg:h-8" />,
      title: "100% Verified Listings",
      description: "Every property undergoes our rigorous 15-point verification process to ensure quality, safety, and authenticity.",
      gradient: "from-[#10B981] to-[#059669]",
      bgColor: "from-[#10B981]/20 to-[#059669]/20",
      borderColor: "border-[#10B981]/30"
    },
    {
      icon: <Star className="w-7 h-7 lg:w-8 lg:h-8" />,
      title: "Premium Property Curation",
      description: "Handpicked best-in-class properties with premium amenities, verified quality, and exceptional student experiences.",
      gradient: "from-[#8B5CF6] to-[#6366F1]",
      bgColor: "from-[#8B5CF6]/20 to-[#6366F1]/20",
      borderColor: "border-[#8B5CF6]/30"
    },
    {
      icon: <HomeIcon className="w-7 h-7 lg:w-8 lg:h-8" />,
      title: "Diverse Property Types",
      description: "From budget hostels to luxury studios - find the perfect accommodation that fits your lifestyle and budget.",
      gradient: "from-[#F59E0B] to-[#D97706]",
      bgColor: "from-[#F59E0B]/20 to-[#D97706]/20",
      borderColor: "border-[#F59E0B]/30"
    },
    {
      icon: <MapPin className="w-7 h-7 lg:w-8 lg:h-8" />,
      title: "Strategic Locations",
      description: "Properties within walking distance or easy commute to top universities, with access to public transport and amenities.",
      gradient: "from-[#EC4899] to-[#BE185D]",
      bgColor: "from-[#EC4899]/20 to-[#BE185D]/20",
      borderColor: "border-[#EC4899]/30"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden" aria-labelledby="features-heading">
      {/* Feature Icons Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%238B5CF6' stroke-width='1' opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Crect x='70' y='22' width='16' height='16' rx='2'/%3E%3Cpolygon points='30,70 38,70 34,78'/%3E%3Cpath d='M70 70 L78 70 M74 66 L74 74 M70 78 L78 78'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}></div>
      </div>
      
      {/* Tech Elements Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 h-full w-full opacity-10">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 4 === 0 && (
                <div className="w-3 h-3 border border-[#8B5CF6] rounded-full"></div>
              )}
              {i % 4 === 1 && (
                <div className="w-2 h-2 bg-[#10B981] rotate-45"></div>
              )}
              {i % 4 === 2 && (
                <div className="w-3 h-1 bg-[#6366F1] rounded"></div>
              )}
              {i % 4 === 3 && (
                <div className="w-2 h-2 border border-[#F59E0B]"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.04)_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="features-heading" className="font-bold text-white mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            Why Choose <span className="text-[#8B5CF6]">SmartStay</span>?
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
            We're revolutionizing student accommodation with technology, transparency, and trust at every step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`group relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm p-6 lg:p-8 rounded-3xl border ${feature.borderColor} hover:scale-[1.02] transition-all duration-300 overflow-hidden`} role="article" aria-labelledby={`feature-${index}-title`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`} aria-hidden="true">
                  {feature.icon}
                </div>
                
                <h3 id={`feature-${index}-title`} className={`font-bold text-white mb-4 transition-all duration-300 text-xl lg:text-2xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${feature.gradient}`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 lg:mt-16">
          <Link 
            href="/listings" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#A78BFA] hover:to-[#818CF8] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Start searching for student accommodation"
            prefetch={true}
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            Start Your Search
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rahul Verma",
      university: "BITS Pilani",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "As an outstation student, SmartStay made it easy to find accommodation near campus. The photos matched exactly with the actual property!",
      rating: 5
    },
    {
      name: "Zara Khan",
      university: "St. Xavier's College, Mumbai",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      text: "Found a beautiful studio apartment in Bandra through SmartStay. The security deposit process was transparent and hassle-free.",
      rating: 5
    },
    {
      name: "Vikram Singh",
      university: "Manipal University",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      text: "The platform helped me find accommodation with all amenities I needed - WiFi, food, and laundry. Perfect for a medical student!",
      rating: 5
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Testimonial Quote Pattern Background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='60' y='80' font-family='serif' font-size='80' text-anchor='middle' fill='%238B5CF6' opacity='0.1'%3E%22%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}></div>
      </div>
      
      {/* Review Elements Grid */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="grid grid-cols-9 gap-8 h-full w-full p-8">
          {Array.from({ length: 45 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 5 === 0 && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-[#FBBF24] rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`, animationDuration: '2s'}}></div>
                  <div className="w-1 h-1 bg-[#FBBF24] rounded-full animate-pulse" style={{animationDelay: `${i * 0.1 + 0.1}s`, animationDuration: '2s'}}></div>
                  <div className="w-1 h-1 bg-[#FBBF24] rounded-full animate-pulse" style={{animationDelay: `${i * 0.1 + 0.2}s`, animationDuration: '2s'}}></div>
                  <div className="w-1 h-1 bg-[#FBBF24] rounded-full animate-pulse" style={{animationDelay: `${i * 0.1 + 0.3}s`, animationDuration: '2s'}}></div>
                  <div className="w-1 h-1 bg-[#FBBF24] rounded-full animate-pulse" style={{animationDelay: `${i * 0.1 + 0.4}s`, animationDuration: '2s'}}></div>
                </div>
              )}
              {i % 5 === 1 && (
                <div className="w-3 h-3 border border-[#8B5CF6] rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: `${i * 0.1}s`, animationDuration: '3s'}}>
                  <div className="w-1 h-1 bg-[#8B5CF6] rounded-full"></div>
                </div>
              )}
              {i % 5 === 2 && (
                <div className="flex flex-col space-y-0.5">
                  <div className="w-3 h-0.5 bg-[#10B981] rounded animate-pulse" style={{animationDelay: `${i * 0.1}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-2 h-0.5 bg-[#10B981] rounded animate-pulse" style={{animationDelay: `${i * 0.1 + 0.1}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-3 h-0.5 bg-[#10B981] rounded animate-pulse" style={{animationDelay: `${i * 0.1 + 0.2}s`, animationDuration: '2.5s'}}></div>
                </div>
              )}
              {i % 5 === 3 && (
                <div className="w-2 h-2 bg-[#6366F1] transform rotate-45 animate-pulse" style={{animationDelay: `${i * 0.1}s`, animationDuration: '4s'}}></div>
              )}
              {i % 5 === 4 && (
                <div className="relative">
                  <div className="w-3 h-2 border border-[#EC4899] rounded animate-pulse" style={{animationDelay: `${i * 0.1}s`, animationDuration: '3.5s'}}></div>
                  <div className="absolute top-0.5 left-0.5 w-2 h-1 bg-[#EC4899] rounded"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B5CF6]/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(139,92,246,0.05)_100%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="testimonials-heading" className="font-bold text-white mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            What <span className="text-[#8B5CF6]">Students</span> Say
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl">
            Join thousands of satisfied students who found their perfect accommodation across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 p-6 lg:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-800" role="article" aria-labelledby={`testimonial-${index}-name`}>
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Image 
                    src={testimonial.image} 
                    alt={`${testimonial.name} - ${testimonial.university}`}
                    width={56}
                    height={56}
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl object-cover mr-4 shadow-lg border border-gray-800"
                    loading="lazy"
                    priority={false}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 id={`testimonial-${index}-name`} className="font-bold text-white text-base lg:text-lg">{testimonial.name}</h4>
                    <div className="bg-gradient-to-r from-[#6D28D9] to-[#4338CA] rounded-full p-0.5 shadow-md" aria-label="Verified student" role="img">
                      <div className="bg-[#4C1D95] rounded-full w-4 h-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm lg:text-base">{testimonial.university}</p>
                  <div className="flex mt-2" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-200 leading-relaxed italic text-sm lg:text-base">"{testimonial.text}"</blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-white font-medium mb-6 text-sm lg:text-base">
            <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse" aria-hidden="true"></div>
            <span>Peak Booking Season - Limited Availability</span>
          </div>
          
          <h2 id="cta-heading" className="font-bold text-white mb-6 leading-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl max-w-4xl mx-auto">
            Don't Wait - Your Perfect Room is <span className="text-[#FBBF24]">Filling Up Fast!</span>
          </h2>
          
          <p className="text-white/90 mb-8 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
            Join 10,000+ students who found their ideal accommodation. Get instant access to verified properties, 
            secure booking, and 24/7 support. <strong className="text-white">Start your search today!</strong>
          </p>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">10,000+</div>
            <div className="text-white/80 text-sm lg:text-base">Students Found Homes</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#FBBF24] fill-current" aria-hidden="true" />
              ))}
              <span className="text-white/80 text-sm ml-1">4.9/5</span>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80 text-sm lg:text-base">Verified Properties</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Shield className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
              <span className="text-white/80 text-sm">100% Verified</span>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">&lt;24hrs</div>
            <div className="text-white/80 text-sm lg:text-base">Average Response</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <CheckCircle className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
              <span className="text-white/80 text-sm">Fast Support</span>
            </div>
          </div>
        </div>

        {/* Main CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link 
            href="/listings" 
            className="group bg-white text-[#8B5CF6] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-200 shadow-xl hover:scale-105 flex items-center justify-center gap-3 text-lg min-w-[200px]"
            aria-label="Find your perfect student accommodation room now"
            prefetch={true}
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
            Find Your Room Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Link>
          
          <div className="text-center">
            <Link 
              href="/owner-dashboard" 
              className="text-white hover:text-[#FBBF24] transition-colors duration-200 font-semibold text-lg underline decoration-2 underline-offset-4 hover:decoration-[#FBBF24]"
              aria-label="Property owners can list their properties here"
              prefetch={true}
            >
              Property Owner? List Here →
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 text-white/80 text-sm lg:text-base">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#10B981]" aria-hidden="true" />
            <span>100% Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#FBBF24]" aria-hidden="true" />
            <span>Instant Booking Confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#EC4899]" aria-hidden="true" />
            <span>24/7 Student Support</span>
          </div>
        </div>

        {/* Urgency Footer */}
        <div className="text-center mt-8 pt-8 border-t border-white/20">
          <p className="text-white/90 text-sm lg:text-base">
            <strong>Act Fast:</strong> Popular properties get booked within hours. Don't miss out on your perfect student home!
          </p>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-gray-100 py-12 lg:py-16 relative overflow-hidden" role="contentinfo">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <h3 className="font-bold text-[#8B5CF6] mb-4 text-xl lg:text-2xl">SmartStay</h3>
            <p className="text-gray-300 text-sm lg:text-base">
              Helping students find trusted accommodation near their campuses.
            </p>
          </div>
          <nav aria-labelledby="footer-students">
            <h4 id="footer-students" className="font-semibold mb-4 text-white text-base lg:text-lg">For Students</h4>
            <ul className="space-y-2 text-gray-300 text-sm lg:text-base">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Browse Properties</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Find Roommates</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Student Guide</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-landlords">
            <h4 id="footer-landlords" className="font-semibold mb-4 text-white text-base lg:text-lg">For Landlords</h4>
            <ul className="space-y-2 text-gray-300 text-sm lg:text-base">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">List Property</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Property Management</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Landlord Guide</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-support">
            <h4 id="footer-support" className="font-semibold mb-4 text-white text-base lg:text-lg">Support</h4>
            <ul className="space-y-2 text-gray-300 text-sm lg:text-base">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Safety Tips</a></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm lg:text-base">
          <p>&copy; 2025 SmartStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Search & Filter",
      description: "Enter your university or preferred location and filter by budget, amenities, and room type.",
      icon: <Search className="w-8 h-8" />,
      color: "from-[#8B5CF6] to-[#6366F1]"
    },
    {
      step: "02", 
      title: "Browse & Compare",
      description: "View detailed photos, read reviews, and compare properties side by side.",
      icon: <Building2 className="w-8 h-8" />,
      color: "from-[#6366F1] to-[#8B5CF6]"
    },
    {
      step: "03",
      title: "Visit & Verify",
      description: "Schedule visits to shortlisted properties or take virtual tours from anywhere.",
      icon: <Camera className="w-8 h-8" />,
      color: "from-[#10B981] to-[#059669]"
    },
    {
      step: "04",
      title: "Book Securely",
      description: "Pay securely online and get instant confirmation with our verified booking system.",
      icon: <Shield className="w-8 h-8" />,
      color: "from-[#F59E0B] to-[#D97706]"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-950 relative overflow-hidden" aria-labelledby="how-it-works-heading">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(139, 92, 246, 0.1) 35px,
            rgba(139, 92, 246, 0.1) 70px
          ), repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 35px,
            rgba(99, 102, 241, 0.1) 35px,
            rgba(99, 102, 241, 0.1) 70px
          )`
        }}></div>
      </div>
      
      {/* Process Steps Grid */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="grid grid-cols-8 gap-8 h-full w-full p-8">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 4 === 0 && (
                <div className="w-4 h-4 border-2 border-[#8B5CF6] rounded-sm flex items-center justify-center animate-pulse" style={{animationDelay: `${i * 0.2}s`, animationDuration: '3s'}}>
                  <div className="w-1 h-1 bg-[#8B5CF6] rounded-full"></div>
                </div>
              )}
              {i % 4 === 1 && (
                <div className="flex space-x-1">
                  <div className="w-1 h-3 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.2}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-1 h-2 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.2 + 0.1}s`, animationDuration: '2.5s'}}></div>
                  <div className="w-1 h-4 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.2 + 0.2}s`, animationDuration: '2.5s'}}></div>
                </div>
              )}
              {i % 4 === 2 && (
                <div className="relative">
                  <div className="w-3 h-3 border border-[#10B981] rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`, animationDuration: '4s'}}></div>
                  <div className="absolute top-1 left-1 w-1 h-1 bg-[#10B981] rounded-full"></div>
                </div>
              )}
              {i % 4 === 3 && (
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`, animationDuration: '3.5s'}}></div>
                  <div className="w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse" style={{animationDelay: `${i * 0.2 + 0.1}s`, animationDuration: '3.5s'}}></div>
                  <div className="w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse" style={{animationDelay: `${i * 0.2 + 0.2}s`, animationDuration: '3.5s'}}></div>
                  <div className="w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse" style={{animationDelay: `${i * 0.2 + 0.3}s`, animationDuration: '3.5s'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="how-it-works-heading" className="font-bold text-white mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            How <span className="text-[#8B5CF6]">SmartStay</span> Works
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            Finding your perfect student accommodation has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10" aria-hidden="true">
                {step.step}
              </div>
              
              {/* Main Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-gray-700 hover:border-[#8B5CF6]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] h-full" role="article" aria-labelledby={`step-${index}-title`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`} aria-hidden="true">
                  {step.icon}
                </div>
                
                <h3 id={`step-${index}-title`} className="font-bold text-white mb-4 text-xl lg:text-2xl group-hover:text-[#8B5CF6] transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 text-sm lg:text-base">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#8B5CF6] to-transparent transform -translate-y-1/2" aria-hidden="true"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Property Types Section
const PropertyTypesSection = () => {
  const propertyTypes = [
    {
      type: "Student Hostels",
      description: "Affordable shared accommodation with meal plans and study areas",
      features: ["Meals included", "Study rooms", "Security", "Laundry"],
      priceRange: "₹8,000 - ₹15,000",
      icon: <Users className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      gradient: "from-[#8B5CF6] to-[#6366F1]"
    },
    {
      type: "Private PGs", 
      description: "Individual rooms with shared common areas and flexible meal options",
      features: ["Private rooms", "Flexible meals", "WiFi", "Housekeeping"],
      priceRange: "₹12,000 - ₹25,000",
      icon: <HomeIcon className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      gradient: "from-[#10B981] to-[#059669]"
    },
    {
      type: "Shared Apartments",
      description: "Split apartments with roommates, perfect for independence with affordability",
      features: ["Shared kitchen", "Living room", "Balcony", "Parking"],
      priceRange: "₹15,000 - ₹30,000", 
      icon: <Building2 className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      gradient: "from-[#F59E0B] to-[#D97706]"
    },
    {
      type: "Studio Apartments",
      description: "Complete privacy with your own kitchen, bathroom, and living space",
      features: ["Private kitchen", "Own bathroom", "Fully furnished", "Privacy"],
      priceRange: "₹20,000 - ₹40,000",
      icon: <Heart className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop", 
      gradient: "from-[#EC4899] to-[#BE185D]"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-900 relative overflow-hidden" aria-labelledby="property-types-heading">
      {/* LightRays Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="property-types-heading" className="font-bold text-white mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            Choose Your <span className="text-[#8B5CF6]">Perfect</span> Accommodation
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            From budget hostels to luxury studios - find what fits your lifestyle and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {propertyTypes.map((property, index) => (
            <div key={index} className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-[#8B5CF6]/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]" role="article" aria-labelledby={`property-${index}-title`}>
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={property.image} 
                  alt={`${property.type} - ${property.description}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Icon Badge */}
                <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${property.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                  {property.icon}
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <span className="text-white font-semibold text-sm">{property.priceRange}</span>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <h3 id={`property-${index}-title`} className="font-bold text-white text-xl lg:text-2xl mb-3 group-hover:text-[#8B5CF6] transition-colors duration-300">
                  {property.type}
                </h3>
                
                <p className="text-gray-300 mb-4 leading-relaxed text-sm lg:text-base group-hover:text-gray-200 transition-colors duration-300">
                  {property.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/listings" className={`w-full bg-gradient-to-r ${property.gradient} hover:shadow-lg text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm lg:text-base`} aria-label={`Find ${property.type} accommodation`} prefetch={true}>
                  <Search className="w-4 h-4" aria-hidden="true" />
                  Find {property.type}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Safety & Security Section
const SafetySection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-950 relative overflow-hidden" aria-labelledby="safety-heading">
      {/* Shield Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12 2L3 7L12 22L21 7L12 2Z' stroke='%2310B981' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      {/* Security Icons Grid */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="grid grid-cols-8 gap-10 h-full w-full p-10">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 4 === 0 && (
                <div className="relative">
                  <div className="w-4 h-5 border border-[#10B981] rounded-t animate-pulse" style={{animationDelay: `${i * 0.25}s`, animationDuration: '3s'}}></div>
                  <div className="w-5 h-1 bg-[#10B981] rounded-b"></div>
                  <div className="absolute top-1 left-1 w-2 h-2 border border-[#10B981] rounded"></div>
                </div>
              )}
              {i % 4 === 1 && (
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 border-2 border-[#8B5CF6] rounded-full animate-pulse" style={{animationDelay: `${i * 0.25}s`, animationDuration: '2.5s'}}></div>
                  <div className="absolute top-1 left-1.5 w-0.5 h-2 bg-[#8B5CF6] rounded"></div>
                  <div className="absolute bottom-1 left-1 w-2 h-0.5 bg-[#8B5CF6] rounded"></div>
                </div>
              )}
              {i % 4 === 2 && (
                <div className="grid grid-cols-3 gap-0.5">
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.25}s`, animationDuration: '4s'}}></div>
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.25 + 0.1}s`, animationDuration: '4s'}}></div>
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.25 + 0.2}s`, animationDuration: '4s'}}></div>
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.25 + 0.3}s`, animationDuration: '4s'}}></div>
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.25 + 0.4}s`, animationDuration: '4s'}}></div>
                  <div className="w-1 h-1 bg-[#6366F1] rounded animate-pulse" style={{animationDelay: `${i * 0.25 + 0.5}s`, animationDuration: '4s'}}></div>
                </div>
              )}
              {i % 4 === 3 && (
                <div className="relative">
                  <div className="w-3 h-4 border border-[#F59E0B] rounded animate-pulse" style={{animationDelay: `${i * 0.25}s`, animationDuration: '3.5s'}}></div>
                  <div className="absolute top-1 left-0.5 w-2 h-1 bg-[#F59E0B] rounded"></div>
                  <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#F59E0B] rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Concentric Security Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#10B981]/5 rounded-full" aria-hidden="true"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#10B981]/8 rounded-full" aria-hidden="true"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#10B981]/10 rounded-full" aria-hidden="true"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="safety-heading" className="font-bold text-white mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            Safe & <span className="text-[#8B5CF6]">Secure</span> Booking
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            Your safety and peace of mind are our top priorities throughout your accommodation journey
          </p>
        </div>

        {/* Main Safety Features */}
        <div className="bg-gradient-to-br from-[#10B981]/10 to-[#8B5CF6]/10 backdrop-blur-sm rounded-3xl border border-[#10B981]/20 p-8 lg:p-12 mb-12 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left side - Verification Process */}
            <div className="text-center lg:text-left group">
              <div className="w-20 h-20 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]" aria-hidden="true">
                <Shield className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h3 className="font-bold text-white text-2xl lg:text-3xl mb-4 group-hover:text-[#34D399] transition-colors duration-300">
                Every Property Verified
              </h3>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                Our team personally visits and verifies each property to ensure it matches photos, 
                meets safety standards, and provides the quality you expect.
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[#34D399] font-semibold group-hover:scale-105 transition-transform duration-300">
                <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
                <span>100% Verified Properties</span>
              </div>
            </div>

            {/* Right side - Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:bg-gray-800/70 hover:border-[#8B5CF6]/50 hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-300 group cursor-pointer" role="button" tabIndex={0} aria-label="Learn about secure payments">
                <Lock className="w-8 h-8 text-[#8B5CF6] mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" aria-hidden="true" />
                <h4 className="font-bold text-white text-lg mb-2 group-hover:text-[#8B5CF6] transition-colors duration-300">Secure Payments</h4>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Safe online transactions with encryption</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:bg-gray-800/70 hover:border-[#F59E0B]/50 hover:scale-105 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300 group cursor-pointer" role="button" tabIndex={0} aria-label="Learn about 24/7 support">
                <Phone className="w-8 h-8 text-[#F59E0B] mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" aria-hidden="true" />
                <h4 className="font-bold text-white text-lg mb-2 group-hover:text-[#F59E0B] transition-colors duration-300">24/7 Support</h4>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Always here when you need help</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:bg-gray-800/70 hover:border-[#6366F1]/50 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-300 group cursor-pointer" role="button" tabIndex={0} aria-label="Learn about trusted owners">
                <Users className="w-8 h-8 text-[#6366F1] mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" aria-hidden="true" />
                <h4 className="font-bold text-white text-lg mb-2 group-hover:text-[#6366F1] transition-colors duration-300">Trusted Owners</h4>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">All landlords background verified</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:bg-gray-800/70 hover:border-[#10B981]/50 hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300 group cursor-pointer" role="button" tabIndex={0} aria-label="Learn about transparent pricing">
                <CheckCircle className="w-8 h-8 text-[#10B981] mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" aria-hidden="true" />
                <h4 className="font-bold text-white text-lg mb-2 group-hover:text-[#10B981] transition-colors duration-300">Transparent Pricing</h4>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">No hidden fees or surprises</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-300 mb-6 text-lg">
            Ready to find your perfect student accommodation?
          </p>
          <Link 
            href="/listings" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Browse verified properties for student accommodation"
            prefetch={true}
          >
            <Shield className="w-5 h-5" aria-hidden="true" />
            Browse Verified Properties
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};



export default function Home() {
  return (
    <InstantNavigationWrapper>
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SafetySection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
        <Footer />
      </div>
    </InstantNavigationWrapper>
  );
}
