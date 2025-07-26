"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Heart,
  Home,
  Building2,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Shield,
  BookOpen,
  Calendar,
  Grid,
  List,
  Map,
  X,
  ChevronDown,
  Phone,
  Mail,
  Bed,
  Bath,
  Loader2,
  CheckCircle,
  Eye,
  MapIcon,
  User,
  Clock,
  ArrowUp,
  ArrowDown,
  Send,
  MessageSquare,
  Share2,
} from "lucide-react";
import { FaRupeeSign as Rupee } from "react-icons/fa";
import { trackAnalyticsEvent } from '@/lib/api-client';
import { showSuccess, showError } from '@/lib/toast';
import Image from 'next/image';

// Define custom CSS for scrollbars
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
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

// Define the coordinates type
interface Coordinates {
  lat: number;
  lng: number;
}

// Define the PropertyMarker type to match MapFullScreen expectations
/* interface PropertyMarker {
  id: string;
  coordinates: Coordinates;
  title: string;
  type: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  bedrooms?: number;
  bathrooms?: number;
} */

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
  reviews?: Review[]; // Add this line
}
/* 
interface SearchFilters {
  search?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  sortBy?: string;
  sortOrder?: string;
  verified?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  parking?: boolean;
  utilities?: boolean;
  page?: number;
  limit?: number;
}
 */
// 1. Add skeleton loader components at the top of the file:
function PropertiesListSkeleton({ isMobile = false }: { isMobile?: boolean } = {}) {
  if (isMobile) {
    // Mobile skeleton: simpler, more compact
  return (
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden animate-pulse">
            {/* Image */}
            <div className="relative h-44 w-full shimmer">
              <div className="absolute top-3 left-3 h-5 w-16 rounded-full shimmer" />
              <div className="absolute bottom-3 right-3 h-5 w-12 rounded-full shimmer" />
              <div className="absolute bottom-3 left-3 h-8 w-20 rounded-xl shimmer" />
              <div className="absolute top-3 right-3 h-8 w-8 rounded-full shimmer" />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="h-5 w-2/3 rounded shimmer mb-1" />
              <div className="h-4 w-1/2 rounded shimmer mb-1" />
              <div className="flex gap-4 mb-1">
                <div className="h-4 w-8 rounded shimmer" />
                <div className="h-4 w-8 rounded shimmer" />
                <div className="h-4 w-12 rounded shimmer" />
              </div>
              <div className="flex flex-wrap gap-2 mb-1">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="h-5 w-16 rounded-full shimmer" />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full shimmer" />
                <div className="h-4 w-16 rounded shimmer" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex-1 h-10 rounded-xl shimmer" />
                <div className="w-10 h-10 rounded-xl shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // Desktop skeleton: accurate to PropertyCard
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex justify-center">
          <div className="w-full max-w-xl min-w-[380px]">
            <div
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 group relative transition-all duration-300 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-56 w-full shimmer">
                {/* Status Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 h-6 w-20 rounded-full shimmer" />
                {/* Type Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 h-6 w-16 rounded-full shimmer" />
                {/* Price Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 h-10 w-28 rounded-xl shimmer" />
                {/* Favorite Button */}
                <div className="absolute top-4 right-4 p-2 h-10 w-10 rounded-full shimmer" />
          </div>
              {/* Info Panel */}
              <div className="flex flex-col justify-between p-6 gap-4 flex-1">
                <div className="flex flex-col gap-4">
                  {/* Title, Location, Rating */}
                  <div className="flex items-start justify-between gap-2 min-w-0 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="h-7 w-3/4 rounded shimmer mb-2" />
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-4 w-4 rounded-full shimmer" />
                        <div className="h-4 w-24 rounded shimmer" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2 bg-yellow-50 px-2 py-1 rounded-lg">
                      <div className="h-4 w-4 rounded-full shimmer" />
                      <div className="h-4 w-6 rounded shimmer" />
                    </div>
                  </div>
                  {/* Property Stats */}
                  <div className="flex gap-6 mb-2">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full shimmer mb-1" />
                      <div className="h-3 w-8 rounded shimmer" />
                      <div className="h-3 w-6 rounded shimmer mt-1" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full shimmer mb-1" />
                      <div className="h-3 w-8 rounded shimmer" />
                      <div className="h-3 w-6 rounded shimmer mt-1" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full shimmer mb-1" />
                      <div className="h-3 w-12 rounded shimmer" />
                      <div className="h-3 w-10 rounded shimmer mt-1" />
                    </div>
                  </div>
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="h-6 w-24 rounded-full shimmer" />
                    ))}
                  </div>
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-6 w-20 rounded-full shimmer" />
                    ))}
                  </div>
                  {/* Landlord Chip */}
                  <div className="flex items-center gap-2 mt-2 mb-1">
                    <div className="w-8 h-8 rounded-full shimmer" />
                    <div className="h-4 w-20 rounded shimmer" />
                    <div className="h-4 w-12 rounded shimmer" />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <div className="flex-1 h-12 rounded-xl shimmer" />
                  <div className="w-14 h-12 rounded-xl shimmer" />
                  <div className="w-14 h-12 rounded-xl shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
