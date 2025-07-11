import {
  Bed, Building2, Calendar, CheckCircle, ChevronDown, Dumbbell, Eye, Home, MapPin, Phone, Star, User, Wifi, X, Shield, Car, Mail, BookOpen, Heart, Bath
} from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';

// --- Types ---
type Amenity = {
  amenity: {
    name: string;
  };
};

type Owner = {
  name: string;
  verified?: boolean;
  rating?: number;
};

type Property = {
  id: string;
  title: string;
  images: { id: string; url: string }[];
  isAvailable: boolean;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  availableFrom?: string;
  location: string;
  rating: number;
  furnished?: boolean;
  petFriendly?: boolean;
  parking?: boolean;
  utilities?: boolean;
  description: string;
  amenities: Amenity[];
  owner: Owner;
  isFavorite: boolean;
  latitude?: number;
  longitude?: number;
};

type ViewPropertyModalProps = {
  property: Property;
  isOpen?: boolean;
  onClose: () => void;
  onToggleFavorite: (propertyId: string) => void;
};

// --- Utility: Responsive Hook ---
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

// --- Utility: Amenity Icon ---
function getAmenityIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'wifi': return <Wifi className="w-4 h-4 text-[var(--color-primary-600)]" />;
    case 'gym': return <Dumbbell className="w-4 h-4 text-[var(--color-primary-600)]" />;
    case 'parking': return <Car className="w-4 h-4 text-[var(--color-primary-600)]" />;
    case 'pet friendly': return <Shield className="w-4 h-4 text-[var(--color-primary-600)]" />;
    case 'furnished': return <Home className="w-4 h-4 text-[var(--color-primary-600)]" />;
    default: return <CheckCircle className="w-4 h-4 text-[var(--color-primary-600)]" />;
  }
}

