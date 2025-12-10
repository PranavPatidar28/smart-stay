"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Navbar from "@/components/ui/Navbar";
import { createPortal } from "react-dom";

// Define custom CSS for background pattern animations and scrollbars
const backgroundPatternStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out forwards;
  }
  /* Shimmer effect */
  .shimmer {
    position: relative;
    overflow: hidden;
    background: #e5e7eb;
  }
  .shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150px;
    width: 150px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer {
    100% {
      left: 100%;
    }
  }
  
  /* Background pattern animations */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(5deg);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.05);
    }
  }
  
  .floating-shape {
    animation: float 6s ease-in-out infinite;
  }
  
  .pulsing-shape {
    animation: pulse 4s ease-in-out infinite;
  }
`;
import { authClient } from "@/lib/auth-client";
import {
  Heart,
  Utensils,
  X,
  MapIcon,
  Share2,
  ChevronDown,
  Eye,
  MapPin,
  Star,
  Bed,
  Bath,
  Calendar,
  Dumbbell,
  Wifi,
  Car,
  Shield,
  Home,
  BookOpen,
  User,
  Phone,
  Mail,
  CheckCircle,
  Check,
  XCircle,
  Loader2,
  MessageSquare,
  Send,
  Clock,
  ArrowUp,
  ArrowDown,
  PawPrint,
  Grid3X3
} from "lucide-react";
import FavoritesListSkeleton from "@/components/ui/FavoritesListSkeleton";
import ViewPropertyModal from '@/components/ui/ViewPropertyModal';
import { FaRupeeSign as Rupee } from "react-icons/fa";
import { trackAnalyticsEvent } from '@/lib/api-client';
import { showSuccess, showError } from '@/lib/toast';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";


interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  image: string;
  images: Array<{
    id: string;
    url: string;
    order: number;
    isCover: boolean;
  }>;
  amenities: Array<{
    amenity: {
      id: string;
      name: string;
      category: string;
    };
  }>;
  status: string;
  isFavorite: boolean;
  isAvailable: boolean;
  availableFrom?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  owner: {
    id: string;
    name: string;
    verified: boolean;
    rating?: number;
  };
  utilities: boolean;
  petFriendly: boolean;
  furnished: boolean;
  parking: boolean;
  _count: {
    favorites: number;
    reviews: number;
    inquiries: number;
  };
  reviews?: Review[];
  addedDate?: string; // Add this line for sorting by date added
}


interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}


// Move getAmenityIcon above MobilePropertyModal so it is in scope
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "WiFi":
      return <Wifi className="w-4 h-4" />;
    case "Parking":
      return <Car className="w-4 h-4" />;
    case "Gym":
      return <Dumbbell className="w-4 h-4" />;
    case "Kitchen":
      return <Utensils className="w-4 h-4" />;
    case "Security":
      return <Shield className="w-4 h-4" />;
    case "Study Room":
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Home className="w-4 h-4" />;
  }
};

interface MobilePropertyModalProps {
  property: Property;
  toggleFavorite: (id: string) => void;
  closePropertyModal: () => void;
  onBookViewing: (id: string) => void;
  onPhoneContact: (id: string) => void;
  onEmailContact: (id: string) => void;
  onShare: (id: string) => void;
}



// Dropdown Portal Component
interface DropdownPortalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DropdownPortal = ({ isOpen, onClose, triggerRef, children, className = "", style }: DropdownPortalProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position when dropdown opens
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Determine if dropdown should appear above or below
      const shouldShowAbove = spaceBelow < 320 && spaceAbove > spaceBelow;

      // Calculate left position to prevent overflow
      let left = rect.left;
      const dropdownWidth = rect.width;

      // Adjust if dropdown would overflow right edge
      if (left + dropdownWidth > viewportWidth) {
        left = Math.max(0, viewportWidth - dropdownWidth - 10);
      }

      setPosition({
        top: shouldShowAbove
          ? rect.top + window.scrollY - 320
          : rect.bottom + window.scrollY,
        left: left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen, triggerRef]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle scroll outside
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check if trigger is completely outside viewport or if it's moved significantly
        if (
          triggerRect.bottom < 0 ||
          triggerRect.top > viewportHeight ||
          triggerRect.right < 0 ||
          triggerRect.left > viewportWidth ||
          triggerRect.height === 0 || // Element is not visible
          triggerRect.width === 0 // Element is not visible
        ) {
          onClose();
        }
      }
    };

    if (isOpen) {
      // Use throttled scroll handler for better performance
      let ticking = false;
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', throttledScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', throttledScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className={`absolute z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden ${className}`}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: '320px',
        ...style
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const propertyTypes = [
  "All",
  "APARTMENT",
  "STUDIO",
  "SHARED_HOUSE",
  "LUXURY",
  "ROOM",
  "FAMILY_HOME",
];

// Property type options with icons and descriptions
const PROPERTY_TYPE_OPTIONS = [
  {
    value: "All",
    label: "All Types",
    icon: "🏠",
    description: "Show all property types",
    color: "gray"
  },
  {
    value: "APARTMENT",
    label: "Apartment",
    icon: "🏢",
    description: "Modern apartments with amenities",
    color: "blue"
  },
  {
    value: "STUDIO",
    label: "Studio",
    icon: "🛋️",
    description: "Compact single room units",
    color: "purple"
  },
  {
    value: "SHARED_HOUSE",
    label: "Shared House",
    icon: "🏘️",
    description: "Shared accommodations with common areas",
    color: "green"
  },
  {
    value: "LUXURY",
    label: "Luxury",
    icon: "✨",
    description: "Premium properties with high-end amenities",
    color: "yellow"
  },
  {
    value: "ROOM",
    label: "Room",
    icon: "🛏️",
    description: "Single rooms in shared properties",
    color: "pink"
  },
  {
    value: "FAMILY_HOME",
    label: "Family Home",
    icon: "🏡",
    description: "Full homes for families",
    color: "orange"
  }
];

// Sort options with icons and descriptions
const SORT_OPTIONS = [
  {
    value: "date",
    label: "Date Added",
    icon: "📅",
    description: "Most recently added first"
  },
  {
    value: "price-low",
    label: "Price: Low to High",
    icon: "💰",
    description: "Cheapest properties first"
  },
  {
    value: "price-high",
    label: "Price: High to Low",
    icon: "💰",
    description: "Luxury properties first"
  },
  {
    value: "rating",
    label: "Highest Rated",
    icon: "⭐",
    description: "Best-rated properties first"
  },
  {
    value: "distance",
    label: "Nearest First",
    icon: "📍",
    description: "Closest to your location"
  }
];



const MobilePropertyModal = ({
  property,
  toggleFavorite,
  closePropertyModal,
  onBookViewing,
  onPhoneContact,
  onEmailContact,
  onShare
}: MobilePropertyModalProps) => {
  const [mobileModalFavorite, setMobileModalFavorite] = useState(property.isFavorite);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setMobileModalFavorite(property.isFavorite);
  }, [property.isFavorite]);

  const handleMobileFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileModalFavorite(!mobileModalFavorite);
    toggleFavorite(property.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto custom-scrollbar"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={closePropertyModal}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Back"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleMobileFavoriteToggle}
            className="p-2 rounded-full"
            aria-label={mobileModalFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-6 h-6 ${mobileModalFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-gray-700 stroke-2 hover:text-red-500"
                }`}
            />
          </button>
          {property.latitude && property.longitude && (
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MapIcon className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <button
            onClick={() => onShare(property.id)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Image Gallery */}
      <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
        <Image
          src={property.images[currentImageIndex]?.url || '/images/placeholder.png'}
          alt={property.title}
          className="w-full h-full object-cover"
          width={600}
          height={400}
          onError={e => (e.currentTarget.src = '/images/placeholder.png')}
        />
        {/* Image navigation */}
        {Array.isArray(property.images) && property.images.length > 1 && (
          <>
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentImageIndex((currentImageIndex - 1 + property.images.length) % property.images.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronDown className="w-5 h-5 rotate-90 text-gray-800" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentImageIndex((currentImageIndex + 1) % property.images.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronDown className="w-5 h-5 -rotate-90 text-gray-800" />
            </button>
          </>
        )}
        {/* Image Counter */}
        {Array.isArray(property.images) && property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{currentImageIndex + 1}/{property.images.length}</span>
          </div>
        )}
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold shadow ${property.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {property.isAvailable ? "Available" : "Not Available"}
        </div>
        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-white/90 px-4 py-1 rounded-xl shadow text-lg font-bold text-gray-900 border border-gray-100">
          ₹{property.price.toLocaleString()}<span className="block text-xs font-normal text-gray-600">/month</span>
        </div>
      </div>
      {/* Property Info */}
      <div className="p-4 flex flex-col gap-3">
        <h2 className="font-bold text-xl text-gray-900 mb-1">{property.title}</h2>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-[var(--color-primary-500)]" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-700">{property.rating}</span>
        </div>
        {/* Property Stats */}
        <div className="flex gap-6 mt-2">
          <div className="flex flex-col items-center">
            <Bed className="w-5 h-5 text-[var(--color-primary-500)] mb-1" />
            <span className="text-xs text-gray-500">Beds</span>
            <span className="font-semibold text-gray-900">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="w-5 h-5 text-[var(--color-primary-500)] mb-1" />
            <span className="text-xs text-gray-500">Baths</span>
            <span className="font-semibold text-gray-900">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-5 h-5 text-[var(--color-primary-500)] mb-1" />
            <span className="text-xs text-gray-500">Available</span>
            <span className="font-semibold text-gray-900">{property.availableFrom ? new Date(property.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 'Now'}</span>
          </div>
        </div>
        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-2">
          {property.furnished && <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"><Home className="w-3 h-3" />Furnished</span>}
          {property.petFriendly && <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"><Shield className="w-3 h-3" />Pet Friendly</span>}
          {property.parking && <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"><Car className="w-3 h-3" />Parking</span>}
          {property.utilities && <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"><Wifi className="w-3 h-3" />Utilities</span>}
        </div>
        {/* Amenities */}
        <div className="mt-3">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[var(--color-primary-600)]" />
            Amenities
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(property.amenities) && property.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={`${property.id}-amenity-${idx}-${amenity.amenity.name}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {/* Use getAmenityIcon if available in scope */}
                {typeof getAmenityIcon === 'function' ? getAmenityIcon(amenity.amenity.name) : null}{amenity.amenity.name}
              </span>
            ))}
            {Array.isArray(property.amenities) && property.amenities.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{property.amenities.length - 4} more</span>}
          </div>
        </div>
        {/* Description */}
        {property.description && (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 my-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary-600)]" />
              Description
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{property.description}</p>
          </div>
        )}
        {/* Owner Info */}
        <div className="my-4 bg-[var(--color-primary-50)] p-3 rounded-xl border border-[var(--color-primary-100)]">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-primary-600)]" />
            Property Owner
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full flex items-center justify-center text-lg font-bold text-white">
              {property.owner.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-semibold text-gray-900">{property.owner.name}</span>
                {property.owner.verified && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-700">{property.owner.rating || '4.8'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons - Updated with functionality */}
        <div className="flex gap-3 mt-4 mb-6 px-4">
          <button
            onClick={() => onBookViewing(property.id)}
            className="flex-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white py-3 px-4 rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Viewing
          </button>
          <button
            onClick={() => onPhoneContact(property.id)}
            className="p-3 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-[var(--color-primary-700)] rounded-xl hover:bg-[var(--color-primary-100)] transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEmailContact(property.id)}
            className="p-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};



export default function FavoritesPage() {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalFavorite, setModalFavorite] = useState(false);
  // State for custom dropdowns
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showSortByModal, setShowSortByModal] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPagination, setReviewPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // State for booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Refs for clicking outside detection
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);

  // Open modal with mapped property
  const openPropertyModal = (property: Property) => {
    // Map the property to ensure all required fields are present
    const mappedProperty = mapFavoriteToFullProperty(property);
    setSelectedProperty(mappedProperty);
    setShowModal(true);
    setCurrentImageIndex(0);

    // Fetch reviews when opening the modal
    if (property) {
      fetchPropertyReviews(property.id);
    }
  };
  const closePropertyModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setCurrentImageIndex(0);
    // Reset reviews state
    setReviews([]);
    setReviewPagination({
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });
    setUserReview({
      rating: 0,
      comment: ''
    });
  };


  // Handle favorite toggle in modal
  const handleModalFavoriteToggle = () => {
    if (selectedProperty) {
      setModalFavorite(!modalFavorite);
      toggleFavorite(selectedProperty.id);
    }
  };


  const PropertyCard = ({
    property,
    isListView = false,
    onContact,
  }: {
    property: Property;
    isListView?: boolean;
    onContact?: (property: Property) => void;
  }) => {
    // Mini-gallery hover for desktop
    const [hovered, setHovered] = useState(false);

    // Create a local state that mirrors the property.isFavorite for immediate UI updates
    const [localFavorite, setLocalFavorite] = useState(property.isFavorite);

    // Update local state when the property prop changes
    useEffect(() => {
      setLocalFavorite(property.isFavorite);
    }, [property.isFavorite]);

    // Handle favorite button click with local state update
    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalFavorite(!localFavorite); // Update local state immediately
      toggleFavorite(property.id); // Then trigger the global state update and API call
    };

    return (
      <div
        className={`group relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 hover:shadow-[0_8px_32px_rgba(80,80,180,0.10)] h-full flex flex-col ${isListView ? "flex-col lg:flex-row" : "w-[380px]"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Section */}
        <div className={`relative ${isListView ? "lg:w-80 h-64 lg:h-auto" : "h-56"}`}>
          <img
            src={property.images && property.images.length > 0 ? property.images[0].url : '/images/placeholder.png'}
            alt={property.title}
            className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
          />
          {/* Mini-gallery thumbnails on hover (desktop only) */}
          {Array.isArray(property.images) && property.images.length > 1 && (
            <div className={`hidden lg:flex absolute bottom-4 right-4 gap-2 z-10 ${hovered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
              {property.images.slice(1, 4).map((img: any) => (
                <div key={img.id} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {/* Status Badge */}
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${property.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{property.isAvailable ? "Available" : "Not Available"}</span>
          {/* Type Badge */}
          <span className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white rounded-full text-xs font-medium shadow-md backdrop-blur-sm">{property.type}</span>
          {/* Price Badge */}
          <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg text-lg font-bold text-gray-900 border border-gray-100">₹{property.price.toLocaleString()}<span className="block text-xs font-normal text-gray-600">/month</span></span>
          {/* Favorite Button - Updated styling */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
            aria-label={localFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-6 h-6 ${localFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-white stroke-2 hover:text-red-500"
                }`}
            />
          </button>
          {/* Map Location Indicator - Show when property has coordinates */}
          {property.latitude && property.longitude && (
            <div className="absolute top-14 right-4 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-[var(--color-primary-500)]" title="Map location available">
              <MapPin className="w-4 h-4" />
            </div>
          )}
          {/* Overlay for unavailable */}
          {!property.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-lg font-semibold mb-1">Not Available</div>
                <div className="text-sm opacity-90">Currently occupied</div>
              </div>
            </div>
          )}
        </div>
        {/* Info Panel */}
        <div className={`flex flex-col flex-1 justify-between p-6 gap-4 ${isListView ? "flex-1" : ""}`}>
          <div className="flex flex-col gap-4">
            {/* Title, Location, Rating */}
            <div className="flex items-start justify-between gap-2 min-w-0 mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-xl line-clamp-2 break-words group-hover:text-[var(--color-primary-200)] transition-colors" title={property.title}>{property.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <MapPin className="w-4 h-4 text-[var(--color-primary-500)]" />
                  <span className="truncate">{property.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-700">{property.rating}</span>
              </div>
            </div>
            {/* Description (list view only) */}
            {isListView && <p className="text-gray-700 mb-2 line-clamp-2 text-sm">{property.description}</p>}
            {/* Property Stats */}
            <div className="flex gap-6 mb-2">
              <div className="flex flex-col items-center">
                <Bed className="w-5 h-5 text-[var(--color-primary-500)] mb-1" />
                <span className="text-xs text-gray-500">Beds</span>
                <span className="font-semibold text-gray-900">{property.bedrooms}</span>
              </div>
              <div className="flex flex-col items-center">
                <Bath className="w-5 h-5 text-[var(--color-primary-500)] mb-1" />
                <span className="text-xs text-gray-500">Baths</span>
                <span className="font-semibold text-gray-900">{property.bathrooms}</span>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="w-5 h-5 text-[var(--color-primary-500)] mb-1" />
                <span className="text-xs text-gray-500">Available</span>
                <span className="font-semibold text-gray-900">{property.availableFrom ? new Date(property.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 'Available now'}</span>
              </div>
            </div>
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-2">
              {property.furnished && <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"><Home className="w-3 h-3" />Furnished</span>}
              {property.petFriendly && <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"><Shield className="w-3 h-3" />Pet Friendly</span>}
              {property.parking && <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"><Car className="w-3 h-3" />Parking</span>}
              {property.utilities && <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"><Wifi className="w-3 h-3" />Utilities</span>}
            </div>
            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-2">
              {Array.isArray(property.amenities) && property.amenities.slice(0, 4).map((amenity, idx) => (
                <span key={`${property.id}-amenity-${idx}-${amenity.amenity.name}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {/* Use getAmenityIcon if available in scope */}
                  {typeof getAmenityIcon === 'function' ? getAmenityIcon(amenity.amenity.name) : null}{amenity.amenity.name}
                </span>
              ))}
              {Array.isArray(property.amenities) && property.amenities.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{property.amenities.length - 4} more</span>}
            </div>
            {/* Landlord Chip */}
            <div className="flex items-center gap-2 mt-2 mb-1">
              <div className="w-8 h-8 bg-[var(--color-primary-500)] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{property.owner.name.charAt(0)}</span>
              </div>
              <span className="font-semibold text-gray-900 text-xs">{property.owner.name}</span>
              {property.owner.verified && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">✓ Verified</span>}
              <span className="flex items-center gap-1 text-xs text-gray-500 ml-2"><Star className="w-3 h-3 text-yellow-400 fill-current" />{property.owner.rating}</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => openPropertyModal(property)}
              className="flex-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white py-3 px-4 rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Details
            </button>
            <button
              onClick={() => onContact ? onContact(property) : null}
              className="px-4 py-3 border-2 border-[var(--color-primary-200)] text-[var(--color-primary-200)] rounded-xl hover:bg-[var(--color-primary-200)] hover:text-[var(--color-primary-800)] transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Phone className="w-4 h-4" />Contact
            </button>
            {isListView && (
              <button
                onClick={() => onContact ? onContact(property) : null}
                className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />Message
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Fetch user's favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/favorites');

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please sign in to view your favorites');
          } else if (response.status === 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to fetch favorites (${response.status})`);
          }
        }

        const data = await response.json();

        if (!data.favorites) {
          throw new Error('Invalid response from server');
        }

        // Map and normalize favorite properties
        let favoriteProperties = data.favorites.map((favorite: any) => {
          const property = favorite.property;
          return {
            ...property,
            id: property.id,
            title: property.title,
            location: property.location,
            price: property.price,
            type: property.type,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            rating: property.rating || 0,
            image: property.images?.[0]?.url || '',
            images: property.images || [],
            amenities: property.amenities || [],
            addedDate: favorite.createdAt,
            owner: property.owner || {},
            isFavorite: true,
            isAvailable: property.status === 'ACTIVE',
            distance: property.location && property.location.split(" ").length > 1 ? property.location.split(" ")[1] : "1.0 km",
          };
        });
        setFavorites(favoriteProperties);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch favorites';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user]);

  // Apply filtering and sorting to favorites with useMemo for stable references
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = [...favorites];

    // Apply client-side filtering
    if (selectedType !== "All") {
      filtered = filtered.filter((p: Property) => p.type === selectedType);
    }

    // Apply client-side sorting
    filtered = filtered.sort((a: Property, b: Property) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          const aDistance = a.location && a.location.split(" ").length > 1 ? parseFloat(a.location.split(" ")[1]) : 1.0;
          const bDistance = b.location && b.location.split(" ").length > 1 ? parseFloat(b.location.split(" ")[1]) : 1.0;
          return aDistance - bDistance;
        case "date":
        default:
          return new Date(b.addedDate || '').getTime() - new Date(a.addedDate || '').getTime();
      }
    });

    return filtered;
  }, [favorites, selectedType, sortBy]);

  const removeFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove favorite');

      setFavorites(favorites.filter((fav) => fav.id !== id));

      // Track analytics
      trackAnalyticsEvent('favorite_removed', id);
      showSuccess('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showError('Failed to remove from favorites');
    }
  };

  const toggleFavorite = async (id: string) => {
    if (!session?.user) {
      // Show a toast to prompt login
      showError("Please sign in to save properties to your favorites");
      return;
    }

    // Find the property
    const property = favorites.find(p => p.id === id);
    if (!property) {
      console.error(`Property with ID ${id} not found`);
      return;
    }

    // Get the current favorite state before toggling
    const wasAlreadyFavorite = property.isFavorite;
    console.log(`Toggling favorite for property ${id}. Was favorite: ${wasAlreadyFavorite}`);

    // IMMEDIATELY update UI - don't wait for API response
    setFavorites(prev => {
      // Create a new array to ensure state updates are detected
      const updated = prev.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      );
      console.log(`Updated properties state. Property ${id} isFavorite now: ${!wasAlreadyFavorite}`);
      return updated;
    });

    // If we also have a selected property in the modal that matches this ID, update it too
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty({
        ...selectedProperty,
        isFavorite: !wasAlreadyFavorite
      });
    }

    // Show a subtle toast notification
    const action = wasAlreadyFavorite ? "Removed from" : "Added to";
    showSuccess(`${action} favorites`);

    // Track analytics
    const eventType = wasAlreadyFavorite ? 'favorite_removed' : 'favorite_added';
    trackAnalyticsEvent(eventType, id);

    // Perform API operation in background
    try {
      if (wasAlreadyFavorite) {
        // Remove from favorites
        console.log(`Sending DELETE request for property ${id}`);
        fetch(`/api/favorites/${id}`, {
          method: 'DELETE',
        }).then(response => {
          console.log(`DELETE response status: ${response.status}`);
          return response.json();
        }).then(data => {
          console.log('DELETE response data:', data);
        }).catch(err => {
          console.error('Error removing favorite:', err);
          // Silent failure - UI was already updated
        });
      } else {
        // Add to favorites
        console.log(`Sending POST request for property ${id}`);
        fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: id })
        }).then(response => {
          console.log(`POST response status: ${response.status}`);
          return response.json();
        }).then(data => {
          console.log('POST response data:', data);
        }).catch(err => {
          console.error('Error adding favorite:', err);
          // Silent failure - UI was already updated
        });
      }
    } catch (error) {
      console.error('Error in favorite toggle background process:', error);
      // We don't revert the UI since that would create a confusing experience
      // The user has already seen the update, so we keep it that way even if the backend fails
    }
  };

  // Handle contact from property card
  const handlePropertyContact = (property: any) => {
    // Track analytics
    trackAnalyticsEvent('favorites_property_contact', property.id);

    // Open the property modal for contact options
    const favoriteProperty = favorites.find(fav => fav.id === property.id);
    if (favoriteProperty) {
      openPropertyModal(favoriteProperty);
    }

    showSuccess('Opening property details. You can contact the owner from there.');
  };

  // Fetch property reviews
  const fetchPropertyReviews = async (propertyId: string, page = 1) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`/api/reviews?propertyId=${propertyId}&page=${page}&limit=5`);

      if (!response.ok) {
        // Don't show error for 404 (no reviews) or other expected errors
        if (response.status === 404) {
          setReviews([]);
          setReviewPagination({
            page: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setReviewPagination(data.pagination || {
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Only show error for unexpected network issues, not for expected cases
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - don't show toast, just log
        console.warn('Network error fetching reviews:', error);
      } else {
        // Other errors - show a more user-friendly message
        console.warn('Could not load reviews:', error);
      }
      // Set empty state instead of showing error
      setReviews([]);
      setReviewPagination({
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle pagination for reviews
  const handleReviewPageChange = (newPage: number) => {
    if (selectedProperty) {
      setReviewPagination(prev => ({ ...prev, page: newPage }));
      fetchPropertyReviews(selectedProperty.id, newPage);
    }
  };

  // Submit a new review
  const submitReview = async () => {
    if (!session?.user) {
      showError('Please sign in to leave a review');
      return;
    }

    if (!selectedProperty) return;

    if (userReview.rating === 0) {
      showError('Please select a rating');
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          rating: userReview.rating,
          comment: userReview.comment || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          if (data.error?.includes('already reviewed')) {
            throw new Error('You have already reviewed this property');
          } else if (data.error?.includes('booked')) {
            throw new Error('You can only review properties you have booked');
          } else if (data.error?.includes('Validation error')) {
            throw new Error('Please provide a valid rating and comment (minimum 10 characters)');
          }
        }
        throw new Error(data.error || 'Failed to submit review');
      }

      // Refresh reviews
      fetchPropertyReviews(selectedProperty.id);

      // Track analytics
      trackAnalyticsEvent('review_submitted', selectedProperty.id, {
        rating: userReview.rating,
        hasComment: !!userReview.comment
      });

      // Reset review form
      setUserReview({
        rating: 5,
        comment: ''
      });

      // Show success message
      showSuccess('Review submitted successfully');

    } catch (error) {
      console.error('Error submitting review:', error);
      showError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle booking a viewing
  const handleBookViewing = () => {
    if (!session?.user) {
      showError('Please sign in to book a viewing');
      return;
    }
    setShowBookingModal(true);
  };

  // Submit booking
  const submitBooking = async () => {
    if (!selectedProperty || !bookingDate || !bookingTime) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          date: bookingDate,
          time: bookingTime,
          note: bookingNote
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book viewing');
      }

      showSuccess('Viewing booked successfully! The owner will contact you soon.');
      setShowBookingModal(false);
      setBookingDate('');
      setBookingTime('');
      setBookingNote('');

      // Track analytics
      trackAnalyticsEvent('booking_request', selectedProperty.id);
    } catch (error) {
      console.error('Error booking viewing:', error);
      showError('Failed to book viewing. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle phone contact
  const handlePhoneContact = () => {
    if (!selectedProperty) return;

    trackAnalyticsEvent('phone_contact', selectedProperty.id);
    showSuccess('Phone number requested. The owner will contact you shortly.');
  };

  // Handle email contact
  const handleEmailContact = () => {
    if (!selectedProperty) return;

    trackAnalyticsEvent('email_contact', selectedProperty.id);
    showSuccess('Email request sent. Check your inbox for follow-up information.');
  };

  // Handle share property
  const handleShareProperty = () => {
    if (!selectedProperty) return;

    const url = `${window.location.origin}/property/${selectedProperty.id}`;
    navigator.clipboard.writeText(url);
    trackAnalyticsEvent('property_shared', selectedProperty.id);
    showSuccess('Property link copied to clipboard!');
  };

  // Helper to map FavoriteProperty to PropertyCard expected shape
  const mapFavoriteToPropertyCard = (fav: Property) => ({
    ...fav,
    images: Array.isArray(fav.images) && fav.images.length > 0
      ? fav.images.map((img, i) => ({
        id: i.toString(),
        url: typeof img === 'string' ? img : img.url,
        order: i,
        isCover: i === 0
      }))
      : fav.image
        ? [{ id: "0", url: fav.image, order: 0, isCover: true }]
        : [],
    amenities: Array.isArray(fav.amenities) ? fav.amenities : [],
    owner: fav.owner ? {
      id: fav.id,
      name: fav.owner.name,
      verified: fav.owner.verified,
      rating: fav.owner.rating
    } : {
      id: fav.id,
      name: '',
      verified: false
    },
    isAvailable: true,
    isFavorite: true,
    // Add missing required properties
    status: 'ACTIVE',
    utilities: false,
    petFriendly: false,
    furnished: false,
    parking: false,
    views: 0,
    earnings: 0,
    occupancy: 0,
    lastUpdated: fav.addedDate,
    createdAt: fav.addedDate,
    updatedAt: fav.addedDate,
    ownerId: fav.id,
    _count: { favorites: 0, reviews: 0, inquiries: 0 },
  });



  // Helper to map FavoriteProperty to PropertyDetailsModal expected shape
  const mapFavoriteToFullProperty = (fav: Property) => ({
    ...fav,
    images: Array.isArray(fav.images) && fav.images.length > 0
      ? fav.images.map((img, i) => ({
        id: i.toString(),
        url: typeof img === 'string' ? img : img.url,
        order: i,
        isCover: i === 0
      }))
      : fav.image
        ? [{ id: "0", url: fav.image, order: 0, isCover: true }]
        : [],
    amenities: Array.isArray(fav.amenities) ? fav.amenities : [],
    status: fav.status || 'ACTIVE',
    isFavorite: true,
    isAvailable: fav.isAvailable !== undefined ? fav.isAvailable : true,
    availableFrom: fav.availableFrom,
    description: fav.description || "",
    latitude: fav.latitude,
    longitude: fav.longitude,
    owner: fav.owner
      ? { id: fav.id, name: fav.owner.name, verified: fav.owner.verified, rating: fav.owner.rating }
      : { id: fav.id, name: "", verified: false },
    utilities: fav.utilities !== undefined ? fav.utilities : false,
    petFriendly: fav.petFriendly !== undefined ? fav.petFriendly : false,
    furnished: fav.furnished !== undefined ? fav.furnished : false,
    parking: fav.parking !== undefined ? fav.parking : false,
    _count: fav._count || { favorites: 0, reviews: 0, inquiries: 0 },
    reviews: fav.reviews || [],
    addedDate: fav.addedDate,
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };



  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Favorites</h2>
              <div className="text-red-600 text-lg mb-6 max-w-md mx-auto">{error}</div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    // Retry fetching
                    const fetchFavorites = async () => {
                      if (!session?.user) return;
                      try {
                        const response = await fetch('/api/favorites');
                        if (!response.ok) {
                          if (response.status === 401) {
                            throw new Error('Please sign in to view your favorites');
                          } else if (response.status === 500) {
                            throw new Error('Server error. Please try again later.');
                          } else {
                            throw new Error(`Failed to fetch favorites (${response.status})`);
                          }
                        }
                        const data = await response.json();
                        if (!data.favorites) {
                          throw new Error('Invalid response from server');
                        }
                        let favoriteProperties = data.favorites.map((favorite: any) => {
                          const property = favorite.property;
                          return {
                            ...property,
                            id: property.id,
                            title: property.title,
                            location: property.location,
                            price: property.price,
                            type: property.type,
                            bedrooms: property.bedrooms,
                            bathrooms: property.bathrooms,
                            rating: property.rating || 0,
                            image: property.images?.[0]?.url || '',
                            images: property.images || [],
                            amenities: property.amenities || [],
                            addedDate: favorite.createdAt,
                            owner: property.owner || {},
                            isFavorite: true,
                            isAvailable: property.status === 'ACTIVE',
                            distance: property.location && property.location.split(" ").length > 1 ? property.location.split(" ")[1] : "1.0 km",
                          };
                        });
                        setFavorites(favoriteProperties);
                        setError(null);
                      } catch (err) {
                        console.error('Error fetching favorites:', err);
                        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch favorites';
                        setError(errorMessage);
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchFavorites();
                  }}
                  className="bg-[var(--color-primary-500)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/listings'}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasFavorites = favorites.length > 0;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apply background pattern styles */}
      <style jsx global>{backgroundPatternStyles}</style>

      {/* Fixed Header */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-50">
            {/* Grid Pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>

            {/* Floating geometric shapes */}
            <div className="absolute top-10 left-10 w-16 h-16 border border-white/15 rounded-full floating-shape"></div>
            <div className="absolute top-32 right-20 w-12 h-12 border border-white/15 transform rotate-45 floating-shape" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-8 h-8 border border-white/15 rounded-full pulsing-shape"></div>
            <div className="absolute bottom-32 right-1/3 w-16 h-16 border border-white/15 transform rotate-12 floating-shape" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    My Favorites
                  </h1>
                  <p className="text-xl text-white/90">
                    {hasFavorites ? 'Your saved student accommodation listings' : 'Start saving your favorite student homes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats and Filters Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Stats Display */}
                  <div className="md:col-span-2 flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                      <p className="text-sm text-gray-600">Saved Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{filteredAndSortedFavorites.length > 0 ? Math.round(filteredAndSortedFavorites.reduce((sum, p) => sum + p.price, 0) / filteredAndSortedFavorites.length).toLocaleString() : '0'}
                      </p>
                      <p className="text-sm text-gray-600">Average Price</p>
                    </div>
                  </div>

                  {/* Property Type Filter */}
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-end md:col-span-2">
                    <div ref={propertyTypeRef} className="md:w-48 w-full md:mr-4 relative">
                      <button
                        type="button"
                        onClick={() => setShowPropertyTypeModal(!showPropertyTypeModal)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-gray-900 bg-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {(() => {
                            const typeOption = PROPERTY_TYPE_OPTIONS.find(t => t.value === selectedType);
                            return (
                              <>
                                <span className={`text-xl flex items-center justify-center w-7 h-7 rounded-md text-gray-700`}>
                                  {typeOption?.icon}
                                </span>
                                <span>{typeOption?.label}</span>
                              </>
                            );
                          })()}
                        </div>
                        <span>{showPropertyTypeModal ? "▲" : "▼"}</span>
                      </button>

                      {/* Dropdown Portal */}
                      <DropdownPortal
                        isOpen={showPropertyTypeModal}
                        onClose={() => setShowPropertyTypeModal(false)}
                        triggerRef={propertyTypeRef}
                        className="max-h-[320px] overflow-y-auto p-2 custom-scrollbar"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                        }}
                      >
                        {PROPERTY_TYPE_OPTIONS.map(type => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedType(type.value);
                              setShowPropertyTypeModal(false);
                            }}
                            className={`w-full text-left px-3 py-2 mb-1 rounded-lg flex items-center ${selectedType === type.value ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)]" : "text-gray-700 hover:bg-gray-100"}`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className={`text-xl flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${type.color === 'blue' ? 'bg-blue-200 text-blue-800' :
                                  type.color === 'purple' ? 'bg-purple-200 text-purple-800' :
                                    type.color === 'green' ? 'bg-green-200 text-green-800' :
                                      type.color === 'yellow' ? 'bg-amber-200 text-amber-800' :
                                        type.color === 'pink' ? 'bg-pink-200 text-pink-800' :
                                          type.color === 'orange' ? 'bg-orange-200 text-orange-800' :
                                            type.color === 'teal' ? 'bg-teal-200 text-teal-800' :
                                              'bg-gray-200 text-black'
                                }`}>{type.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs truncate">{type.description}</div>
                              </div>
                              {selectedType === type.value && (
                                <span className="ml-auto text-[var(--color-primary-600)]">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </DropdownPortal>
                    </div>

                    <div ref={sortByRef} className="md:w-56 w-full relative">
                      <button
                        type="button"
                        onClick={() => setShowSortByModal(!showSortByModal)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-gray-900 bg-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {(() => {
                            const sortOption = SORT_OPTIONS.find(s => s.value === sortBy);
                            return (
                              <>
                                <span className={`text-xl flex items-center justify-center w-7 h-7 rounded-md text-gray-700`}>
                                  {sortOption?.icon}
                                </span>
                                <span>{sortOption?.label}</span>
                              </>
                            );
                          })()}
                        </div>
                        <span>{showSortByModal ? "▲" : "▼"}</span>
                      </button>

                      {/* Sort Options Dropdown Portal */}
                      <DropdownPortal
                        isOpen={showSortByModal}
                        onClose={() => setShowSortByModal(false)}
                        triggerRef={sortByRef}
                        className="w-full max-h-[320px] overflow-y-auto p-2 custom-scrollbar"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                        }}
                      >
                        {SORT_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowSortByModal(false);
                            }}
                            className={`w-full text-left px-3 py-2 mb-1 rounded-lg flex items-center ${sortBy === option.value ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)]" : "text-gray-700 hover:bg-gray-100"}`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className="text-xl flex-shrink-0">{option.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs">{option.description}</div>
                              </div>
                              {sortBy === option.value && (
                                <span className="ml-auto text-[var(--color-primary-600)]">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </DropdownPortal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Saved Properties
              </h2>
              <p className="text-gray-600">
                Showing {filteredAndSortedFavorites.length} of {favorites.length} favorites
              </p>
            </div>
          </div>

          {/* Favorites Grid */}
          {loading ? (
            <FavoritesListSkeleton isMobile={isMobile} />
          ) : filteredAndSortedFavorites.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-14 h-14 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">Start exploring properties and save your favorites</p>
              <a
                href="/listings"
                className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white px-8 py-4 rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 inline-block"
              >
                Browse Properties
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
              {filteredAndSortedFavorites.map((property) => (
                <div key={property.id} className="flex justify-center h-full">
                  <PropertyCard
                    property={property}
                    onContact={handlePropertyContact}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal - Render desktop or mobile version based on screen size */}
      {showModal && selectedProperty && (
        <>
          {isMobile ? (
            <MobilePropertyModal
              property={selectedProperty!}
              toggleFavorite={toggleFavorite}
              closePropertyModal={closePropertyModal}
              onBookViewing={(propertyId) => {
                closePropertyModal();
                setTimeout(() => {
                  const foundProperty = favorites.find(p => p.id === propertyId);
                  if (foundProperty) {
                    openPropertyModal(foundProperty);
                    setTimeout(() => setShowBookingModal(true), 300);
                  }
                }, 300);
              }}
              onPhoneContact={(propertyId) => {
                trackAnalyticsEvent('phone_contact', propertyId);
                showSuccess('Phone number requested. The owner will contact you shortly.');
              }}
              onEmailContact={(propertyId) => {
                trackAnalyticsEvent('email_contact', propertyId);
                showSuccess('Email request sent. Check your inbox for follow-up information.');
              }}
              onShare={(propertyId) => {
                const url = `${window.location.origin}/property/${propertyId}`;
                navigator.clipboard.writeText(url);
                trackAnalyticsEvent('property_shared', propertyId);
                showSuccess('Property link copied to clipboard!');
              }}
            />
          ) : (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2 sm:px-4 overflow-y-auto custom-scrollbar"
              aria-modal="true"
              role="dialog"
              tabIndex={-1}
              data-testid="property-details-modal"
              onKeyDown={e => { if (e.key === 'Escape') closePropertyModal(); }}
            >
              {/* Overlay click to close */}
              <div
                className="absolute inset-0 z-0 cursor-pointer backdrop-blur-sm"
                aria-label="Close modal"
                onClick={closePropertyModal}
              />
              {/* Modal Container */}
              <div
                className="relative w-full max-w-5xl xl:max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-fade-in-up my-4 sm:my-8 max-h-[90vh] focus:outline-none border border-white"
                tabIndex={0}
                onClick={e => e.stopPropagation()}
                data-testid="property-modal-root"
              >
                {/* Close Button */}
                <button
                  onClick={closePropertyModal}
                  className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none transition-all hover:scale-110"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>

                {/* Left: Image Gallery */}
                <div className="lg:w-1/2 w-full flex flex-col min-w-0 bg-gray-900 max-h-[40vh] lg:max-h-[90vh] overflow-hidden relative">
                  {/* Main Image with zoom effect */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedProperty!.images[currentImageIndex]?.url || '/images/placeholder.png'}
                      alt={selectedProperty!.title}
                      className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
                      onError={e => (e.currentTarget.src = '/images/placeholder.png')}
                    />

                    {/* Image Navigation - Enhanced with larger hit areas and better positioning */}
                    {Array.isArray(selectedProperty!.images) && selectedProperty!.images.length > 1 && (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setCurrentImageIndex((currentImageIndex - 1 + selectedProperty!.images.length) % selectedProperty!.images.length);
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none"
                          aria-label="Previous image"
                        >
                          <ChevronDown className="w-6 h-6 rotate-90 text-gray-800" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setCurrentImageIndex((currentImageIndex + 1) % selectedProperty!.images.length);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none"
                          aria-label="Next image"
                        >
                          <ChevronDown className="w-6 h-6 -rotate-90 text-gray-800" />
                        </button>
                      </>
                    )}

                    {/* Image Counter Badge - Enhanced */}
                    {Array.isArray(selectedProperty!.images) && selectedProperty!.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 shadow-xl flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{currentImageIndex + 1}/{selectedProperty!.images.length}</span>
                      </div>
                    )}

                    {/* Status Badge - Enhanced */}
                    <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10 bg-green-500 text-white border border-white/30 backdrop-blur-sm">
                      {selectedProperty!.isAvailable ? "Available Now" : "Not Available"}
                    </div>

                    {/* Floating Price Badge - Enhanced */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] px-5 py-2.5 rounded-xl shadow-xl border border-white/60 text-white font-bold flex items-center gap-2">
                      <span className="text-xl">₹{selectedProperty!.price.toLocaleString()}</span>
                      <span className="text-sm font-normal opacity-90">/month</span>
                    </div>

                    {/* Property type badge */}
                    <div className="absolute top-18 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-[var(--color-primary-700)] text-sm font-medium border border-[var(--color-primary-100)] flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-[var(--color-primary-600)]" />
                      {selectedProperty!.type}
                    </div>

                  </div>

                  {/* Thumbnails - Enhanced gallery strip */}
                  {Array.isArray(selectedProperty!.images) && selectedProperty!.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar bg-gray-800 border-t border-gray-700">
                      {selectedProperty!.images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === idx
                              ? 'border-[var(--color-primary-500)] shadow-lg shadow-[var(--color-primary-500)]/30'
                              : 'border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          <img
                            src={img.url}
                            alt={`Property image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Key Property Stats - Feature row at bottom */}
                  <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-gray-800 text-white border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Bed className="w-5 h-5 text-[var(--color-primary-300)]" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{selectedProperty!.bedrooms}</div>
                        <div className="text-xs text-gray-300">Bedrooms</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Bath className="w-5 h-5 text-[var(--color-primary-300)]" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{selectedProperty!.bathrooms}</div>
                        <div className="text-xs text-gray-300">Bathrooms</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-[var(--color-primary-300)]" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {selectedProperty!.availableFrom ? new Date(selectedProperty!.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 'Now'}
                        </div>
                        <div className="text-xs text-gray-300">Available From</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Details Section */}
                <div className="lg:w-1/2 w-full flex flex-col min-w-0 bg-white h-[50vh] lg:h-auto lg:max-h-[90vh] overflow-y-auto custom-scrollbar pb-20 lg:pb-0">
                  {/* Header: Title, Location, Rating */}
                  <div className="sticky top-0 px-6 pt-6 pb-4 bg-white z-20 border-b border-gray-100 shadow-sm">
                    {/* Title with enhanced typography */}
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-[var(--color-primary-100)] bg-clip-text text-transparent leading-tight" title={selectedProperty!.title}>
                      {selectedProperty!.title}
                    </h2>

                    {/* Location and Rating Row */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2 text-[var(--color-primary-700)] text-sm bg-[var(--color-primary-50)] px-3 py-1.5 rounded-lg">
                        <MapPin className="w-4 h-4 text-[var(--color-primary-500)]" />
                        <span>{selectedProperty!.location}</span>
                      </div>

                      {/* Rating - Enhanced */}
                      <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-50 to-yellow-100 px-3 py-1.5 rounded-lg shadow-sm border border-yellow-200">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= Math.round(selectedProperty!.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-yellow-700">{selectedProperty!.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main content area */}
                  <div className="px-6">
                    {/* Quick Features Row - Improved layout */}
                    <div className="flex flex-wrap gap-2 my-4">
                      {selectedProperty!.furnished && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium border border-green-200"><Home className="w-4 h-4" /> Furnished</span>}
                      {selectedProperty!.petFriendly && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium border border-blue-200"><Shield className="w-4 h-4" /> Pet Friendly</span>}
                      {selectedProperty!.parking && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium border border-purple-200"><Car className="w-4 h-4" /> Parking</span>}
                      {selectedProperty!.utilities && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-lg font-medium border border-orange-200"><Wifi className="w-4 h-4" /> Utilities Included</span>}
                    </div>

                    {/* Description - Enhanced typography */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 my-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                          <BookOpen className="w-4 h-4 text-[var(--color-primary-600)]" />
                        </div>
                        Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{selectedProperty!.description}</p>
                    </div>

                    {/* Amenities - Enhanced grid layout */}
                    <div className="my-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                          <Dumbbell className="w-4 h-4 text-[var(--color-primary-600)]" />
                        </div>
                        Amenities
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Array.isArray(selectedProperty!.amenities) && selectedProperty!.amenities.map((amenity, idx) => (
                          <div
                            key={`${selectedProperty!.id}-amenity-${idx}`}
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                          >
                            <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                              {getAmenityIcon(amenity.amenity.name)}
                            </div>
                            <span className="text-gray-800">{amenity.amenity.name}</span>
                          </div>
                        ))}
                        50                </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="my-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                          <MessageSquare className="w-4 h-4 text-[var(--color-primary-600)]" />
                        </div>
                        Reviews ({selectedProperty!._count.reviews})
                      </h4>

                      {/* Review List */}
                      <div className="space-y-4 mb-6">
                        {reviewsLoading ? (
                          <div className="flex justify-center items-center py-6">
                            <Loader2 className="w-8 h-8 text-[var(--color-primary-500)] animate-spin" />
                          </div>
                        ) : Array.isArray(reviews) && reviews.length > 0 ? (
                          <>
                            {reviews.map(review => (
                              <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[var(--color-primary-500)] rounded-full flex items-center justify-center">
                                      {review.user.image ? (
                                        <img
                                          src={review.user.image}
                                          alt={review.user.name}
                                          className="w-full h-full object-cover rounded-full"
                                        />
                                      ) : (
                                        <span className="text-xs font-bold text-white">{review.user.name.charAt(0)}</span>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{review.user.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                          key={star}
                                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {review.comment && (
                                  <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                                )}
                              </div>
                            ))}

                            {/* Pagination controls */}
                            {reviewPagination.totalPages > 1 && (
                              <div className="flex justify-center mt-4 gap-2">
                                <button
                                  onClick={() => handleReviewPageChange(reviewPagination.page - 1)}
                                  disabled={!reviewPagination.hasPrev}
                                  className={`p-2 rounded-lg ${reviewPagination.hasPrev
                                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                  Previous
                                </button>
                                <div className="flex items-center px-3 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-lg">
                                  {reviewPagination.page} / {reviewPagination.totalPages}
                                </div>
                                <button
                                  onClick={() => handleReviewPageChange(reviewPagination.page + 1)}
                                  disabled={!reviewPagination.hasNext}
                                  className={`p-2 rounded-lg ${reviewPagination.hasNext
                                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                  Next
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                            <div className="text-gray-500 mb-2">No reviews yet</div>
                            <div className="text-sm text-gray-400">Be the first to leave a review!</div>
                          </div>
                        )}
                      </div>

                      {/* Leave a review form */}
                      {session?.user ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-3">Leave a Review</h5>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= userReview.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300 hover:text-yellow-200'
                                      }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                            <textarea
                              value={userReview.comment}
                              onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                              placeholder="Share your experience..."
                              rows={3}
                            />
                          </div>
                          <button
                            onClick={submitReview}
                            disabled={isSubmittingReview}
                            className="w-full py-2 px-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-lg hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            {isSubmittingReview ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            Submit Review
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-200)]">
                          <p className="text-[var(--color-primary-700)]">Please sign in to leave a review</p>
                        </div>
                      )}
                    </div>

                    {/* Landlord Info - Enhanced card */}
                    <div className="my-6 bg-[var(--color-primary-800)] p-5 rounded-xl border border-[var(--color-primary-500)]">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                          <User className="w-4 h-4 text-[var(--color-primary-600)]" />
                        </div>
                        Property Owner
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full flex items-center justify-center text-xl font-bold text-white">
                          {selectedProperty!.owner.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-lg font-semibold text-gray-900">{selectedProperty!.owner.name}</p>
                            {selectedProperty!.owner.verified && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-700">{selectedProperty!.owner.rating || '4.8'}</span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">Response time: ~2 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar - Sticky at bottom with enhanced buttons */}
                  <div className="sticky bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-6 py-4 mt-auto">
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={handleBookViewing}
                        className="flex-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white py-3.5 px-4 rounded-xl font-medium hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                      >
                        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Book Viewing</span>
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={handlePhoneContact}
                          className="p-3.5 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-[var(--color-primary-700)] rounded-xl hover:bg-[var(--color-primary-100)] transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleEmailContact}
                          className="p-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleModalFavoriteToggle}
                          className="p-2.5 rounded-xl flex items-center justify-center"
                          aria-label={modalFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`w-7 h-7 ${modalFavorite
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400 stroke-[2px] hover:text-red-400"
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2 sm:px-4">
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setShowBookingModal(false)}></div>
          <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 animate-fade-in-up">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Book a Viewing</h3>
            <p className="text-gray-600 mb-6">Schedule a viewing for {selectedProperty.title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                  placeholder="Any special requests or questions?"
                  rows={3}
                ></textarea>
              </div>

              <button
                onClick={submitBooking}
                disabled={isSubmittingBooking}
                className="w-full py-3 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-lg font-medium hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-colors flex items-center justify-center"
              >
                {isSubmittingBooking ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {isSubmittingBooking ? 'Booking...' : 'Book Viewing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
} 