/* 
function SidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-40 flex flex-col gap-3">
        <div className="h-6 w-1/2 rounded shimmer mb-2" />
        <div className="h-4 w-2/3 rounded shimmer mb-1" />
        <div className="h-4 w-1/3 rounded shimmer mb-1" />
        <div className="h-4 w-1/4 rounded shimmer mb-1" />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 h-40 flex flex-col gap-3">
        <div className="h-6 w-1/2 rounded shimmer mb-2" />
        <div className="h-4 w-2/3 rounded shimmer mb-1" />
        <div className="h-4 w-1/3 rounded shimmer mb-1" />
        <div className="h-4 w-1/4 rounded shimmer mb-1" />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 h-40 flex flex-col gap-3">
        <div className="h-6 w-1/2 rounded shimmer mb-2" />
        <div className="h-4 w-2/3 rounded shimmer mb-1" />
        <div className="h-4 w-1/3 rounded shimmer mb-1" />
        <div className="h-4 w-1/4 rounded shimmer mb-1" />
      </div>
    </div>
  );
} */

// Define MobilePropertyModal after ListingsPage, passing required props
interface MobilePropertyModalProps {
  property: Property;
  toggleFavorite: (id: string) => void;
  closePropertyModal: () => void;
  onBookViewing: (propertyId: string) => void;
  onPhoneContact: (propertyId: string) => void;
  onEmailContact: (propertyId: string) => void;
  onShare: (propertyId: string) => void;
}

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
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto"
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
              className={`w-6 h-6 ${
                mobileModalFavorite 
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
        {property.images.length > 1 && (
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
        {property.images.length > 1 && (
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
            {property.amenities.slice(0, 6).map((amenity, idx) => (
              <span key={`${property.id}-amenity-${idx}-${amenity.amenity.name}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {/* Use getAmenityIcon if available in scope */}
                {typeof getAmenityIcon === 'function' ? getAmenityIcon(amenity.amenity.name) : null}{amenity.amenity.name}
              </span>
            ))}
            {property.amenities.length > 6 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{property.amenities.length - 6} more</span>}
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

