import React, { useState, useEffect } from "react";
import { X, Heart, Eye, MapIcon } from "lucide-react";

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
}

interface MobilePropertyModalProps {
  property: Property;
  toggleFavorite: (id: string) => void;
  closePropertyModal: () => void;
}

const MobilePropertyModal = ({ property, toggleFavorite, closePropertyModal }: MobilePropertyModalProps) => {
  const [mobileModalFavorite, setMobileModalFavorite] = useState(property.isFavorite);
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
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
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
        </div>
      </div>
      {/* ...rest of the modal code (image gallery, content, sticky bar)... */}
    </div>
  );
};

export default MobilePropertyModal; 