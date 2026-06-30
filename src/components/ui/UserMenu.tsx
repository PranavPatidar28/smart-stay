"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, Heart, Home, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image';
import { Role, getRoleLabel } from "@/types/role";

interface UserMenuProps {
  isInMobileMenu?: boolean;
}

export default function UserMenu({ isInMobileMenu = false }: UserMenuProps) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  // Track scroll position to adjust styling accordingly
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initially

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine text color based on page, scroll position, and mobile menu context
  const getUserMenuTextColor = () => {
    // If in mobile menu, always use dark text
    if (isInMobileMenu) {
      return "text-gray-700";
    }

    if (isHomePage && !isScrolled) {
      return "text-white"; // White text on transparent home page navbar
    }
    return "text-gray-700"; // Default dark text for other pages or when scrolled
  };

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className={`transition-colors font-medium ${isInMobileMenu
            ? "text-[var(--color-primary-400)] hover:text-[var(--color-primary-600)]"
            : isHomePage && !isScrolled
              ? "text-white hover:text-white/80"
              : "text-gray-600 hover:text-[var(--color-primary-600)]"
            }`}
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white px-4 py-2 rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  // Function to render user avatar consistently as a perfect circle
  const renderUserAvatar = (size: number) => {
    const avatarStyle = {
      width: `${size}px`,
      height: `${size}px`,
      minWidth: `${size}px`,
      minHeight: `${size}px`,
      maxWidth: `${size}px`,
      maxHeight: `${size}px`,
      aspectRatio: '1/1',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    } as React.CSSProperties;

    if (session?.user?.image) {
      return (
        <div style={avatarStyle} className="flex-shrink-0">
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={size}
            height={size}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
        </div>
      );
    } else {
      return (
        <div
          style={{
            ...avatarStyle,
            background: 'linear-gradient(to right, var(--color-primary-500), var(--color-secondary-500))'
          }}
          className="flex-shrink-0"
        >
          <span className="text-sm font-bold text-white">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      );
    }
  };

  const textColorClass = getUserMenuTextColor();
  const hoverClass = isInMobileMenu
    ? "hover:bg-gray-100"
    : isHomePage && !isScrolled
      ? "hover:bg-white/10"
      : "hover:bg-gray-100";

  // Get user role from session with type safety
  const userRole = session?.user?.role as Role | null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-2 rounded-xl ${hoverClass} transition-colors`}
      >
        {renderUserAvatar(32)}
        <span className={`text-sm font-medium ${textColorClass} ${isHomePage && !isScrolled && !isInMobileMenu ? "username-gradient-home" : "username-gradient"}`}>
          {session?.user?.name || "User"}
        </span>
        <ChevronDown className={`w-4 h-4 ${isInMobileMenu ? "text-gray-500" : isHomePage && !isScrolled ? "text-white" : "text-gray-500"}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl py-2 z-50 glassmorphism">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {renderUserAvatar(40)}
              <div>
                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-300)] to-[var(--color-secondary-300)] username-gradient">{session?.user?.name}</p>
                <p className="text-sm text-gray-600">{session?.user?.email}</p>
                <span className="inline-block mt-1 px-2 py-1 border-1 border-[var(--color-primary-500)] bg-[var(--color-primary-800)] text-[var(--color-primary-300)] text-xs rounded-full font-medium">
                  {getRoleLabel(userRole)}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {userRole === "LANDLORD" && (
              <Link
                href="/owner-dashboard"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            <Link
              href="/favorites"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="w-4 h-4" />
              My Favorites
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}