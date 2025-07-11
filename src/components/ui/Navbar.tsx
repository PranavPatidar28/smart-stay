"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, User, Home, Building2, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { useSession } from "next-auth/react";
import RoleRequiredModal from "./RoleRequiredModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Check if we're on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation with role check
  const handleNavigation = (href: string, requiresRole?: string | null) => {
    if (!requiresRole || !session) {
      // If no specific role required or user not logged in, navigate normally
      return href;
    }
    
    // Check if user has the required role
    if (session.user?.role === requiresRole) {
      return href;
    } else {
      // Don't navigate, show the modal instead
      return "#";
    }
  };

  // Handle click for role-restricted links
  const handleLinkClick = (e: React.MouseEvent, requiresRole?: string | null) => {
    if (!requiresRole || !session) return;
    
    if (session.user?.role !== requiresRole) {
      e.preventDefault();
      setShowRoleModal(true);
    }
  };

  const navLinks = [
    { 
      href: "/listings", 
      label: "Browse Listings", 
      icon: <Search className="w-4 h-4" />,
      requiresRole: null
    },
    { 
      href: "/owner-dashboard", 
      label: "List Property", 
      icon: <Building2 className="w-4 h-4" />,
      requiresRole: "LANDLORD"
    },
    { 
      href: "/favorites", 
      label: "Favorites", 
      icon: <Heart className="w-4 h-4" />,
      requiresRole: null
    },
  ];

  // Determine navbar styling based on page and scroll state
  const getNavbarStyles = () => {
    if (isHomePage) {
      // Home page: transparent with white text, solid background when scrolled
      return {
        nav: isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg' 
          : 'bg-transparent',
        logo: isScrolled 
          ? 'text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]' 
          : 'text-white drop-shadow-lg hover:text-[var(--color-primary-300)]',
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
        logo: 'text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]',
        links: 'text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-50',
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
                className={`text-2xl font-bold transition-all duration-300 ${styles.logo}`}
              >
                SmartStay
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={handleNavigation(link.href, link.requiresRole)}
                  onClick={(e) => handleLinkClick(e, link.requiresRole)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${styles.links}`}
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
          className="fixed inset-0 z-[60] flex flex-col bg-white/60 backdrop-blur-2xl border border-white/30 shadow-2xl transition-all duration-300 animate-fade-in glassmorphism"
        >
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <Link
              href="/"
              className="text-2xl font-bold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
              onClick={() => setIsMenuOpen(false)}
            >
              SmartStay
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-xl text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-100"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          {/* User Menu */}
          <div className="px-6 py-4 border-b border-gray-100">
            <UserMenu />
          </div>
          {/* Nav Links */}
          <nav className="flex-1 flex flex-col gap-2 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={handleNavigation(link.href, link.requiresRole)}
                onClick={(e) => {
                  handleLinkClick(e, link.requiresRole);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-200 text-gray-700 hover:text-[var(--color-primary-600)] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)]"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50 md:hidden animate-fade-in"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Role Required Modal */}
      <RoleRequiredModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        requiredRole="LANDLORD"
        currentRole={session?.user?.role}
        actionType="list properties"
      />
    </>
  );
}