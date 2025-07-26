  "use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";

// Define custom CSS for background pattern animations
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
`;
import PropertyCard from "@/components/ui/PropertyCard";
import CustomSelect from "@/components/ui/CustomSelect";
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

const propertyTypes = [
  "All",
  "APARTMENT",
  "STUDIO",
  "SHARED_HOUSE",
  "LUXURY",
  "ROOM",
  "FAMILY_HOME",
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
                    <div className="md:w-48 w-full md:mr-4">
                      <CustomSelect
                        options={propertyTypes.map(type => ({ value: type, label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))}
                        value={selectedType}
                        onChange={setSelectedType}
                        placeholder="Property Type"
                      />
                    </div>
                    <div className="md:w-56 w-full">
                      <CustomSelect
                        options={[
                          { value: "date", label: "Sort by Date Added" },
                          { value: "price-low", label: "Price: Low to High" },
                          { value: "price-high", label: "Price: High to Low" },
                          { value: "rating", label: "Highest Rated" },
                          { value: "distance", label: "Nearest First" },
                        ]}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Sort By"
                      />
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