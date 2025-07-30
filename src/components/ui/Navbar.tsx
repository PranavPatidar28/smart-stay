"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, Heart, Building2, Home, User, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { useSession } from "next-auth/react";
import RoleRequiredModal from "./RoleRequiredModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Check if we're on the home page
  // const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle navigation with role check
  const handleNavigation = (href: string, requiresRole?: string | null) => {
    if (!requiresRole || !session) {
      // If no specific role required or user not logged in, navigate normally
      return href;
    }
    
    // Check if user has the required role
    if ((session?.user as { role?: string | null })?.role === requiresRole) {
      return href;
    } else {
      // Don't navigate, show the modal instead
      return "#";
    }
  };

  // Handle click for role-restricted links
  const handleLinkClick = (e: React.MouseEvent, requiresRole?: string | null) => {
    if (!requiresRole || !session) return;
    
    if ((session?.user as { role?: string | null })?.role !== requiresRole) {
      e.preventDefault();
      setShowRoleModal(true);
    }
  };

  const navLinks = [
    { 
      href: "/", 
      label: "Home", 
      icon: <Home className="w-5 h-5" />,
      requiresRole: null
    },
    { 
      href: "/listings", 
      label: "Browse Listings", 
      icon: <Search className="w-5 h-5" />,
      requiresRole: null
    },
    { 
      href: "/owner-dashboard", 
      label: "List Property", 
      icon: <Building2 className="w-5 h-5" />,
      requiresRole: "LANDLORD"
    },
    { 
      href: "/favorites", 
      label: "Favorites", 
      icon: <Heart className="w-5 h-5" />,
      requiresRole: null
    },
  ];

  const additionalLinks = [
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="w-5 h-5" />,
      requiresRole: null
    },
  ];

  // Determine navbar styling based on page and scroll state
  const getNavbarStyles = () => {
    if (currentPage === "/") {
      // Home page: transparent with white text, solid background when scrolled
      return {
        nav: isScrolled 
          ? 'bg-white/90 backdrop-blur-xl  shadow-lg' 
          : 'bg-transparent',
        logo: isScrolled 
          ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] bg-clip-text text-transparent' 
          : 'text-white drop-shadow-lg',
        logoHover: isScrolled
          ? 'hover:opacity-80'
          : 'hover:text-[var(--color-primary-300)]',
        links: isScrolled
          ? 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50'
          : 'text-white/90 hover:text-white hover:bg-white/10',
        mobileMenu: isScrolled ? 'bg-white/95 backdrop-blur-xl' : 'bg-black/20 backdrop-blur-xl',
        mobileLinks: isScrolled
          ? 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50'
          : 'text-white hover:bg-white/10',
        menuButton: isScrolled
          ? 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50'
          : 'text-white hover:bg-white/10'
      };
    } else {
      // Other pages: always solid white background with dark text
      return {
        nav: 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg',
        logo: 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] bg-clip-text text-transparent',
        logoHover: 'hover:opacity-80',
        links: 'text-gray-700 hover:text-[var(--color-primary-400)]',
        linksActive: 'text-[var(--color-primary-400)]',
        mobileMenu: 'bg-white/95 backdrop-blur-xl',
        mobileLinks: 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50',
        menuButton: 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50'
      };
    }
  };

  const styles = getNavbarStyles();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${styles.nav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className={`transition-all duration-300 ${styles.logoHover}`}
              >
                <span className={`text-2xl font-extrabold tracking-tight ${styles.logo} transition-all duration-300 transform hover:scale-105`}>
                  Smart<span className="font-black">Stay</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={handleNavigation(link.href, link.requiresRole)}
                  onClick={(e) => handleLinkClick(e, link.requiresRole)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105
                      ${currentPage === link.href ? `${styles.linksActive}` : `${styles.links}`}`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-all duration-300 ${styles.menuButton}`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-white/95 to-white/98 backdrop-blur-2xl border-b border-gray-200/50 shadow-2xl transition-all duration-500 ease-out animate-slide-down"
        >
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="group"
            >
              <span className="text-2xl font-extrabold bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                Smart<span className="font-black">Stay</span>
              </span>
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="p-3 rounded-2xl text-gray-600 hover:text-[var(--color-primary-600)] hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:ring-offset-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Menu Section */}
          <div className="px-6 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/30 to-white/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
            </div>
            <UserMenu isInMobileMenu={true} />
          </div>

          {/* Main Navigation Links */}
          <div className="flex-1 px-6 py-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
              <nav className="space-y-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={handleNavigation(link.href, link.requiresRole)}
                    onClick={(e) => {
                      handleLinkClick(e, link.requiresRole);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200 group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:ring-offset-2 ${
                      pathname === link.href 
                        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)]' 
                        : 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50/80'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-200 ${
                      pathname === link.href 
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-[var(--color-primary-50)] group-hover:text-[var(--color-primary-600)]'
                    }`}>
                      {link.icon}
                    </div>
                    <span className="flex-1">{link.label}</span>
                    {link.requiresRole && (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                        {link.requiresRole}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Additional Links */}
            <div className="border-t border-gray-200/50 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">More</h3>
              <nav className="space-y-2">
                {additionalLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={handleNavigation(link.href, link.requiresRole)}
                    onClick={(e) => {
                      handleLinkClick(e, link.requiresRole);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200 group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:ring-offset-2 ${
                      pathname === link.href 
                        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)]' 
                        : 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50/80'
                    }`}
                    style={{ animationDelay: `${(index + navLinks.length) * 100}ms` }}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-200 ${
                      pathname === link.href 
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-[var(--color-primary-50)] group-hover:text-[var(--color-primary-600)]'
                    }`}>
                      {link.icon}
                    </div>
                    <span className="flex-1">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/30 to-white/30">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                © 2024 SmartStay. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden animate-fade-in"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Role Required Modal */}
      <RoleRequiredModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        requiredRole="LANDLORD"
        currentRole={(session?.user as { role?: string | null })?.role || ""}
        actionType="list properties"
      />

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}