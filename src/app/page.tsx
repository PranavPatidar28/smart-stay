import Navbar from "@/components/ui/Navbar";
import HeroBackgroundArt from "@/components/ui/HeroBackgroundArt";
import { Search, Shield, Star, MapPin, Users, Home as HomeIcon, CheckCircle } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--color-primary-900)] via-[var(--color-primary-700)] via-[var(--color-secondary-800)] to-[var(--color-secondary-900)] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 animate-pulse"></div>
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-secondary-400)] rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[var(--color-secondary-300)] to-[var(--color-primary-300)] rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full opacity-25 animate-bounce"></div>
      <div className="relative z-10 flex items-center justify-center h-screen w-full px-4">
        <div className="max-w-6xl mx-auto text-center hero-content-fade-in">
          <div className="mb-8 hero-content-item">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] bg-clip-text text-transparent">
                Student Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover trusted accommodation near your campus. Verified listings, secure payments, and 24/7 support.
            </p>
          </div>

          {/* Search Bar */}
          <form action="/listings" method="GET" className="bg-white/15 backdrop-blur-xl rounded-3xl p-3 mb-8 max-w-2xl mx-auto border border-white/20 shadow-2xl hero-content-item">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                {/* Removed MapPin icon and location placeholder */}
                <input 
                  type="text" 
                  name="search"
                  placeholder="Enter your university"
                  className="w-full pl-4 pr-4 py-4 rounded-2xl bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:bg-white transition-all duration-300 shadow-lg"
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white px-8 py-4 rounded-2xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
                <Search className="w-5 h-5" />
                Explore
              </button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm hero-content-item">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>Trusted by 10,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Verified listings only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
      {/* Glassmorphic Flower Background Art at the bottom */}
      <HeroBackgroundArt />
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
    // Removed Prime Locations feature
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
      icon: <Users className="w-8 h-8" />,
      title: "Student Community",
      description: "Connect with fellow students and find roommates through our platform."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-[var(--color-primary-500)]">SmartStay</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make finding student accommodation simple, safe, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-[var(--color-primary-200)]">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[var(--color-primary-600)] transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Students Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied students who found their perfect accommodation across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover mr-4 shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.university}</p>
                  <div className="flex mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic text-lg">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[var(--color-primary-900)] via-[var(--color-primary-800)] via-[var(--color-secondary-800)] to-[var(--color-secondary-900)] relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-secondary-400)] rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-[var(--color-secondary-300)] to-[var(--color-primary-300)] rounded-full opacity-15 animate-bounce"></div>
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Find Your Perfect Home?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have already found their ideal accommodation through SmartStay.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          
            <Link href="/listings" className="bg-white text-[var(--color-primary-900)] px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 z-20">
            Browse Properties
            </Link>
            <Link href="/owner-dashboard" className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold hover:bg-white hover:text-[var(--color-primary-900)] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 z-20">
            List Your Property
            </Link>
          
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-[var(--color-primary-500)] mb-4">SmartStay</h3>
            <p className="text-gray-400">
              Helping students find trusted accommodation near their campuses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Browse Properties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Roommates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Student Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Landlords</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">List Property</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Property Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Landlord Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SmartStay. All rights reserved.</p>
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