export default function ListingsPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const prevCountRef = useRef(0);
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 75000]);
  const [priceRangeText, setPriceRangeText] = useState(['₹0', '₹75,000+']);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
  
  // State for custom dropdowns
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showSortByModal, setShowSortByModal] = useState(false);
  
  // Add state for detecting mobile devices
  const [isMobile, setIsMobile] = useState(false);
  
  // Quick filters state
  const [quickFilters, setQuickFilters] = useState({
    nearCampus: false,
    furnished: false,
    petFriendly: false,
    availableNow: false
  });

  // Refs for clicking outside detection
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);
  const priceRangeRef = useRef<HTMLDivElement>(null);
  
  // Define property types with icons and descriptions
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
    },
    {
      value: "HOSTEL",
      label: "Hostel",
      icon: "🏨",
      description: "Budget-friendly shared accommodation",
      color: "teal"
    }
  ];
  
  // Sort options with icons and descriptions
  const SORT_OPTIONS = [
    {
      value: "relevance",
      label: "Most Relevant",
      icon: <Star className="w-4 h-4 text-[var(--color-primary-500)]" />,
      description: "Default sorting by relevance to your search"
    },
    {
      value: "price-low",
      label: "Price: Low to High",
      icon: <Rupee className="w-4 h-4 text-[var(--color-primary-500)]" />,
      description: "Cheapest properties first"
    },
    {
      value: "price-high",
      label: "Price: High to Low",
      icon: <Rupee className="w-4 h-4 text-[var(--color-primary-500)]" />,
      description: "Luxury properties first"
    },
    {
      value: "rating",
      label: "Highest Rated",
      icon: <Star className="w-4 h-4 text-[var(--color-primary-500)]" />,
      description: "Best-rated properties first"
    },
    {
      value: "distance",
      label: "Nearest First",
      icon: <MapIcon className="w-4 h-4 text-[var(--color-primary-500)]" />,
      description: "Closest to your location"
    },
    {
      value: "newest",
      label: "Newest First",
      icon: <Clock className="w-4 h-4 text-[var(--color-primary-500)]" />,
      description: "Recently added properties"
    }
  ];

  // Close modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close property type modal when clicking outside
      if (showPropertyTypeModal && 
          propertyTypeRef.current && 
          !propertyTypeRef.current.contains(event.target as Node)) {
        setShowPropertyTypeModal(false);
      }
      
      // Close sort by modal when clicking outside
      if (showSortByModal && 
          sortByRef.current && 
          !sortByRef.current.contains(event.target as Node)) {
        setShowSortByModal(false);
      }
    }

    // Add event listener when either modal is shown
    if (showPropertyTypeModal || showSortByModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPropertyTypeModal, showSortByModal]);

  // Update price range text when price range changes
  useEffect(() => {
    const formatPrice = (price: number) => {
      if (price === 0) return '₹0';
      if (price >= 75000) return '₹75,000+';
      return `₹${price.toLocaleString()}`;
    };
    
    setPriceRangeText([formatPrice(priceRange[0]), formatPrice(priceRange[1])]);
  }, [priceRange]);

  // Read search parameter from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
        setDebouncedSearchTerm(searchParam);
      }
    }
  }, []);

  const propertyTypes = [
    "All",
    "APARTMENT",
    "STUDIO",
    "SHARED_HOUSE",
    "LUXURY",
    "ROOM",
    "FAMILY_HOME",
    "HOSTEL",
  ];
  const amenities = [
    "WiFi",
    "Kitchen",
    "Laundry",
    "Gym",
    "Study Room",
    "Parking",
    "Security",
    "Pool",
  ];

  // Detect mobile screens on component mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Typically mobile breakpoint
    };
    
    // Set initial value
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Debounce search term
  useEffect(() => {
    setIsSearching(searchTerm !== debouncedSearchTerm);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, debouncedSearchTerm]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesType =
      selectedType === "All" || property.type === selectedType;
    const matchesPrice =
      property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) =>
        property.amenities.some((a) => a.amenity.name === amenity)
      );
      
    // Quick filters matching
    const matchesNearCampus = !quickFilters.nearCampus || 
      (property.location.toLowerCase().includes('campus') || 
       parseFloat(property.location.split(" ")[1]) < 2); // Less than 2km from campus
    
    const matchesFurnished = !quickFilters.furnished || property.furnished;
    
    const matchesPetFriendly = !quickFilters.petFriendly || property.petFriendly;
    
    const matchesAvailableNow = !quickFilters.availableNow || 
      (property.isAvailable && (!property.availableFrom || new Date(property.availableFrom) <= new Date()));

    return matchesSearch && matchesType && matchesPrice && matchesAmenities && 
           matchesNearCampus && matchesFurnished && matchesPetFriendly && matchesAvailableNow;
  });

  // Animate the count when results change
  useEffect(() => {
    if (isSearching) return;
    
    const resultCount = filteredProperties.length;
    const startCount = prevCountRef.current;
    const endCount = resultCount;
    const duration = 500; // ms
    const frameDuration = 1000/60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    prevCountRef.current = resultCount;
    
    // Don't animate if it's the initial load
    if (startCount === 0 && endCount > 0) {
      setDisplayCount(endCount);
      return;
    }
    
    // Animate the counter
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(startCount + (endCount - startCount) * progress);
      
      setDisplayCount(currentCount);
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [filteredProperties.length, isSearching]);

  // Fetch properties from API
  useEffect(() => {
    setLoading(true); // Start loading as soon as any filter changes
    const fetchProperties = async () => {
      try {
        setSearchLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (selectedType !== 'All') params.append('type', selectedType);
        if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
        if (priceRange[1] < 75000) params.append('maxPrice', priceRange[1].toString());
        // Add quick filters to API params
        if (quickFilters.nearCampus) params.append('nearCampus', 'true');
        if (quickFilters.furnished) params.append('furnished', 'true');
        if (quickFilters.petFriendly) params.append('petFriendly', 'true');
        if (quickFilters.availableNow) params.append('availableNow', 'true');
        // Add amenities
        if (selectedAmenities.length > 0) {
          selectedAmenities.forEach(a => params.append('amenities', a));
        }
        // Add sort
        if (sortBy) params.append('sortBy', sortBy);
        const response = await fetch(`/api/properties?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        let properties = data.properties.map((property: Property) => ({
          ...property,
          image: property.images[0]?.url || '',
          isFavorite: false, // Default to false, will update with user favorites
          isAvailable: property.status === 'ACTIVE',
          type: property.type // Keep the original enum value for display
        }));
        // If user is logged in, fetch their favorites and mark favorited properties
        if (session?.user) {
          try {
            const favoritesResponse = await fetch('/api/favorites');
            if (favoritesResponse.ok) {
              const favoritesData = await favoritesResponse.json();
              const favoritePropertyIds = favoritesData.favorites.map(
                (favorite: any) => favorite.property.id
              );
              // Mark properties that are in user's favorites
              properties = properties.map((property: Property) => ({
                ...property,
                isFavorite: favoritePropertyIds.includes(property.id)
              }));
            }
          } catch (favError) {
            console.error('Error fetching user favorites:', favError);
            // Continue with properties even if favorites fetch fails
          }
        }
        setProperties(properties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
        setSearchLoading(false);
        setIsSearching(false);
      }
    };
    fetchProperties();
  }, [debouncedSearchTerm, selectedType, priceRange, quickFilters, selectedAmenities, sortBy, session?.user]);

  const toggleFavorite = async (id: string) => {
    if (!session?.user) {
      // Show a toast to prompt login
      showError("Please sign in to save properties to your favorites");
      return;
    }

    // Find the property
    const property = properties.find(p => p.id === id);
    if (!property) {
      console.error(`Property with ID ${id} not found`);
      return;
    }
    
    // Get the current favorite state before toggling
    const wasAlreadyFavorite = property.isFavorite;
    console.log(`Toggling favorite for property ${id}. Was favorite: ${wasAlreadyFavorite}`);
    
    // IMMEDIATELY update UI - don't wait for API response
    setProperties(prev => {
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

  // Toggle quick filter function
  const toggleQuickFilter = (filter: keyof typeof quickFilters) => {
    setQuickFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Clear all filters function
  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedType("All");
    setPriceRange([0, 75000]);
    setSelectedAmenities([]);
    setSortBy("relevance");
    setQuickFilters({
      nearCampus: false,
      furnished: false,
      petFriendly: false,
      availableNow: false
    });
  };

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property);
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
  
  // Fetch property reviews
  const fetchPropertyReviews = async (propertyId: string, page = 1) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`/api/reviews?propertyId=${propertyId}&page=${page}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data.reviews);
      setReviewPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showError('Could not load reviews');
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
        rating: 0,
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
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
          />
          {/* Mini-gallery thumbnails on hover (desktop only) */}
          {property.images.length > 1 && (
            <div className={`hidden lg:flex absolute bottom-4 right-4 gap-2 z-10 ${hovered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}> 
              {property.images.slice(1, 4).map((img: any) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="Gallery thumbnail"
                  className="w-12 h-12 object-cover rounded-xl border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                />
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
              className={`w-6 h-6 ${
                localFavorite
                  ? "text-red-500 fill-red-500" 
                  : "text-white stroke-2 hover:text-red-500"
              }`} 
            />
          </button>
          {/* Map Location Indicator - Show when property has coordinates */}
          {property.latitude && property.longitude && (
            <div className="absolute top-14 right-4 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-[var(--color-primary-500)]" title="Map location available">
              <Map className="w-4 h-4" />
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
              {property.amenities.slice(0, 4).map((amenity, idx) => (
                <span key={`${property.id}-amenity-${idx}-${amenity.amenity.name}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {getAmenityIcon(amenity.amenity.name)}{amenity.amenity.name}
                </span>
              ))}
              {property.amenities.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{property.amenities.length - 4} more</span>}
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

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  // Property Details Modal
  useEffect(() => {
    if (showModal) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  useEffect(() => {
    if (showModal && selectedProperty) {
      trackAnalyticsEvent('property_view', selectedProperty.id);
    }
    // Only fire when modal opens for a new property
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, selectedProperty?.id]);

  // Track local favorite state for the modal
  const [modalFavorite, setModalFavorite] = useState(false);
  
  // State for booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  
  // Update local state when selected property changes
  useEffect(() => {
    if (selectedProperty) {
      setModalFavorite(selectedProperty.isFavorite);
    }
  }, [selectedProperty]);
  
  // Handle favorite toggle in modal
  const handleModalFavoriteToggle = () => {
    if (selectedProperty) {
      setModalFavorite(!modalFavorite);
      toggleFavorite(selectedProperty.id);
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

  // Submit booking request
  const submitBooking = async () => {
    if (!selectedProperty || !session?.user) return;
    
    if (!bookingDate || !bookingTime) {
      showError('Please select a date and time');
      return;
    }
    
    setIsSubmittingBooking(true);
    
    try {
      // Track analytics event
      trackAnalyticsEvent('booking_request', selectedProperty.id);
      
      // In a real app, this would send the booking to an API endpoint
      // await fetch('/api/bookings', { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     propertyId: selectedProperty.id,
      //     date: bookingDate,
      //     time: bookingTime,
      //     notes: bookingNote
      //   })
      // });
      
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Booking request submitted successfully!');
      setShowBookingModal(false);
      
      // Reset form
      setBookingDate('');
      setBookingTime('');
      setBookingNote('');
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      showError('Failed to submit booking request');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle phone contact
  const handlePhoneContact = () => {
    if (!selectedProperty) return;
    
    // In a real app, this might reveal the owner's phone number
    // For now, track analytics and show a success message
    trackAnalyticsEvent('phone_contact', selectedProperty.id);
    showSuccess('Phone number requested. The owner will contact you shortly.');
  };

  // Handle email contact
  const handleEmailContact = () => {
    if (!selectedProperty) return;
    
    // In a real app, this might open an email compose window
    // For now, track analytics and show a success message
    trackAnalyticsEvent('email_contact', selectedProperty.id);
    showSuccess('Email request sent. Check your inbox for follow-up information.');
  };

  // Handle share property
  const handleShareProperty = () => {
    if (!selectedProperty) return;
    
    // In a real app, this would open a share dialog
    // For now, copy the URL to clipboard
    const url = `${window.location.origin}/property/${selectedProperty.id}`;
    navigator.clipboard.writeText(url);
    
    trackAnalyticsEvent('property_shared', selectedProperty.id);
    showSuccess('Property link copied to clipboard!');
  };

  // Handle contact from property card
  const handlePropertyContact = (property: Property) => {
    // Track analytics
    trackAnalyticsEvent('property_card_contact', property.id);
    
    // Show contact options modal or directly open the property modal
    setSelectedProperty(property);
    setShowModal(true);
    setCurrentImageIndex(0);
    
    // Fetch reviews when opening the modal
    fetchPropertyReviews(property.id);
    
    showSuccess('Opening property details. You can contact the owner from there.');
  };

  // Add new handlers for all filters that set loading to true immediately
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setSelectedType(e.target.value);
  };
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    const [min, max] = e.target.value.split("-").map(Number);
    setPriceRange([min, max]);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setSearchTerm(e.target.value);
    
    // Track search analytics if search term is not empty
    if (e.target.value.trim()) {
      trackAnalyticsEvent('search_performed', 'search', {
        searchTerm: e.target.value.trim(),
        searchType: 'text'
      });
    }
  };
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setLoading(true);
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
    
    // Track filter analytics
    trackAnalyticsEvent('filter_applied', 'filter', {
      filterType: 'amenity',
      filterValue: amenity,
      action: checked ? 'added' : 'removed'
    });
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setSortBy(e.target.value);
    
    // Track sort analytics
    trackAnalyticsEvent('sort_applied', 'sort', {
      sortBy: e.target.value
    });
  };
  const handleQuickFilterToggle = (filter: keyof typeof quickFilters) => {
    setLoading(true);
    const newValue = !quickFilters[filter];
    setQuickFilters(prev => ({ ...prev, [filter]: newValue }));
    
    // Track quick filter analytics
    trackAnalyticsEvent('quick_filter_applied', 'filter', {
      filterType: filter,
      filterValue: newValue
    });
  };
  const handleClearFilters = () => {
    setLoading(true);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedType("All");
    setPriceRange([0, 75000]);
    setSelectedAmenities([]);
    setSortBy("relevance");
    setQuickFilters({
      nearCampus: false,
      furnished: false,
      petFriendly: false,
      availableNow: false
    });
    
    // Track clear filters analytics
    trackAnalyticsEvent('filters_cleared', 'filter', {
      action: 'clear_all'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apply custom styles */}
      <style jsx global>{customScrollbarStyles}</style>
      
      <Navbar />

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-25">
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
            <div className="absolute top-32 right-20 w-12 h-12 border border-white/15 transform rotate-45 floating-shape" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-8 h-8 border border-white/15 rounded-full pulsing-shape"></div>
            <div className="absolute bottom-32 right-1/3 w-16 h-16 border border-white/15 transform rotate-12 floating-shape" style={{animationDelay: '2s'}}></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Perfect Student Home
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover thousands of student accommodations near your
                university with SmartStay
              </p>
            </div>

            {/* Unified Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="relative col-span-2">
                    {isSearching ? (
                      <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-primary-500)] w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    )}
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className={`w-full pl-10 ${searchTerm ? 'pr-10' : 'pr-4'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-gray-900 transition-all duration-200 ${isSearching ? 'bg-[var(--color-primary-50)]' : 'bg-white'}`}
                    />
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Property Type Custom Dropdown */}
                  <div ref={propertyTypeRef} className="relative">
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
                    
                    {/* Dropdown Modal */}
                    <div className={`absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${showPropertyTypeModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      <div className="max-h-[320px] overflow-y-auto p-2 custom-scrollbar">
                        {PROPERTY_TYPE_OPTIONS.map(type => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedType(type.value);
                              setShowPropertyTypeModal(false);
                              setLoading(true);
                            }}
                            className={`w-full text-left px-3 py-2 mb-1 rounded-lg  flex items-center  ${selectedType === type.value ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)]" : "text-gray-700 hover:bg-gray-100"} `}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className={`text-xl flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${
                                type.color === 'blue' ? 'bg-blue-200 text-blue-800' : 
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
                                <span className="ml-auto text-[var(--color-primary-600)]">O</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      showFilters
                        ? "bg-[var(--color-primary-600)] text-white"
                        : "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]"
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>
                </div>

                {/* Quick Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleQuickFilterToggle('nearCampus')}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-1.5 ${
                      quickFilters.nearCampus 
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)] shadow-sm transform scale-105" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className={`transition-all duration-300 ${quickFilters.nearCampus ? 'w-3 opacity-100' : 'w-0 opacity-0'}`}>
                      {quickFilters.nearCampus && <CheckCircle className="w-3 h-3" />}
                    </span>
                    <MapPin className={`w-3 h-3 ${quickFilters.nearCampus ? 'text-[var(--color-primary-600)]' : 'text-gray-500'}`} />
                    Near Campus
                  </button>
                  <button 
                    onClick={() => handleQuickFilterToggle('furnished')}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-1.5 ${
                      quickFilters.furnished 
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)] shadow-sm transform scale-105" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className={`transition-all duration-300 ${quickFilters.furnished ? 'w-3 opacity-100' : 'w-0 opacity-0'}`}>
                      {quickFilters.furnished && <CheckCircle className="w-3 h-3" />}
                    </span>
                    <Home className={`w-3 h-3 ${quickFilters.furnished ? 'text-[var(--color-primary-600)]' : 'text-gray-500'}`} />
                    Furnished
                  </button>
                  <button 
                    onClick={() => handleQuickFilterToggle('petFriendly')}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-1.5 ${
                      quickFilters.petFriendly 
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)] shadow-sm transform scale-105" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className={`transition-all duration-300 ${quickFilters.petFriendly ? 'w-3 opacity-100' : 'w-0 opacity-0'}`}>
                      {quickFilters.petFriendly && <CheckCircle className="w-3 h-3" />}
                    </span>
                    <span className={`${quickFilters.petFriendly ? 'text-[var(--color-primary-600)]' : 'text-gray-500'}`}>🐾</span>
                    Pet Friendly
                  </button>
                  <button 
                    onClick={() => handleQuickFilterToggle('availableNow')}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-1.5 ${
                      quickFilters.availableNow 
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)] shadow-sm transform scale-105" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className={`transition-all duration-300 ${quickFilters.availableNow ? 'w-3 opacity-100' : 'w-0 opacity-0'}`}>
                      {quickFilters.availableNow && <CheckCircle className="w-3 h-3" />}
                    </span>
                    <Calendar className={`w-3 h-3 ${quickFilters.availableNow ? 'text-[var(--color-primary-600)]' : 'text-gray-500'}`} />
                    Available Now
                  </button>
                  
                  {/* Clear Filters Button - Show only when filters are active */}
                  {(quickFilters.nearCampus || quickFilters.furnished || 
                    quickFilters.petFriendly || quickFilters.availableNow || 
                    searchTerm || selectedType !== "All" || 
                    priceRange[0] > 0 || priceRange[1] < 75000 || 
                    selectedAmenities.length > 0) && (
                    <button 
                      onClick={handleClearFilters}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors flex items-center gap-1.5 animate-fadeIn"
                    >
                      <X className="w-3 h-3" />
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Advanced Filter Panel - Improved Design */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 animate-fade-in-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--color-primary-600)]" />
                Advanced Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Custom Price Range Slider */}
                <div ref={priceRangeRef} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-3">
                    <label className="flex items-center gap-2 font-medium text-gray-800">
                      <span className="text-[var(--color-primary-600)] font-bold">₹</span>
                      Price Range
                    </label>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="bg-[var(--color-primary-50)] text-[var(--color-primary-700)] px-2 py-1 rounded-md border border-[var(--color-primary-200)]">
                        {priceRangeText[0]} - {priceRangeText[1]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Custom dual handle slider */}
                  <div className="relative pt-5 pb-10">
                    {/* Background track */}
                    <div className="absolute w-full h-2 bg-gray-200 rounded-full top-6"></div>
                    
                    {/* Colored track between handles */}
                    <div 
                      className="absolute h-2 bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-secondary-400)] rounded-full top-6"
                      style={{
                        left: `${(priceRange[0] / 75000) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / 75000) * 100}%`
                      }}
                    ></div>
                    
                    {/* Min Price Handle */}
                    <div className="relative w-full h-2">
                      <input
                        type="range"
                        min="0"
                        max="75000"
                        step="1000"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMinPrice = parseInt(e.target.value);
                          // Ensure min price doesn't exceed max price
                          if (newMinPrice <= priceRange[1]) {
                            setPriceRange([newMinPrice, priceRange[1]]);
                            setLoading(true);
                          }
                        }}
                        className="absolute w-full h-2 opacity-0 cursor-pointer z-30"
                      />
                      <div 
                        className="absolute h-7 w-7 bg-white border-2 border-[var(--color-primary-500)] rounded-full -top-2.5 shadow-md z-20 pointer-events-none flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ left: `calc(${(priceRange[0] / 75000) * 100}% - 14px)` }}
                      >
                        <div className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Max Price Handle */}
                    <div className="relative w-full h-2">
                      <input
                        type="range"
                        min="0"
                        max="75000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMaxPrice = parseInt(e.target.value);
                          // Ensure max price doesn't go below min price
                          if (newMaxPrice >= priceRange[0]) {
                            setPriceRange([priceRange[0], newMaxPrice]);
                            setLoading(true);
                          }
                        }}
                        className="absolute w-full h-2 opacity-0 cursor-pointer z-30"
                      />
                      <div 
                        className="absolute h-7 w-7 bg-white border-2 border-[var(--color-secondary-500)] rounded-full -top-2.5 shadow-md z-20 pointer-events-none flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ left: `calc(${(priceRange[1] / 75000) * 100}% - 14px)` }}
                      >
                        <div className="w-2 h-2 bg-[var(--color-secondary-500)] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Price markers */}
                    <div className="absolute w-full flex justify-between text-xs text-gray-500 mt-5 px-1">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-0.5 bg-gray-300 mb-1"></div>
                        <span>₹0</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-0.5 bg-gray-300 mb-1"></div>
                        <span>₹25K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-0.5 bg-gray-300 mb-1"></div>
                        <span>₹50K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-0.5 bg-gray-300 mb-1"></div>
                        <span>₹75K+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-2 font-medium text-gray-800 mb-4">
                    <Dumbbell className="w-4 h-4 text-[var(--color-primary-600)]" />
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {amenities.map((amenity) => (
                      <label
                        key={amenity}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAmenities.includes(amenity)
                            ? 'bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]'
                            : 'hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                          className="w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded-sm focus:ring-[var(--color-primary-500)]"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedAmenities.length > 0 && (
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={() => setSelectedAmenities([])} 
                        className="text-xs text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium"
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Filters */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col">
                  <label className="flex items-center gap-2 font-medium text-gray-800 mb-3">
                    <Filter className="w-4 h-4 text-[var(--color-primary-600)]" />
                    More Options
                  </label>
                  
                  {/* Property feature toggles */}
                  <div className="space-y-3 mb-4">
                    {Object.entries(quickFilters).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => handleQuickFilterToggle(key as keyof typeof quickFilters)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-sm ${
                          value 
                            ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)]" 
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {key === 'nearCampus' && <MapPin className="w-4 h-4" />}
                          {key === 'furnished' && <Home className="w-4 h-4" />}
                          {key === 'petFriendly' && <span>🐾</span>}
                          {key === 'availableNow' && <Calendar className="w-4 h-4" />}
                          {key === 'nearCampus' ? 'Near Campus' : 
                           key === 'furnished' ? 'Furnished' :
                           key === 'petFriendly' ? 'Pet Friendly' :
                           key === 'availableNow' ? 'Available Now' : key}
                        </span>
                        {value ? <CheckCircle className="w-4 h-4" /> : null}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      onClick={handleClearFilters}
                      className="w-full py-2 px-4 bg-[var(--color-primary-50)] text-[var(--color-primary-600)] rounded-lg hover:bg-[var(--color-primary-100)] transition-colors font-medium text-sm flex items-center justify-center gap-2 border border-[var(--color-primary-200)]"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Counter */}
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end">
                <div className="bg-[var(--color-primary-50)] text-[var(--color-primary-800)] px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 border border-[var(--color-primary-200)] shadow-sm">
                  <Search className="w-4 h-4" />
                  <span>{filteredProperties.length}</span> 
                  <span>properties found</span>
                </div>
              </div>
            </div>
          )}

          {/* Results Count and View Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              {/* Results count with animation */}
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-900">
                  {filteredProperties.length === properties.length ? (
                    `${properties.length} Properties`
                  ) : (
                    <>
                      <span className="text-[var(--color-primary-600)] font-semibold animate-pulse-slow">
                        {filteredProperties.length}
                      </span>
                      <span> of {properties.length} Properties</span>
                    </>
                  )}
                </span>
                
                {/* Active filters indicator */}
                {(quickFilters.nearCampus || quickFilters.furnished || 
                  quickFilters.petFriendly || quickFilters.availableNow || 
                  searchTerm || selectedType !== "All" || 
                  priceRange[0] > 0 || priceRange[1] < 75000 || 
                  selectedAmenities.length > 0) && (
                  <span className="ml-3 px-2 py-1 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-xs rounded-md animate-fadeIn flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Filters Applied
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              
              
              {/* Sort dropdown - Custom */}
              <div ref={sortByRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortByModal(!showSortByModal)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm bg-white flex items-center gap-2 min-w-[150px] text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {SORT_OPTIONS.find(s => s.value === sortBy)?.icon || <Star className="w-4 h-4 text-yellow-500" />}
                    </span>
                    <span>{SORT_OPTIONS.find(s => s.value === sortBy)?.label || "Most Relevant"}</span>
                  </div>
                  <span className="ml-auto">{showSortByModal ? "▲" : "▼"}</span>
                </button>
                
                {/* Sort Options Dropdown */}
                <div className={`absolute right-0 z-40 mt-2 w-[220px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${showSortByModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <div className="max-h-[320px] overflow-y-auto p-2">
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortByModal(false);
                          setLoading(true);
                        }}
                        className={`w-full text-left px-3 py-2 mb-1 rounded-lg flex items-center ${sortBy === option.value ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)]" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-xl flex-shrink-0">{option.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs ">{option.description}</div>
                          </div>
                          {sortBy === option.value && (
                            <span className="ml-auto text-[var(--color-primary-600)]">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                  setViewMode("grid");
                  trackAnalyticsEvent('view_mode_changed', 'view', {
                    mode: 'grid'
                  });
                }}
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-white text-[var(--color-primary-600)] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                  setViewMode("list");
                  trackAnalyticsEvent('view_mode_changed', 'view', {
                    mode: 'list'
                  });
                }}
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-white text-[var(--color-primary-600)] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Property List or Skeleton Loader */}
          <div className="">
            <div className="lg:col-span-3">
              {loading ? (
                <PropertiesListSkeleton isMobile={isMobile} />
              ) : (
                <>
          {viewMode === "list" ? (
            <div className="space-y-4">
                      {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isListView={true}
                  onContact={handlePropertyContact}
                />
              ))}
            </div>
          ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
                      {filteredProperties.map((property) => (
                        <div key={property.id} className="flex justify-center h-full">
                          <div className="h-full flex">
                  <PropertyCard property={property} onContact={handlePropertyContact} />
                          </div>
                </div>
              ))}
            </div>
          )}
          {/* No Results */}
                  {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button
                        onClick={handleClearFilters}
                className="bg-[var(--color-primary-500)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-600)] transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}
                </>
              )}
            </div>
            {/* Optionally, show SidebarSkeleton in loading state for sidebar */}
          </div>

          {/* Quick Actions Footer */}
          {filteredProperties.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[var(--color-primary-600)]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Get Support</p>
                    <p className="text-sm text-gray-600">Talk to our experts</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-[var(--color-secondary-100)] rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--color-secondary-600)]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Student Guide</p>
                    <p className="text-sm text-gray-600">
                      Tips for finding accommodation
                    </p>
                  </div>
                </button>
              </div>
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
                  const foundProperty = properties.find(p => p.id === propertyId);
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2 sm:px-4 overflow-y-auto"
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
                    {selectedProperty!.images.length > 1 && (
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
                    {selectedProperty!.images.length > 1 && (
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
                      <Building2 className="w-4 h-4 text-[var(--color-primary-600)]" />
                      {selectedProperty!.type}
                    </div>
                    
                  </div>
                  
                  {/* Thumbnails - Enhanced gallery strip */}
                  {selectedProperty!.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar bg-gray-800 border-t border-gray-700">
                      {selectedProperty!.images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={e => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                            idx === currentImageIndex 
                              ? 'border-2 border-[var(--color-primary-500)] shadow-lg scale-105 ring-2 ring-[var(--color-primary-300)] ring-opacity-50' 
                              : 'border-2 border-transparent opacity-70 hover:opacity-100'
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img 
                            src={img.url} 
                            alt="Thumbnail" 
                            className="w-full h-full object-cover" 
                            onError={e => (e.currentTarget.src = '/images/placeholder.png')} 
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
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-[var(--color-primary-900)] bg-clip-text text-transparent leading-tight" title={selectedProperty!.title}>
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
                        {selectedProperty!.amenities.map((amenity, idx) => (
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
                        ) : reviews.length > 0 ? (
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
                                  className={`p-2 rounded-lg ${
                                    reviewPagination.hasPrev 
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
                                  className={`p-2 rounded-lg ${
                                    reviewPagination.hasNext 
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
                                    className={`w-6 h-6 ${
                                      star <= userReview.rating 
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
                            className={`w-7 h-7 ${
                              modalFavorite
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