// --- Desktop Modal ---
const DesktopPropertyModal: React.FC<ViewPropertyModalProps> = ({ property, isOpen = true, onClose, onToggleFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalFavorite, setModalFavorite] = useState(property.isFavorite);
  useEffect(() => {
    setModalFavorite(property.isFavorite);
  }, [property.isFavorite]);
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.id]);
  const handleModalFavoriteToggle = useCallback(() => {
    setModalFavorite(fav => !fav);
    onToggleFavorite(property.id);
  }, [property.id, onToggleFavorite]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2 sm:px-4 overflow-y-auto"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      data-testid="property-details-modal"
      onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
    >
      {/* Overlay click to close */}
      <div
        className="absolute inset-0 z-0 cursor-pointer backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none transition-all hover:scale-110"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
        {/* Left: Image Gallery */}
        <div className="lg:w-1/2 w-full flex flex-col min-w-0 bg-gray-900 max-h-[40vh] lg:max-h-[90vh] overflow-hidden relative">
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={property.images[currentImageIndex]?.url || '/images/placeholder.png'}
              alt={property.title}
              className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
              onError={e => (e.currentTarget.src = '/images/placeholder.png')}
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex - 1 + property.images.length) % property.images.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronDown className="w-6 h-6 rotate-90 text-gray-800" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex + 1) % property.images.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronDown className="w-6 h-6 -rotate-90 text-gray-800" />
                </button>
              </>
            )}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 shadow-xl flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{currentImageIndex + 1}/{property.images.length}</span>
              </div>
            )}
            <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10 bg-green-500 text-white border border-white/30 backdrop-blur-sm">
              {property.isAvailable ? "Available Now" : "Not Available"}
            </div>
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] px-5 py-2.5 rounded-xl shadow-xl border border-white/60 text-white font-bold flex items-center gap-2">
              <span className="text-xl">₹{property.price.toLocaleString()}</span>
              <span className="text-sm font-normal opacity-90">/month</span>
            </div>
            <div className="absolute top-18 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-[var(--color-primary-700)] text-sm font-medium border border-[var(--color-primary-100)] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[var(--color-primary-600)]" />
              {property.type}
            </div>
          </div>
          {property.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar bg-gray-800 border-t border-gray-700">
              {property.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={e => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${idx === currentImageIndex ? 'border-2 border-[var(--color-primary-500)] shadow-lg scale-105 ring-2 ring-[var(--color-primary-300)] ring-opacity-50' : 'border-2 border-transparent opacity-70 hover:opacity-100'}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '/images/placeholder.png')} />
                </button>
              ))}
            </div>
          )}
          <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-gray-800 text-white border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Bed className="w-5 h-5 text-[var(--color-primary-300)]" />
              </div>
              <div>
                <div className="font-semibold text-lg">{property.bedrooms}</div>
                <div className="text-xs text-gray-300">Bedrooms</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Bath className="w-5 h-5 text-[var(--color-primary-300)]" />
              </div>
              <div>
                <div className="font-semibold text-lg">{property.bathrooms}</div>
                <div className="text-xs text-gray-300">Bathrooms</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-[var(--color-primary-300)]" />
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 'Now'}
                </div>
                <div className="text-xs text-gray-300">Available From</div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Details Section */}
        <div className="lg:w-1/2 w-full flex flex-col min-w-0 bg-white h-[50vh] lg:h-auto lg:max-h-[90vh] overflow-y-auto custom-scrollbar pb-20 lg:pb-0">
          <div className="sticky top-0 px-6 pt-6 pb-4 bg-white z-20 border-b border-gray-100 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-[var(--color-primary-900)] bg-clip-text text-transparent leading-tight" title={property.title}>
              {property.title}
            </h2>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-2 text-[var(--color-primary-700)] text-sm bg-[var(--color-primary-50)] px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-[var(--color-primary-500)]" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-50 to-yellow-100 px-3 py-1.5 rounded-lg shadow-sm border border-yellow-200">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.round(property.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-yellow-700">{property.rating}</span>
              </div>
            </div>
          </div>
          <div className="px-6">
            <div className="flex flex-wrap gap-2 my-4">
              {property.furnished && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium border border-green-200"><Home className="w-4 h-4" /> Furnished</span>}
              {property.petFriendly && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium border border-blue-200"><Shield className="w-4 h-4" /> Pet Friendly</span>}
              {property.parking && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium border border-purple-200"><Car className="w-4 h-4" /> Parking</span>}
              {property.utilities && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-lg font-medium border border-orange-200"><Wifi className="w-4 h-4" /> Utilities Included</span>}
            </div>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 my-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                  <BookOpen className="w-4 h-4 text-[var(--color-primary-600)]" />
                </div>
                Description
              </h4>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
            <div className="my-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                  <Dumbbell className="w-4 h-4 text-[var(--color-primary-600)]" />
                </div>
                Amenities
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={`${property.id}-amenity-${idx}`} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                      {getAmenityIcon(amenity.amenity.name)}
                    </div>
                    <span className="text-gray-800">{amenity.amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="my-6 bg-[var(--color-primary-50)] p-5 rounded-xl border border-[var(--color-primary-100)]">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-[var(--color-primary-100)]">
                  <User className="w-4 h-4 text-[var(--color-primary-600)]" />
                </div>
                Property Owner
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-semibold text-gray-900">{property.owner.name}</p>
                    {property.owner.verified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-700">{property.owner.rating || '4.8'}</span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">Response time: ~2 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-6 py-4 mt-auto">
            <div className="flex gap-3 items-center">
              <button className="flex-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white py-3.5 px-4 rounded-xl font-medium hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Book Viewing</span>
              </button>
              <div className="flex gap-3">
                <button className="p-3.5 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-[var(--color-primary-700)] rounded-xl hover:bg-[var(--color-primary-100)] transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
                  <Mail className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleModalFavoriteToggle} 
                  className="p-2.5 rounded-xl flex items-center justify-center"
                  aria-label={modalFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-7 h-7 ${modalFavorite ? "text-red-500 fill-red-500" : "text-gray-400 stroke-[2px] hover:text-red-400"}`} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Modal ---
const MobilePropertyModal: React.FC<ViewPropertyModalProps> = ({ property, isOpen = true, onClose, onToggleFavorite }) => {
  const [mobileModalFavorite, setMobileModalFavorite] = useState(property.isFavorite);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    setMobileModalFavorite(property.isFavorite);
  }, [property.isFavorite]);
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.id]);
  const handleMobileFavoriteToggle = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMobileModalFavorite(fav => !fav);
    onToggleFavorite(property.id);
  }, [property.id, onToggleFavorite]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden" role="dialog" aria-modal="true">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Back">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex gap-4">
          <button onClick={handleMobileFavoriteToggle} className="p-2 rounded-full" aria-label={mobileModalFavorite ? "Remove from favorites" : "Add to favorites"}>
            <Heart className={`w-6 h-6 ${mobileModalFavorite ? "text-red-500 fill-red-500" : "text-gray-700 stroke-2 hover:text-red-500"}`} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
          {property.latitude && property.longitude && (
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MapPin className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
      {/* Image Gallery */}
      <div className="relative w-full h-64 bg-gray-900 flex items-center justify-center">
        <img
          src={property.images[currentImageIndex]?.url || '/images/placeholder.png'}
          alt={property.title}
          className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
          onError={e => (e.currentTarget.src = '/images/placeholder.png')}
        />
        {property.images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex - 1 + property.images.length) % property.images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-xl rounded-full p-2 transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronDown className="w-5 h-5 rotate-90 text-gray-800" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex + 1) % property.images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-xl rounded-full p-2 transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronDown className="w-5 h-5 -rotate-90 text-gray-800" />
            </button>
          </>
        )}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{currentImageIndex + 1}/{property.images.length}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
          {property.isAvailable ? "Available Now" : "Not Available"}
        </div>
        <div className="absolute top-2 left-2 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] px-3 py-1.5 rounded-xl text-white font-bold flex items-center gap-1">
          <span>₹{property.price.toLocaleString()}</span>
          <span className="text-xs font-normal opacity-90">/month</span>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <h2 className="text-xl font-bold mt-4 mb-2">{property.title}</h2>
        <div className="flex items-center gap-2 text-[var(--color-primary-700)] text-xs bg-[var(--color-primary-50)] px-2 py-1 rounded-lg mb-2">
          <MapPin className="w-3 h-3 text-[var(--color-primary-500)]" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-3 h-3 ${star <= Math.round(property.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-xs font-semibold text-yellow-700">{property.rating}</span>
        </div>
        <div className="flex gap-2 my-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"><Bed className="w-3 h-3" />{property.bedrooms} Beds</span>
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"><Bath className="w-3 h-3" />{property.bathrooms} Baths</span>
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"><Calendar className="w-3 h-3" />{property.availableFrom ? new Date(property.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 'Now'}</span>
        </div>
        <div className="flex flex-wrap gap-1 my-2">
          {property.furnished && <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded"><Home className="w-3 h-3" />Furnished</span>}
          {property.petFriendly && <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"><Shield className="w-3 h-3" />Pet Friendly</span>}
          {property.parking && <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"><Car className="w-3 h-3" />Parking</span>}
          {property.utilities && <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"><Wifi className="w-3 h-3" />Utilities</span>}
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 my-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1"><BookOpen className="w-3 h-3 text-[var(--color-primary-600)]" />Description</h4>
          <p className="text-gray-700 text-sm">{property.description}</p>
        </div>
        <div className="my-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1"><Dumbbell className="w-3 h-3 text-[var(--color-primary-600)]" />Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {property.amenities.map((amenity, idx) => (
              <div key={`${property.id}-amenity-${idx}`} className="flex items-center gap-1 p-2 bg-gray-50 rounded border border-gray-100">
                {getAmenityIcon(amenity.amenity.name)}
                <span className="text-xs text-gray-800">{amenity.amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="my-4 bg-[var(--color-primary-50)] p-3 rounded-lg border border-[var(--color-primary-100)]">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1"><User className="w-3 h-3 text-[var(--color-primary-600)]" />Property Owner</h4>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full flex items-center justify-center text-base font-bold text-white">
              {property.owner.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-sm font-semibold text-gray-900">{property.owner.name}</p>
                {property.owner.verified && (
                  <span className="px-1 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Verified</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-700">{property.owner.rating || '4.8'}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">Response: ~2h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-4 py-3 z-20 flex gap-2 items-center">
        <button className="flex-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-1">
          <Calendar className="w-5 h-5" />
          <span>Book Viewing</span>
        </button>
        <button className="p-3 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-[var(--color-primary-700)] rounded-xl flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </button>
        <button onClick={handleMobileFavoriteToggle} className="p-2 rounded-xl flex items-center justify-center" aria-label={mobileModalFavorite ? "Remove from favorites" : "Add to favorites"}>
          <Heart className={`w-6 h-6 ${mobileModalFavorite ? "text-red-500 fill-red-500" : "text-gray-400 stroke-[2px] hover:text-red-400"}`} />
        </button>
      </div>
    </div>
  );
};

// --- Main Responsive Modal ---
const ViewPropertyModal: React.FC<ViewPropertyModalProps> = (props) => {
  const isMobile = useIsMobile();
  return isMobile
    ? <MobilePropertyModal {...props} />
    : <DesktopPropertyModal {...props} />;
};

export default ViewPropertyModal;