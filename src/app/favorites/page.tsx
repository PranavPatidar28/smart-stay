  "use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/ui/Navbar";
import { createPortal } from "react-dom";

// Define custom CSS for background pattern animations and scrollbars
const backgroundPatternStyles = `
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
      opacity: 0.15;
      transform: scale(1);
    }
    50% {
      opacity: 0.25;
      transform: scale(1.05);
    }
  }
  
  .floating-shape {
    animation: float 6s ease-in-out infinite;
  }
  
  .pulsing-shape {
    animation: pulse 4s ease-in-out infinite;
  }
  
  /* Custom scrollbar styles */
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
`;
import PropertyCard from "@/components/ui/PropertyCard";
import { useSession } from "next-auth/react";
import {
  Heart,
} from "lucide-react";
import FavoritesListSkeleton from "@/components/ui/FavoritesListSkeleton";
import ViewPropertyModal from '@/components/ui/ViewPropertyModal';
import { trackAnalyticsEvent } from '@/lib/api-client';
import { showSuccess } from '@/lib/toast';

interface FavoriteProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  distance: string;
  rating: number;
  image: string;
  images?: string[];
  amenities: string[];
  addedDate: string;
  landlord?: {
    name: string;
    rating: number;
    verified: boolean;
  };
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

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [modalProperty, setModalProperty] = useState<FavoriteProperty | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // State for custom dropdowns
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showSortByModal, setShowSortByModal] = useState(false);
  
  // Refs for clicking outside detection
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);

  // Open modal with mapped property
  const openPropertyModal = (property: FavoriteProperty) => {
    setModalProperty(property);
    setShowModal(true);
  };
  const closePropertyModal = () => {
    setShowModal(false);
    setModalProperty(null);
  };

  // Fetch user's favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user) return;
      
      try {
        setLoading(true);
        

        
        const response = await fetch('/api/favorites');
        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const data = await response.json();
        setFavorites(data.favorites.map((favorite: { property: FavoriteProperty }) => ({
          id: favorite.property.id,
          title: favorite.property.title,
          location: favorite.property.location,
          price: favorite.property.price,
          type: favorite.property.type,
          bedrooms: favorite.property.bedrooms,
          bathrooms: favorite.property.bathrooms,
          distance: favorite.property.location.split(" ")[1] || "1.0 km",
          rating: favorite.property.rating || 0,
          image: favorite.property.images[0]?.url || '',
          amenities: favorite.property.amenities.map((a: { amenity?: { name?: string }; name?: string } ) => {
            if (a.amenity && a.amenity.name) {
              return a.amenity.name;
            }
            if (typeof a === 'string') return a;
            if (a.name) return a.name;
            return null;
          }).filter(Boolean),
          addedDate: favorite.createdAt,
          landlord: {
            name: favorite.property.owner.name,
            rating: favorite.property.owner.rating || 0,
            verified: favorite.property.owner.verified
          }
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user]);

  const filteredAndSortedFavorites = favorites
    .filter((property) => selectedType === "All" || property.type === selectedType)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

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

  // Helper to map FavoriteProperty to PropertyCard expected shape
  const mapFavoriteToPropertyCard = (fav: FavoriteProperty) => ({
    ...fav,
    images: fav.images ? fav.images.map((url, i) => ({ id: i, url })) : fav.image ? [{ id: 0, url: fav.image }] : [],
    amenities: (fav.amenities || []).map(a => typeof a === 'string' ? { amenity: { name: a } } : a),
    owner: fav.landlord ? { name: fav.landlord.name, verified: fav.landlord.verified, rating: fav.landlord.rating } : undefined,
    isAvailable: true, // or infer from data if available
    isFavorite: true,
  });

  // Helper to map FavoriteProperty to PropertyDetailsModal expected shape
  const mapFavoriteToFullProperty = (fav: FavoriteProperty) => ({
    id: fav.id,
    title: fav.title,
    location: fav.location,
    price: fav.price,
    type: fav.type,
    bedrooms: fav.bedrooms,
    bathrooms: fav.bathrooms,
    rating: fav.rating,
    image: fav.image,
    images: fav.images
      ? fav.images.map((url, i) => ({ id: i.toString(), url, order: i, isCover: i === 0 }))
      : fav.image
      ? [{ id: "0", url: fav.image, order: 0, isCover: true }]
      : [],
    amenities: (fav.amenities || []).map((a) =>
      typeof a === "string"
        ? { amenity: { id: a, name: a, category: "" } }
        : a
    ),
    isFavorite: true,
    isAvailable: true,
    availableFrom: undefined,
    description: "",
    latitude: undefined,
    longitude: undefined,
    owner: fav.landlord
      ? { id: fav.id, name: fav.landlord.name, verified: fav.landlord.verified, rating: fav.landlord.rating }
      : { id: fav.id, name: "", verified: false },
    utilities: false,
    petFriendly: false,
    furnished: false,
    parking: false,
    _count: { favorites: 0, reviews: 0, inquiries: 0 },
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[var(--color-primary-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-600)]"
              >
                Try Again
              </button>
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
                    property={mapFavoriteToPropertyCard(property)} 
                    onViewDetails={() => openPropertyModal(property)}
                    onContact={handlePropertyContact}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal - Desktop & Mobile */}
      {showModal && modalProperty && (
        <ViewPropertyModal
          property={mapFavoriteToFullProperty(modalProperty)}
          onClose={closePropertyModal}
          onToggleFavorite={(id) => {
            removeFavorite(id);
            closePropertyModal();
          }}
        />
      )}
    </div>
  );
} 