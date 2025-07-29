import Navbar from "@/components/ui/Navbar";
import HeroBackgroundArt from "@/components/ui/HeroBackgroundArt";
import { Search, Shield, Star, MapPin, Users, Home as HomeIcon, CheckCircle, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="min-h-screen w-full bg-[#030712] relative overflow-hidden">
      {/* Dark Mesh Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] opacity-60"
        style={{ mixBlendMode: 'hard-light' }}
      ></div>
      
      {/* Animated Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#4C1D95] via-transparent to-[#312E81] opacity-40 animate-pulse"
        style={{ animationDuration: '8s' }}
      ></div>

      {/* 3D Perspective Grid */}
      <div className="absolute inset-0 perspective-grid">
        <div className="grid-overlay"></div>
        <div className="horizontal-lines"></div>
        <div className="vertical-lines"></div>
      </div>
      
      {/* Static Grid for Mobile */}
      <div className="mobile-static-grid"></div>
      
      {/* Particle Effects/Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4C1D95] filter blur-[80px] opacity-20 animate-blob"></div>
      <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-[#312E81] filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-[#6D28D9] filter blur-[90px] opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Small Floating Orbs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-full opacity-30 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full opacity-40 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-[#A78BFA] to-[#818CF8] rounded-full opacity-35 animate-float animation-delay-4000"></div>
      
      {/* Desktop Hero Section (lg and above) */}
      <div className="hidden lg:flex relative z-10 items-center justify-center w-full min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-y-16 gap-x-30 items-center justify-center min-h-[60vh] max-w-7xl mx-auto">
            {/* Left Side: Content */}
            <div className="flex flex-col justify-center items-start hero-content-fade-in max-w-2xl mx-auto">
              <div className="mb-8 hero-content-item text-center lg:text-left" style={{animationDelay: '0.5s'}}>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 backdrop-blur-md rounded-full border border-[#8B5CF6]/30 text-[#A78BFA] font-medium text-sm mb-6">
                  Smart, safe, and Secured
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-3xl">
                  Find Your Perfect
                  <span className="shining-text block">
                    Student Home
                  </span>
                </h1>
                                 <p className="text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed font-medium">
                Discover verified Hostels, PGs, and Flats near your campus.
                Because finding a room shouldn't feel like an exam.
                </p>
                {/* Search Bar */}
          <form action="/listings" method="GET" className="w-full max-w-4xl mx-auto mb-8 hero-content-item">
            <div className="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border border-gray-800/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    name="search"
                    placeholder="Search by university, city, or hostel"
                    autoComplete="off"
                    className="w-full pl-4 sm:pl-6 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base rounded-2xl bg-gray-900/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-gray-900 transition-all duration-300 shadow-lg"
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#A78BFA] hover:to-[#818CF8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base whitespace-nowrap">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Explore</span>
                  <span className="sm:hidden">Search</span>
                </button>
              </div>
            </div>
          </form>
              </div>
              
          

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 text-gray-200 text-sm font-medium hero-content-item" style={{animationDelay: '1.1s'}}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>Trusted by 10,000+ students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#A78BFA]" />
                  <span>Verified listings only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#818CF8]" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
            {/* Right Side: Image */}
            <div className="flex items-center justify-center hero-content-item w-full max-w-xl m-auto" style={{animationDelay: '1.2s'}}>
              <div className="relative group w-full flex justify-center">
                {/* Staggered Image Layout */}
                <div className="relative w-full max-w-lg h-[480px]">
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/30 to-[#6366F1]/30 rounded-3xl blur-2xl opacity-80 animate-pulse" style={{animationDuration: '8s', animationTimingFunction: 'ease-in-out'}}></div>
                  
                  {/* Image 1 - Bottom Left */}
                  <div className="absolute bottom-4 left-2 w-52 h-68 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-125 hover:z-30 hover:rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] border-2 border-[#312E81]/40 hover:border-[#8B5CF6]/80 transition-colors duration-300 ease-in-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-2xl"></div>
                    <img 
                      src="/images/Gemini_Generated_Image_LandingPage.png" 
                      alt="Student Accommodation 1" 
                      className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-2xl"></div>
                    {/* Floating Label */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                      <span className="text-white text-xs font-medium">Premium Hostel</span>
                    </div>
                  </div>

                  {/* Image 2 - Top Right */}
                  <div className="absolute top-2 right-2 w-56 h-76 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-125 hover:z-30 hover:-rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] border-2 border-[#312E81]/40 hover:border-[#8B5CF6]/80 transition-colors duration-300 ease-in-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-2xl"></div>
                    <img 
                      src="/images/Gemini_Generated_Image_p5v7j7p5v7j7p5v7.png" 
                      alt="Student Accommodation 2" 
                      className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-2xl"></div>
                    {/* Floating Label */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                      <span className="text-white text-xs font-medium">Student PG</span>
                    </div>
                  </div>

                  {/* Image 3 - Center (Main) */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-88 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-125 hover:z-30 hover:rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_50px_rgba(139,92,246,0.7)] border-2 border-[#8B5CF6]/60 hover:border-[#A78BFA] transition-colors duration-300 ease-in-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-2xl"></div>
                    <img 
                      src="/images/Gemini_Generated_Image_plv6quplv6quplv6.png" 
                      alt="Student Accommodation 3" 
                      className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/40 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-2xl"></div>
                    {/* Featured Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-3 py-1.5 rounded-full shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300 ease-out">
                      <span className="text-white text-xs font-bold">FEATURED</span>
                    </div>
                    {/* Floating Label */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                      <span className="text-white text-xs font-medium">Luxury Apartment</span>
                    </div>
                  </div>

                  {/* Image 4 - Bottom Right */}
                  <div className="absolute bottom-8 right-8 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-125 hover:z-30 hover:-rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] border-2 border-[#312E81]/40 hover:border-[#8B5CF6]/80 transition-colors duration-300 ease-in-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-2xl"></div>
                    <img 
                      src="/images/Gemini_Generated_Image_rhc46nrhc46nrhc4.png" 
                      alt="Student Accommodation 4" 
                      className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-2xl"></div>
                    {/* Floating Label */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                      <span className="text-white text-xs font-medium">Shared Room</span>
                    </div>
                  </div>

                  {/* Animated Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <defs>
                      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6"/>
                      </linearGradient>
                    </defs>
                    <path d="M 100 300 Q 200 200 300 100" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDuration: '4s', animationTimingFunction: 'ease-in-out'}}/>
                    <path d="M 300 100 Q 400 200 500 300" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDuration: '5s', animationTimingFunction: 'ease-in-out'}}/>
                  </svg>

                  {/* Floating Particles */}
                  <div className="absolute top-10 left-10 w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce opacity-60" style={{animationDuration: '2s', animationTimingFunction: 'ease-in-out'}}></div>
                  <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-[#6366F1] rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s', animationDuration: '2.5s', animationTimingFunction: 'ease-in-out'}}></div>
                  <div className="absolute bottom-20 left-20 w-1 h-1 bg-[#A78BFA] rounded-full animate-bounce opacity-60" style={{animationDelay: '1s', animationDuration: '3s', animationTimingFunction: 'ease-in-out'}}></div>
                </div>

                {/* Enhanced Floating Stats Cards */}
                <div className="absolute -top-8 -left-8 bg-gradient-to-r from-[#8B5CF6]/95 to-[#6366F1]/95 backdrop-blur-xl p-5 rounded-2xl border border-[#8B5CF6]/40 shadow-[0_0_25px_rgba(139,92,246,0.4)] transform group-hover:scale-110 transition-all duration-500 ease-out floating-card min-w-[120px] z-40 hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:border-[#A78BFA]/60">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-[#DDD6FE] text-sm font-medium">Properties</div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#818CF8] mx-auto mt-2 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-[#6366F1]/95 to-[#8B5CF6]/95 backdrop-blur-xl p-5 rounded-2xl border border-[#6366F1]/40 shadow-[0_0_25px_rgba(99,102,241,0.4)] transform group-hover:scale-110 transition-all duration-500 ease-out floating-card min-w-[120px] z-40 hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:border-[#818CF8]/60">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">50+</div>
                    <div className="text-[#DDD6FE] text-sm font-medium">Cities</div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#818CF8] to-[#A78BFA] mx-auto mt-2 rounded-full"></div>
                  </div>
                </div>
                {/* Enhanced Verification Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#10B981]/95 to-[#059669]/95 backdrop-blur-xl p-4 rounded-full border border-[#10B981]/40 shadow-[0_0_20px_rgba(16,185,129,0.4)] badge-pulse z-40 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-110 hover:border-[#4ADE80]/60 transition-all duration-300 ease-out">
                  <Shield className="w-6 h-6 text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#4ADE80] rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hero Section (below lg) */}
      <div className="lg:hidden relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-4 py-8">
        <div className="w-full max-w-md mx-auto text-center flex flex-col items-center justify-center min-h-[80vh]">
          {/* Trust Badge */}
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6366F1]/20 backdrop-blur-md rounded-full border border-[#8B5CF6]/30 text-[#A78BFA] font-medium text-sm mb-6 mt-6">
          Smart, safe, and Secured
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect
            <span className="shining-text block mt-2">
              Student Home
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-100 mb-8 leading-relaxed font-medium">
            Discover verified Hostels, PGs, and Flats near your campus.
            Because finding a room shouldn't feel like an exam.
          </p>

          {/* Mobile Search Bar */}
          <form action="/listings" method="GET" className="w-full max-w-md mx-auto mb-8">
            <div className="bg-gray-900/20 backdrop-blur-xl rounded-2xl p-2 border border-gray-800/40 shadow-2xl">
              <div className="flex flex-col gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    name="search"
                    placeholder="Search by university, city, or hostel"
                    autoComplete="off"
                    className="w-full pl-4 pr-4 py-3 text-base rounded-xl bg-gray-900/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-gray-900 transition-all duration-300 shadow-lg"
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#A78BFA] hover:to-[#818CF8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 text-base">
                  <Search className="w-5 h-5" />
                  Explore
                </button>
              </div>
            </div>
          </form>

         
          {/* Enhanced Mobile Staggered Images */}
          <div className="relative mb-8 w-full max-w-md h-[360px]">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/30 to-[#6366F1]/30 rounded-2xl blur-xl opacity-80 animate-pulse" style={{animationDuration: '8s', animationTimingFunction: 'ease-in-out'}}></div>
            
            {/* Mobile Image 1 - Bottom Left */}
            <div className="absolute bottom-2 left-1 w-36 h-44 rounded-xl overflow-hidden shadow-xl transform hover:scale-125 hover:z-30 hover:rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] border border-[#312E81]/40 hover:border-[#8B5CF6]/80 transition-colors duration-300 ease-in-out">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-xl"></div>
              <img 
                src="/images/Gemini_Generated_Image_LandingPage.png" 
                alt="Student Accommodation 1" 
                className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-xl"></div>
              {/* Floating Label */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                <span className="text-white text-xs font-medium">Premium</span>
              </div>
            </div>

            {/* Mobile Image 2 - Top Right */}
            <div className="absolute top-1 right-1 w-40 h-52 rounded-xl overflow-hidden shadow-xl transform hover:scale-125 hover:z-30 hover:-rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] border border-[#312E81]/40 hover:border-[#8B5CF6]/80 transition-colors duration-300 ease-in-out">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-xl"></div>
              <img 
                src="/images/Gemini_Generated_Image_p5v7j7p5v7j7p5v7.png" 
                alt="Student Accommodation 2" 
                className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-xl"></div>
              {/* Floating Label */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                <span className="text-white text-xs font-medium">Student PG</span>
              </div>
            </div>

            {/* Mobile Image 3 - Center (Main) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-56 rounded-xl overflow-hidden shadow-xl transform hover:scale-125 hover:z-30 hover:rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] border-2 border-[#8B5CF6]/60 hover:border-[#A78BFA] transition-colors duration-300 ease-in-out">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-xl"></div>
              <img 
                src="/images/Gemini_Generated_Image_plv6quplv6quplv6.png" 
                alt="Student Accommodation 3" 
                className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/40 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-xl"></div>
              {/* Featured Badge */}
              <div className="absolute top-2 right-2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-2 py-1 rounded-full shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300 ease-out">
                <span className="text-white text-xs font-bold">FEATURED</span>
              </div>
              {/* Floating Label */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                <span className="text-white text-xs font-medium">Luxury</span>
              </div>
            </div>

            {/* Mobile Image 4 - Bottom Right */}
            <div className="absolute bottom-4 right-4 w-32 h-40 rounded-xl overflow-hidden shadow-xl transform hover:scale-125 hover:z-30 hover:-rotate-1 transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] border border-[#312E81]/40 hover:border-[#8B5CF6]/80 transition-colors duration-300 ease-in-out">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/60 via-transparent to-transparent rounded-xl"></div>
              <img 
                src="/images/Gemini_Generated_Image_rhc46nrhc46nrhc4.png" 
                alt="Student Accommodation 4" 
                className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-xl"></div>
              {/* Floating Label */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 hover:translate-y-0">
                <span className="text-white text-xs font-medium">Shared</span>
              </div>
            </div>

            {/* Animated Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15">
              <defs>
                <linearGradient id="mobileConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4"/>
                </linearGradient>
              </defs>
              <path d="M 50 150 Q 100 100 150 50" stroke="url(#mobileConnectionGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDuration: '4s', animationTimingFunction: 'ease-in-out'}}/>
              <path d="M 150 50 Q 200 100 250 150" stroke="url(#mobileConnectionGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDuration: '5s', animationTimingFunction: 'ease-in-out'}}/>
            </svg>

            {/* Floating Particles */}
            <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce opacity-60" style={{animationDuration: '2s', animationTimingFunction: 'ease-in-out'}}></div>
            <div className="absolute top-16 right-16 w-1 h-1 bg-[#6366F1] rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s', animationDuration: '2.5s', animationTimingFunction: 'ease-in-out'}}></div>
            <div className="absolute bottom-16 left-16 w-0.5 h-0.5 bg-[#A78BFA] rounded-full animate-bounce opacity-60" style={{animationDelay: '1s', animationDuration: '3s', animationTimingFunction: 'ease-in-out'}}></div>
            
            {/* Enhanced Mobile Stats Cards */}
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-[#8B5CF6]/95 to-[#6366F1]/95 backdrop-blur-xl p-3 rounded-xl border border-[#8B5CF6]/40 shadow-[0_0_20px_rgba(139,92,246,0.4)] transform group-hover:scale-110 transition-all duration-500 ease-out z-40 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] hover:border-[#A78BFA]/60">
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">500+</div>
                <div className="text-[#DDD6FE] text-xs font-medium">Properties</div>
                <div className="w-6 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#818CF8] mx-auto mt-1 rounded-full"></div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#6366F1]/95 to-[#8B5CF6]/95 backdrop-blur-xl p-3 rounded-xl border border-[#6366F1]/40 shadow-[0_0_20px_rgba(99,102,241,0.4)] transform group-hover:scale-110 transition-all duration-500 ease-out z-40 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:border-[#818CF8]/60">
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">50+</div>
                <div className="text-[#DDD6FE] text-xs font-medium">Cities</div>
                <div className="w-6 h-0.5 bg-gradient-to-r from-[#818CF8] to-[#A78BFA] mx-auto mt-1 rounded-full"></div>
              </div>
            </div>
            
            {/* Enhanced Verification Badge */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-[#10B981]/95 to-[#059669]/95 backdrop-blur-xl p-3 rounded-full border border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.4)] badge-pulse z-40 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-110 hover:border-[#4ADE80]/60 transition-all duration-300 ease-out">
              <Shield className="w-5 h-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#4ADE80] rounded-full border border-white shadow-sm"></div>
            </div>
          </div>

          {/* Mobile Trust Indicators */}
          <div className="flex flex-col gap-4 text-gray-200 text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>Trusted by 10,000+ students</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-[#A78BFA]" />
              <span>Verified listings only</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#818CF8]" />
              <span>24/7 support</span>
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
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Listings",
      description: "Every property is personally verified by our team to ensure quality and safety."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Community",
      description: "Connect with fellow students and find roommates through our platform."
    },
    {
      icon: <HomeIcon className="w-8 h-8" />,
      title: "Flexible Options",
      description: "Choose from private rooms, shared apartments, or student hostels."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Prime Locations",
      description: "Properties conveniently located near university campuses and transit options."
    }
  ];

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-[#8B5CF6]">SmartStay</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We make finding student accommodation simple, safe, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-[#8B5CF6]">
              <div className="w-20 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#8B5CF6] transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
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
    <section className="py-20 bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Students Say
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of satisfied students who found their perfect accommodation across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover mr-4 shadow-lg border border-gray-800"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                    <div className="bg-gradient-to-r from-[#6D28D9] to-[#4338CA] rounded-full p-0.5 shadow-md">
                      <div className="bg-[#4C1D95] rounded-full w-4 h-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{testimonial.university}</p>
                  <div className="flex mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-200 leading-relaxed italic text-lg">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#6D28D9] relative overflow-hidden">
      {/* Glass Background Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#1E1B4B] to-[#4C1D95] opacity-70"
        style={{ mixBlendMode: 'overlay' }}
      ></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Crect x=%220%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2210%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2220%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2230%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2240%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2250%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2260%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2270%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2280%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3Crect x=%2290%22 y=%220%22 width=%222%22 height=%22100%22 /%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Glow Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#7E22CE] opacity-30 blur-[100px]"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#6D28D9] opacity-20 blur-[120px]"></div>
      
      {/* Small Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-full opacity-25 animate-bounce"></div>
      
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 text-left">
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#5B21B6]/30 to-[#7E22CE]/30 backdrop-blur-md rounded-full border border-white/20 text-white font-medium text-sm mb-6 animate-bounce-slow">
              Ready to get started?
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your <span className="shining-text">Dream</span> Student Accommodation
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Join thousands of students who have already found their ideal accommodation through SmartStay. Our platform connects you with verified properties near your campus.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 mb-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">10,000+</span>
                <span className="text-[#A78BFA]">Happy Students</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">500+</span>
                <span className="text-[#A78BFA]">Properties</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">50+</span>
                <span className="text-[#A78BFA]">Cities</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/listings" className="bg-white text-[#5B21B6] px-8 py-4 rounded-2xl font-bold hover:bg-[#F5F3FF] hover:shadow-[0_0_20px_rgba(167,139,250,0.5)] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Browse Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/owner-dashboard" className="border-2 border-[#A78BFA] bg-[#4C1D95]/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#5B21B6]/30 hover:border-white transition-all duration-300 shadow-xl hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                List Your Property
              </Link>
            </div>
          </div>
          
          {/* Right Side: Image or Cards */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              {/* Main card */}
              <div className="bg-gradient-to-br from-[#4C1D95]/50 to-[#6D28D9]/50 backdrop-blur-md p-8 rounded-3xl border border-[#8B5CF6]/30 shadow-[0_0_25px_rgba(139,92,246,0.2)] transform hover:scale-105 transition-all duration-500">
                <div className="flex items-start mb-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 mr-6 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <img 
                      src="/images/hostel-img.jpg" 
                      alt="Student Hostel" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">University Towers</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-[#A78BFA]" />
                      <span className="text-[#DDD6FE]">Near Delhi University</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FBBF24] fill-current" />
                      ))}
                      <span className="text-[#DDD6FE] ml-2">4.9 (120 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[#A78BFA] text-sm">Starting at</span>
                    <span className="text-white text-xl font-bold">₹15,000/mo</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#A78BFA] text-sm">Available From</span>
                    <span className="text-white text-xl font-bold">June 2024</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-12 -right-8 bg-gradient-to-r from-[#5B21B6]/40 to-[#7E22CE]/40 backdrop-blur-md p-4 rounded-2xl border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] transform rotate-6 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#4ADE80]" />
                  <span className="text-white font-medium">Verified Property</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-6 bg-gradient-to-r from-[#7E22CE]/40 to-[#5B21B6]/40 backdrop-blur-md p-4 rounded-2xl border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] transform -rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#A78BFA]" />
                  <span className="text-white font-medium">Highly Rated by Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-[#8B5CF6] mb-4">SmartStay</h3>
            <p className="text-gray-300">
              Helping students find trusted accommodation near their campuses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">For Students</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Browse Properties</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Find Roommates</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Student Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">For Landlords</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">List Property</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Property Management</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Landlord Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Safety Tips</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SmartStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
