import { useState, useEffect } from "react";
import { Heart, MapPin, Star, Home, Shield, Car, Wifi, Calendar, Bath, Bed, Mail, Phone, Map } from "lucide-react";
import { Property } from '@/lib/api-client';
import Image from 'next/image';

// Accept a superset of property fields for compatibility
export interface PropertyCardProps {
  property: Property;
  isListView?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onViewDetails?: (property: Property) => void;
  onContact?: (property: Property) => void;
}


const PropertyCard = ({
  property,
  isListView = false,
  onContact,
  onFavoriteToggle,
}: {
  property: Property;
  isListView?: boolean;
  onContact?: (property: Property) => void;
  onFavoriteToggle?: (id: string) => void;
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
    onFavoriteToggle?.(property.id); // Then trigger the global state update and API call
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
