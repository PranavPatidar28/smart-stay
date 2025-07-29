"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
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
import { useSession } from "next-auth/react";
import {
  showSuccess,
  showError,
  showLoading,
  updateToSuccess,
  updateToError,
} from "@/lib/toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Home,
  Building2,
  Star,
  MapPin,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Settings,
  BarChart3,
  CreditCard,
  Bell,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Camera,
  Video,
  FileText,
  Globe,
  Smartphone,
  Wifi,
  Car,
  Shield,
  Heart,
  Zap,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  X,
  Map as MapIcon,
  Loader2,
  EyeIcon,
  StarIcon,
} from "lucide-react";
import { Fragment } from "react";
import { trackAnalyticsEvent } from '@/lib/api-client';

// Extend the Property interface to include coordinates
interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price: number;
  type: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "RENTED";
  views: number;
  inquiries: number;
  rating: number;
  image: string;
  lastUpdated: string;
  earnings?: number;
  occupancy?: number;
  bedrooms?: number;
  bathrooms?: number;
  availableFrom?: string;
  virtualTourUrl?: string;
  seoKeywords?: string;
  contactPhone?: string;
  contactEmail?: string;
  deposit?: number;
  utilities?: boolean;
  petFriendly?: boolean;
  furnished?: boolean;
  parking?: boolean;
  amenities?: string[];
}

interface Activity {
  id: number;
  type: "inquiry" | "view" | "booking" | "payment" | "review";
  message: string;
  time: string;
  propertyId?: number;
  propertyTitle?: string;
}

// No more mock properties - we'll use real data from the API

// We'll replace mock activities with real data from API in the future

// Status options with icons and descriptions
const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
    icon: "🔍",
    description: "Show all properties",
    color: "gray"
  },
  {
    value: "ACTIVE",
    label: "Active",
    icon: "✅",
    description: "Available for rent",
    color: "green"
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    icon: "⏸️",
    description: "Temporarily unavailable",
    color: "gray"
  },
  {
    value: "PENDING",
    label: "Pending",
    icon: "⏳",
    description: "Waiting for approval",
    color: "yellow"
  },
  {
    value: "RENTED",
    label: "Rented",
    icon: "🔑",
    description: "Currently occupied",
    color: "blue"
  }
];
const generatePlaceholderActivities = (properties: Property[]): Activity[] => {
  if (!properties.length) return [];
  
  return properties.slice(0, 3).map((property, idx) => ({
    id: idx + 1,
    type: idx === 0 ? "view" : idx === 1 ? "inquiry" : "payment",
    message: idx === 0 
      ? `Property "${property.title}" has been viewed recently`
      : idx === 1 
      ? `New inquiry received for "${property.title}"`
      : `Recent payment activity for "${property.title}"`,
    time: idx === 0 ? "Today" : idx === 1 ? "Yesterday" : "Last week",
    propertyId: parseInt(property.id),
    propertyTitle: property.title
  }));
};

const AMENITY_SUGGESTIONS = [
  "WiFi",
  "Kitchen",
  "Laundry",
  "Gym",
  "Pool",
  "Parking",
  "Security",
  "Furnished",
  "Study Room",
  "Garden",
  "AC",
  "TV",
];

const AMENITY_CATEGORIES = {
  Essentials: ["WiFi", "AC", "Furnished", "Kitchen", "Laundry"],
  Recreation: ["Gym", "Pool", "Garden", "TV", "Study Room"],
  Security: ["Security", "CCTV", "Lock System", "Fire Safety"],
  Transport: ["Parking", "Bike Storage", "Near Bus Stop", "Near Metro"],
  Utilities: ["Electricity", "Water", "Gas", "Internet", "Cleaning"],
};

const PROPERTY_TYPES = [
  {
    value: "APARTMENT",
    label: "Apartment",
    icon: "🏢",
    avgPrice: 25000,
    description: "Modern apartment with amenities",
  },
  {
    value: "SHARED_HOUSE",
    label: "Shared House",
    icon: "🏘️",
    avgPrice: 15000,
    description: "Shared accommodation",
  },
  {
    value: "ROOM",
    label: "Room",
    icon: "🛏️",
    avgPrice: 12000,
    description: "Single room rental",
  },
  {
    value: "FAMILY_HOME",
    label: "Family Home",
    icon: "🏡",
    avgPrice: 35000,
    description: "Family-style living",
  },
  {
    value: "HOSTEL",
    label: "Hostel",
    icon: "🏢",
    avgPrice: 8000,
    description: "Budget-friendly hostel",
  },
  {
    value: "PG",
    label: "PG (Paying Guest)",
    icon: "🏠",
    avgPrice: 10000,
    description: "Paying guest accommodation",
  },
];

const SEO_TEMPLATES = {
  APARTMENT:
    "student apartment near campus, furnished accommodation, modern amenities",
  STUDIO: "studio apartment for students, compact living, affordable rent",
  SHARED_HOUSE:
    "shared house for students, budget accommodation, friendly environment",
  LUXURY: "luxury student accommodation, premium facilities, high-end living",
  ROOM: "student room rental, single occupancy, comfortable living",
  FAMILY_HOME: "family home for students, homely environment, spacious rooms",
  HOSTEL: "student hostel, budget-friendly, shared facilities",
  PG: "paying guest accommodation, home-cooked food, family environment",
};

// Update the FormProperty type to include latitude and longitude
type FormProperty = {
  id: number;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price: number;
  type: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "RENTED";
  images: string[];
  amenities: string[];
  image: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  availableFrom: string;
  virtualTourUrl?: string;
  seoKeywords?: string;
  contactPhone?: string;
  contactEmail?: string;
  deposit: number;
  utilities: boolean;
  petFriendly: boolean;
  furnished: boolean;
  parking: boolean;
};

function PropertyModal({
  open,
  onClose,
  onSave,
  initialValues,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (
    property: Property & { images: string[]; amenities: string[] }
  ) => void;
  initialValues?: Partial<Property> & {
    images?: string[];
    amenities?: string[] | any[];
  };
  mode: "add" | "edit";
}) {
  // Ref for the modal content to handle click outside
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);
  // Process amenities from initialValues if they are objects
  const processedAmenities = useMemo(() => {
    if (!initialValues?.amenities) return [];

    return initialValues.amenities
      .map((amenity: any) =>
        typeof amenity === "string"
          ? amenity
          : amenity.amenity
          ? amenity.amenity.name
          : ""
      )
      .filter(Boolean);
  }, [initialValues?.amenities]);

  // Process images from initialValues if they are objects
  const processedImages = useMemo(() => {
    if (!initialValues?.images) {
      return initialValues?.image ? [initialValues.image] : [];
    }

    return initialValues.images
      .map((img: any) => {
        if (typeof img === "string") return img;
        if (img && typeof img === "object") {
          return (img as any).url || "";
        }
        return "";
      })
      .filter(Boolean);
  }, [initialValues?.images, initialValues?.image]);

  // Stepper state
  const [step, setStep] = useState(0);
  // Form state
  const [form, setForm] = useState<FormProperty>({
    id: initialValues?.id
      ? typeof initialValues.id === "string"
        ? parseInt(initialValues.id)
        : (initialValues.id as number)
      : Date.now(),
    title: initialValues?.title || "",
    location: initialValues?.location || "",
    latitude: initialValues?.latitude,
    longitude: initialValues?.longitude,
    price: initialValues?.price || 0,
    type: initialValues?.type || "APARTMENT",
    status: initialValues?.status || "ACTIVE",
    images: processedImages,
    amenities: processedAmenities,
    image:
      typeof initialValues?.image === "string"
        ? initialValues.image
        : typeof initialValues?.image === "object" && initialValues?.image
        ? (initialValues.image as any).url || ""
        : processedImages.length > 0
        ? processedImages[0]
        : "",
    description: initialValues?.description || "",
    bedrooms: initialValues?.bedrooms || 1,
    bathrooms: initialValues?.bathrooms || 1,
    availableFrom: initialValues?.availableFrom || new Date().toISOString(),
    virtualTourUrl: initialValues?.virtualTourUrl || undefined,
    seoKeywords: initialValues?.seoKeywords || undefined,
    contactPhone: initialValues?.contactPhone || undefined,
    contactEmail: initialValues?.contactEmail || undefined,
    deposit: initialValues?.deposit || 0,
    utilities: initialValues?.utilities || false,
    petFriendly: initialValues?.petFriendly || false,
    furnished: initialValues?.furnished || false,
    parking: initialValues?.parking || false,
  });
  const [touched, setTouched] = useState<{
    [K in keyof FormProperty]?: boolean;
  }>({});
  const [newImage, setNewImage] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [selectedAmenityCategory, setSelectedAmenityCategory] =
    useState("Essentials");
  const [isDragging, setIsDragging] = useState(false);
  const [pricingSuggestion, setPricingSuggestion] = useState<number | null>(
    null
  );
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showSEOSuggestions, setShowSEOSuggestions] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);
  const amenityInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const requiredFields: (keyof FormProperty)[] = [
    "title",
    "location",
    "price",
    "type",
    "status",
    "images",
  ];
  const isValid = requiredFields.every((field) => {
    if (field === "images") return form.images.length > 0;
    return form[field] && form[field] !== "";
  });

  // Calculate pricing suggestion based on type and location
  useEffect(() => {
    const propertyType = PROPERTY_TYPES.find((pt) => pt.value === form.type);
    const suggestion = propertyType?.avgPrice || 20000;
    setPricingSuggestion(suggestion);
  }, [form.type]);

  // Calculate completion score
  useEffect(() => {
    const totalFields = 15; // Total number of important fields
    const completedFields = [
      form.title,
      form.location,
      form.price,
      form.type,
      form.status,
      form.images.length,
      form.description,
      form.bedrooms,
      form.bathrooms,
      form.availableFrom,
      form.contactPhone,
      form.contactEmail,
      form.amenities.length,
      form.seoKeywords,
      form.virtualTourUrl,
    ].filter(Boolean).length;

    setCompletionScore(Math.round((completedFields / totalFields) * 100));
  }, [form]);

  // Update validateField to trim and collapse spaces for string length validation:
  const collapseSpaces = (str: string) => str.replace(/\s+/g, ' ').trim();
  const validateField = useCallback((field: keyof FormProperty, value: any) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      switch (field) {
        case "title": {
          const val = typeof value === 'string' ? collapseSpaces(value) : '';
          if (!val || val.length < 10) newErrors.title = "Title should be at least 10 non-space characters";
          else if (val.length > 100) newErrors.title = "Title should be less than 100 characters";
          break;
        }
        case "location": {
          const val = typeof value === 'string' ? collapseSpaces(value) : '';
          if (!val || val.length < 5) newErrors.location = "Location should be at least 5 non-space characters";
          break;
        }
        case "price":
          if (value < 1000) newErrors.price = "Price should be at least ₹1,000";
          else if (value > 100000) newErrors.price = "Price seems too high";
          break;
        case "bedrooms":
          if (value < 0 || value > 10) newErrors.bedrooms = "Bedrooms must be between 0 and 10";
          break;
        case "bathrooms":
          if (value < 0 || value > 10) newErrors.bathrooms = "Bathrooms must be between 0 and 10";
          break;
        case "contactPhone": {
          if (value) {
            const phone = (value as string).replace(/\s/g, "");
            if (phone.startsWith("+")) {
              // Remove '+' and check digits
              const digits = phone.slice(1);
              if (!/^\d+$/.test(digits) || digits.length < 10 || digits.length > 15) {
                newErrors.contactPhone = "Enter a valid international phone number (country code + number)";
              }
            } else {
              if (!/^\d{10}$/.test(phone)) {
                newErrors.contactPhone = "Enter a valid 10-digit mobile number";
              }
            }
          }
          break;
        }
        case "contactEmail": {
          if (value && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
            newErrors.contactEmail = "Please enter a valid email address";
          }
          break;
        }
        case "images":
          if (!Array.isArray(value) || value.length === 0) newErrors.images = "At least one image is required";
          else if (value.some((url: string) => !/^https?:\/\/.+\..+/.test(url))) newErrors.images = "All images must be valid URLs";
          break;
        default:
          break;
      }
      return newErrors;
    });
  }, []);

  function handleChange<K extends keyof FormProperty>(
    key: K,
    value: FormProperty[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
    validateField(key, value);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result && !form.images.includes(result)) {
            setForm((f) => {
              const imgs = [...f.images, result];
              return { ...f, images: imgs, image: imgs[0] };
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result && !form.images.includes(result)) {
              setForm((f) => {
                const imgs = [...f.images, result];
                return { ...f, images: imgs, image: imgs[0] };
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  function handleAddImage() {
    if (newImage && !form.images.includes(newImage)) {
      setForm((f) => {
        const imgs = [...f.images, newImage];
        return { ...f, images: imgs, image: imgs[0] };
      });
      setNewImage("");
    }
  }

  function handleRemoveImage(idx: number) {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      return { ...f, images: imgs, image: imgs[0] || "" };
    });
  }

  function handleReorderImage(idx: number, dir: -1 | 1) {
    const arr = [...form.images];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setForm((f) => ({ ...f, images: arr, image: arr[0] || "" }));
  }

  function handleAddAmenity(val: string) {
    if (val && !form.amenities.includes(val)) {
      setForm((f) => ({ ...f, amenities: [...f.amenities, val] }));
      setAmenityInput("");
      if (amenityInputRef.current) amenityInputRef.current.focus();
    }
  }

  function handleRemoveAmenity(idx: number) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.filter((_, i) => i !== idx),
    }));
  }

  function handleNext() {
    if (step === 0 && (!form.title || !form.location || !form.price)) {
      setTouched({ title: true, location: true, price: true });
      return;
    }
    if (step === 1 && form.images.length === 0) {
      setTouched((t) => ({ ...t, images: true }));
      return;
    }
    setStep((s) => s + 1);
  }

  function handlePrev() {
    setStep((s) => s - 1);
  }

  function handleSave() {
    if (isValid && !isSubmitting) {
      setIsSubmitting(true);

      try {
        // Process images to ensure they are strings
        const processedImages = form.images
          .map((img) => {
            if (typeof img === "string") return img;
            if (img && typeof img === "object") {
              return (img as any).url || "";
            }
            return "";
          })
          .filter(Boolean);

        if (processedImages.length === 0) {
          setIsSubmitting(false);
          showError("At least one image is required");
          throw new Error("At least one image is required");
        }

        // Validate required fields
        if (!form.title) {
          setIsSubmitting(false);
          showError("Title is required");
          throw new Error("Title is required");
        }
        if (!form.location) {
          setIsSubmitting(false);
          showError("Location is required");
          throw new Error("Location is required");
        }
        if (!form.price || form.price <= 0) {
          setIsSubmitting(false);
          showError("A valid price is required");
          throw new Error("A valid price is required");
        }
        if (!form.type) {
          setTouched((t) => ({ ...t, type: true }));
          setValidationErrors((e) => ({
            ...e,
            type: "Property type is required",
          }));
          return;
        }

        // Clean the data and add required properties for Property type
        const cleanData: Property & { images: string[]; amenities: string[] } =
          {
            id: String(form.id), // Convert to string for Property type
            title: form.title,
            description: form.description,
            location: form.location,
            latitude: form.latitude,
            longitude: form.longitude,
            price: form.price,
            type: form.type,
            status: form.status,
            views: 0, // Default value for new properties
            inquiries: 0, // Default value for new properties
            rating: 0, // Default value for new properties
            image: form.image,
            lastUpdated: new Date().toISOString(), // Current date
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            availableFrom: form.availableFrom,
            virtualTourUrl: form.virtualTourUrl,
            seoKeywords: form.seoKeywords,
            contactPhone: form.contactPhone,
            contactEmail: form.contactEmail,
            deposit: form.deposit,
            utilities: form.utilities,
            petFriendly: form.petFriendly,
            furnished: form.furnished,
            parking: form.parking,
            amenities: form.amenities,
            images: processedImages,
            // Optional properties with defaults
            earnings: 0,
            occupancy: 0,
          };

        // Call onSave and don't reset isSubmitting here - let parent component control this
        onSave(cleanData);

        // Note: Don't set isSubmitting to false here - it will be reset after the API call completes
        // in the parent component (handleAddProperty or handleEditProperty)
      } catch (error) {
        console.error("Error in form submission:", error);
        setIsSubmitting(false);
        if (error instanceof Error && !error.message.includes("required")) {
          showError(`Failed to submit form: ${error.message}`);
        }
      }
    }
  }

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
          margin: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          border: 2px solid #f8fafc;
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          transform: scale(1.1);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #f8fafc;
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-4">
        <div ref={modalRef} className="relative w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl border border-gray-100 animate-fade-in-up max-h-[90vh] overflow-y-auto flex flex-col">
          <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar text-gray-700">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold z-10"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

            {/* Enhanced Header with Progress */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {mode === "add" ? "Add New Property" : "Edit Property"}
              </h2>
              <p className="text-gray-600 mb-4">
                Create an attractive listing for students
              </p>

            </div>

            {/* Enhanced Stepper */}
            <div className="mb-8">
              {/* Modern Progress Bar */}
              <div className="w-full max-w-lg mx-auto mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-[var(--color-primary-600)]">{completionScore}%</span>
                </div>
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-full transition-all duration-500"
                    style={{ width: `${completionScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Modern Horizontal Stepper */}
              <div className="flex items-start justify-center gap-1 sm:gap-4 w-full max-w-2xl mx-auto overflow-x-auto scrollbar-hide flex-nowrap">
                {["Basic Info", "Images", "Details", "Contact & SEO", "Review"].map((label, idx) => (
                  <div key={label} className="flex flex-col items-center justify-start w-full min-w-0 flex-grow">
                    <button
                      type="button"
                      onClick={() => setStep(idx)}
                      className={`flex flex-col items-center group focus:outline-none w-full`}
                      aria-current={step === idx ? "step" : undefined}
                    >
                      <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300
                        ${step > idx ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)] text-white' :
                          step === idx ? 'bg-white border-[var(--color-primary-500)] text-[var(--color-primary-600)] shadow-lg' :
                          'bg-gray-100 border-gray-300 text-gray-400'}
                      `}>
                        <span className="font-bold text-base">{idx + 1}</span>
                      </div>
                      <span className={`mt-2 text-xs sm:text-sm font-medium text-center whitespace-normal break-words transition-colors duration-300 min-h-[32px] sm:min-h-[24px] flex items-center justify-center w-full ...`}>{label}</span>
                    </button>
                    {idx < 4 && (
                      <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300
                        ${step > idx ? 'bg-[var(--color-primary-500)]' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Title *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${
                            validationErrors.title
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="e.g., Modern Student Apartment Near Campus"
                        />
                        <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                      {touched.title && !form.title && (
                        <span className="text-xs text-red-500 mt-1">
                          Title is required
                        </span>
                      )}
                      {validationErrors.title && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                          <XCircle className="w-3 h-3" />
                          {validationErrors.title}
                        </div>
                      )}
                      {form.title && !validationErrors.title && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                          <CheckCircle2 className="w-3 h-3" />
                          Good title length
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <div className="relative">
                        <input
                          ref={locationInputRef}
                          type="text"
                          value={form.location}
                          onChange={(e) => {
                            handleChange("location", e.target.value);
                            // Clear map coordinates when location is changed manually
                            if (form.latitude && form.longitude) {
                              handleChange("latitude", undefined);
                              handleChange("longitude", undefined);
                            }
                          }}
                          className={`w-full px-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${
                            touched.location && !form.location
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="e.g., 2 km from University Campus"
                          onFocus={() => setShowLocationSuggestions(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setShowLocationSuggestions(false),
                              200
                            )
                          }
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {form.location && !showLocationSuggestions && (
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => handleChange("location", "")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {touched.location && !form.location && (
                        <span className="text-xs text-red-500 mt-1">
                          Location is required
                        </span>
                      )}
                      {validationErrors.location && (
                        <span className="text-xs text-red-500 mt-1">
                          {validationErrors.location}
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-lg font-bold text-gray-800 mb-4">
                        Select Property Type{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {PROPERTY_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleChange("type", type.value)}
                            className={`group w-full h-full p-6 rounded-2xl border-2 transition-all duration-300 shadow-lg flex flex-col items-center justify-center gap-3 cursor-pointer
          ${
            form.type === type.value
              ? "border-[var(--color-primary-500)] bg-[var(--color-primary-600)] scale-105 shadow-2xl"
              : "border-gray-200 bg-white hover:border-[var(--color-primary-300)] hover:scale-105"
          }`}
                            aria-pressed={form.type === type.value}
                          >
                            <span className="text-5xl mb-2">{type.icon}</span>
                            <span className="text-xl font-semibold text-gray-900 group-hover:text-[var(--color-primary-200)]">
                              {type.label}
                            </span>
                            <span className="text-gray-500 text-sm text-center">
                              {type.description}
                            </span>
                            {form.type === type.value && (
                              <span className="mt-2 px-3 py-1 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-xs font-bold">
                                Selected
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      {touched.type && !form.type && (
                        <span className="text-xs text-red-500 mt-2 block">
                          Property type is required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent (INR) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          value={form.price}
                          onChange={(e) =>
                            handleChange("price", Number(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                          placeholder="Enter monthly rent"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                      </div>
                      {pricingSuggestion && form.price === 0 && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-700">
                                Smart Pricing Suggestion
                              </p>
                              <p className="text-sm text-blue-600">
                                Based on {form.type} properties in your area: ₹
                                {pricingSuggestion.toLocaleString()}/month
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  handleChange("price", pricingSuggestion)
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 font-medium"
                              >
                                Use suggested price
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {touched.price && !form.price && (
                        <span className="text-xs text-red-500 mt-1">
                          Price is required
                        </span>
                      )}
                      {validationErrors.price && (
                        <span className="text-xs text-red-500 mt-1">
                          {validationErrors.price}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Deposit (INR)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          value={form.deposit}
                          onChange={(e) =>
                            handleChange("deposit", Number(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                          placeholder="Security deposit amount"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          handleChange(
                            "status",
                            e.target.value as Property["status"]
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                      >
                        <option value="active">
                          Active - Available for rent
                        </option>
                        <option value="inactive">
                          Inactive - Temporarily unavailable
                        </option>
                        <option value="pending">Pending - Under review</option>
                        <option value="rented">
                          Rented - Currently occupied
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available From
                      </label>
                      <input
                        type="date"
                        value={
                          form.availableFrom
                            ? form.availableFrom.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleChange(
                            "availableFrom",
                            e.target.value
                              ? new Date(e.target.value).toISOString()
                              : new Date().toISOString()
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Images & Media */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Images *
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Add high-quality photos to attract more students. First
                    image will be the cover photo.
                  </p>

                  {/* Drag & Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      isDragging
                        ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)]"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="text-4xl">📸</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop images here or click to upload
                        </p>
                        <p className="text-sm text-gray-600">
                          Supports JPG, PNG, GIF up to 10MB each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[var(--color-primary-500)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-600)] transition-colors"
                      >
                        Choose Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Image Grid */}
                  {form.images.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Uploaded Images ({form.images.length}/8)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {form.images.map((img, idx) => (
                          <div
                            key={`${form.id}-image-${idx}`}
                            className="relative group"
                          >
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                              <img
                                src={img}
                                alt="Property"
                                className="object-cover w-full h-full"
                              />
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  Cover
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                              <button
                                className="bg-white/80 rounded-full p-2 text-gray-600 hover:text-red-600"
                                onClick={() => handleRemoveImage(idx)}
                                aria-label="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {idx > 0 && (
                                <button
                                  className="bg-white/80 rounded-full p-2 text-gray-600 hover:text-gray-900"
                                  onClick={() => handleReorderImage(idx, -1)}
                                  aria-label="Move left"
                                >
                                  ←
                                </button>
                              )}
                              {idx < form.images.length - 1 && (
                                <button
                                  className="bg-white/80 rounded-full p-2 text-gray-600 hover:text-gray-900"
                                  onClick={() => handleReorderImage(idx, 1)}
                                  aria-label="Move right"
                                >
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* URL Input */}
                  {form.images.length < 8 && (
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="Or paste image URL here"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                        />
                        <button
                          onClick={handleAddImage}
                          className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-50"
                          disabled={!newImage}
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  )}

                  {touched.images && form.images.length === 0 && (
                    <span className="text-xs text-red-500 mt-2">
                      At least one image is required
                    </span>
                  )}
                </div>

                {/* Virtual Tour */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual Tour URL
                  </label>
                  <input
                    type="url"
                    value={form.virtualTourUrl || ""}
                    onChange={(e) =>
                      handleChange(
                        "virtualTourUrl",
                        e.target.value || undefined
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                    placeholder="https://example.com/virtual-tour"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add a 360° virtual tour or video walkthrough link
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Details & Amenities */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent resize-none"
                        placeholder="Describe your property, highlight key features, mention nearby facilities, transportation options, etc."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Write an engaging description to attract students
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.bedrooms}
                          onChange={(e) =>
                            handleChange("bedrooms", Number(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={form.bathrooms}
                          onChange={(e) =>
                            handleChange("bathrooms", Number(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Features
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.furnished}
                            onChange={(e) =>
                              handleChange("furnished", e.target.checked)
                            }
                            className="w-5 h-5 text-[var(--color-primary-500)] rounded focus:ring-[var(--color-primary-500)]"
                          />
                          <div>
                            <div className="font-medium">Furnished</div>
                            <div className="text-sm text-gray-600">
                              Property comes with furniture
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.utilities}
                            onChange={(e) =>
                              handleChange("utilities", e.target.checked)
                            }
                            className="w-5 h-5 text-[var(--color-primary-500)] rounded focus:ring-[var(--color-primary-500)]"
                          />
                          <div>
                            <div className="font-medium">
                              Utilities Included
                            </div>
                            <div className="text-sm text-gray-600">
                              Electricity, water, internet included
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.parking}
                            onChange={(e) =>
                              handleChange("parking", e.target.checked)
                            }
                            className="w-5 h-5 text-[var(--color-primary-500)] rounded focus:ring-[var(--color-primary-500)]"
                          />
                          <div>
                            <div className="font-medium">Parking Available</div>
                            <div className="text-sm text-gray-600">
                              Free or paid parking space
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.petFriendly}
                            onChange={(e) =>
                              handleChange("petFriendly", e.target.checked)
                            }
                            className="w-5 h-5 text-[var(--color-primary-500)] rounded focus:ring-[var(--color-primary-500)]"
                          />
                          <div>
                            <div className="font-medium">Pet Friendly</div>
                            <div className="text-sm text-gray-600">
                              Pets are allowed
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(AMENITY_CATEGORIES).map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedAmenityCategory(category)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedAmenityCategory === category
                              ? "bg-[var(--color-primary-500)] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Selected Amenities */}
                    {form.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
                        {form.amenities.map((amenity, idx) => (
                          <span
                            key={amenity}
                            className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-200"
                          >
                            {amenity}
                            <button
                              className="ml-1 text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveAmenity(idx)}
                              aria-label={`Remove ${amenity}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Amenity Suggestions */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {AMENITY_CATEGORIES[
                        selectedAmenityCategory as keyof typeof AMENITY_CATEGORIES
                      ]
                        .filter((a) => !form.amenities.includes(a))
                        .map((amenity) => (
                          <button
                            key={amenity}
                            onClick={() => handleAddAmenity(amenity)}
                            className="p-3 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-sm">{amenity}</div>
                          </button>
                        ))}
                    </div>

                    {/* Custom Amenity Input */}
                    <div className="flex gap-2">
                      <input
                        ref={amenityInputRef}
                        type="text"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && amenityInput.trim()) {
                            handleAddAmenity(amenityInput.trim());
                          }
                        }}
                        placeholder="Add custom amenity"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                      />
                      <button
                        onClick={() =>
                          amenityInput.trim() &&
                          handleAddAmenity(amenityInput.trim())
                        }
                        className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-50"
                        disabled={!amenityInput.trim()}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact & SEO */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={form.contactPhone || ""}
                          onChange={(e) =>
                            handleChange(
                              "contactPhone",
                              e.target.value || undefined
                            )
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${
                            validationErrors.contactPhone
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="+91 xxxxxxxxxx"
                        />
                        <Smartphone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                      {validationErrors.contactPhone && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                          <XCircle className="w-3 h-3" />
                          {validationErrors.contactPhone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={form.contactEmail || ""}
                          onChange={(e) =>
                            handleChange(
                              "contactEmail",
                              e.target.value || undefined
                            )
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${
                            validationErrors.contactEmail
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="contact@example.com"
                        />
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                      {validationErrors.contactEmail && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                          <XCircle className="w-3 h-3" />
                          {validationErrors.contactEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Keywords
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.seoKeywords || ""}
                          onChange={(e) =>
                            handleChange(
                              "seoKeywords",
                              e.target.value || undefined
                            )
                          }
                          onFocus={() => setShowSEOSuggestions(true)}
                          onBlur={() =>
                            setTimeout(() => setShowSEOSuggestions(false), 200)
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                          placeholder="student accommodation, near campus, affordable"
                        />
                        
                      </div>

                      {/* SEO Suggestions */}
                      {showSEOSuggestions && (
                        <div className="absolute z-20 w-[400px] mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                          <div className="p-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-700">
                              Suggested keywords for {form.type}
                            </p>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {SEO_TEMPLATES[
                              form.type as keyof typeof SEO_TEMPLATES
                            ]
                              ?.split(", ")
                              .map((keyword) => (
                                <button
                                  key={keyword}
                                  onClick={() => {
                                    const current = form.seoKeywords || "";
                                    const newKeywords = current
                                      ? `${current}, ${keyword}`
                                      : keyword;
                                    handleChange("seoKeywords", newKeywords);
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                                >
                                  <Target className="w-4 h-4 text-[var(--color-primary-500)]" />
                                  {keyword}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        Keywords to help students find your property
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">
                            SEO Optimization Tips
                          </h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>
                              • Include location keywords (e.g., "near
                              university")
                            </li>
                            <li>
                              • Mention key features (e.g., "furnished",
                              "utilities included")
                            </li>
                            <li>
                              • Use student-specific terms (e.g.,
                              "student-friendly", "campus proximity")
                            </li>
                            <li>
                              • Add price-related keywords (e.g., "affordable",
                              "budget-friendly")
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Review Your Property
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Basic Information
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div>
                          <span className="font-medium">Title:</span>{" "}
                          {form.title}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>{" "}
                          {form.location}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {form.type}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ₹
                          {form.price.toLocaleString()}/month
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>{" "}
                          {form.status}
                        </div>
                        <div>
                          <span className="font-medium">Available From:</span>{" "}
                          {form.availableFrom
                            ? new Date(form.availableFrom).toLocaleDateString()
                            : "Not set"}
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Property Details
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div>
                          <span className="font-medium">Bedrooms:</span>{" "}
                          {form.bedrooms}
                        </div>
                        <div>
                          <span className="font-medium">Bathrooms:</span>{" "}
                          {form.bathrooms}
                        </div>
                        <div>
                          <span className="font-medium">Furnished:</span>{" "}
                          {form.furnished ? "Yes" : "No"}
                        </div>
                        <div>
                          <span className="font-medium">Utilities:</span>{" "}
                          {form.utilities ? "Included" : "Not included"}
                        </div>
                        <div>
                          <span className="font-medium">Parking:</span>{" "}
                          {form.parking ? "Available" : "Not available"}
                        </div>
                        <div>
                          <span className="font-medium">Pet Friendly:</span>{" "}
                          {form.petFriendly ? "Yes" : "No"}
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Images ({form.images.length})
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {form.images.map((img, idx) => (
                          <div
                            key={`${form.id}-review-image-${idx}`}
                            className="relative"
                          >
                            <img
                              src={img}
                              alt="Preview"
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Amenities ({form.amenities.length})
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        {form.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {form.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No amenities added
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {form.description && (
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="font-medium text-gray-900">
                          Description
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {form.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 shadow-md"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!isValid || isSubmitting}
                  className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 shadow-md flex items-center gap-2 ${
                    !isValid || isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>
                        {mode === "add"
                          ? "Adding Property..."
                          : "Saving Changes..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {mode === "add" ? "Add Property" : "Save Changes"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



export default function OwnerDashboard() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] =
    useState<Property | null>(null);
  // Add state for delete confirmation
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [analyticsData, setAnalyticsData] = useState<unknown>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
  // Extract user ID safely with type assertion
  const userId = session?.user ? (session.user as any).id : undefined;

  // Reference for the property type dropdown
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  // Reference for the status dropdown
  const statusRef = useRef<HTMLDivElement>(null);

  // Close modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close property type modal when clicking outside
      if (showPropertyTypeModal && 
          propertyTypeRef.current && 
          !propertyTypeRef.current.contains(event.target as Node)) {
        setShowPropertyTypeModal(false);
      }
      
      // Close status modal when clicking outside
      if (showStatusModal && 
          statusRef.current && 
          !statusRef.current.contains(event.target as Node)) {
        setShowStatusModal(false);
      }
    }

    // Add event listener when either modal is shown
    if (showPropertyTypeModal || showStatusModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPropertyTypeModal, showStatusModal]);
  
  // Fetch user's properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      // If no user is logged in or no user ID is available, show empty state
      if (!userId) {
        setLoading(false);
        setProperties([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/properties?ownerId=${userId}`
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch properties: ${response.status}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data.properties)) {
          // Map API response to Property type
          const mappedProperties = data.properties.map((property: any) => {
            // Extract amenity names from the complex amenity objects
            const amenityNames = Array.isArray(property.amenities)
              ? property.amenities
                  .map((a: any) =>
                    typeof a === "string" ? a : a.amenity ? a.amenity.name : ""
                  )
                  .filter(Boolean)
              : [];

            // Get first image URL if available
            const imageUrl = property.images && property.images.length > 0 
              ? (typeof property.images[0] === 'string' 
                ? property.images[0] 
                : property.images[0]?.url || "") 
              : "";

            return {
              ...property,
              image: imageUrl,
              status: property.status || "INACTIVE", // Ensure valid status
              views: property.views || 0,
              inquiries: property.inquiries || 0,
              rating: property.rating || 0,
              earnings: property.earnings || 0,
              occupancy: property.occupancy || 0,
              amenities: amenityNames,
            };
          });
          
          // Update properties state
          setProperties(mappedProperties);
          
          // Generate activity data based on user properties
          setActivities(generatePlaceholderActivities(mappedProperties));
        } else {
          // If no properties are returned or data format is unexpected
          setProperties([]);
          setActivities([]);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
        // Set properties to empty array on error
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  const totalProperties = properties.length;
  const activeProperties = properties.filter(
    (p) => p.status === "ACTIVE"
  ).length;
  const rentedProperties = properties.filter(
    (p) => p.status === "RENTED"
  ).length;
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
  const totalEarnings = properties.reduce(
    (sum, p) => sum + (p.earnings || 0),
    0
  );
  const averageOccupancy =
    properties.length > 0
      ? Math.round(
          properties.reduce((sum, p) => sum + (p.occupancy || 0), 0) /
            properties.length
        )
      : 0;
  const averageRating = properties.length > 0 ? (properties.reduce((sum, p) => sum + (p.rating || 0), 0) / properties.length).toFixed(2) : '0';

  const filteredProperties = properties.filter((property) => {
    const matchesStatus =
      selectedStatus === "all" || property.status === selectedStatus;
    const matchesType =
      selectedPropertyType === "all" || property.type === selectedPropertyType;
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "RENTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "inquiry":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "booking":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-600 fill-current" />;
      case "view":
        return <Eye className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const loadingToastId = showLoading("Deleting property...");

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete property");

      setProperties(properties.filter((p) => p.id !== id));
      updateToSuccess(loadingToastId, "Property deleted successfully!");
    } catch (error) {
      console.error("Error deleting property:", error);
      if (error instanceof Error) {
        updateToError(
          loadingToastId,
          `Failed to delete property: ${error.message}`
        );
      } else {
        updateToError(
          loadingToastId,
          "Failed to delete property: Unknown error"
        );
      }
    }
  };

  const handleAddProperty = async (
    newProperty: Property & { images: string[]; amenities: string[] }
  ) => {
    if (!userId) return;

    const loadingToastId = showLoading("Adding property...");

    try {
      // Ensure images are strings (URLs) not objects
      const imageUrls = Array.isArray(newProperty.images)
        ? newProperty.images.map((img) => {
            if (typeof img === "string") return img;
            if (img && typeof img === "object") {
              return (img as any).url || "";
            }
            return "";
          })
        : [];

      const cleanData = {
        ...newProperty,
        ownerId: userId,
        status: newProperty.status,
        availableFrom: newProperty.availableFrom || new Date().toISOString(),
        virtualTourUrl: newProperty.virtualTourUrl || undefined,
        seoKeywords: newProperty.seoKeywords || undefined,
        contactPhone: newProperty.contactPhone || undefined,
        contactEmail: newProperty.contactEmail || undefined,
        deposit: newProperty.deposit || undefined,
        images: imageUrls.filter(Boolean),
      };

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(
          errorData.error || errorData.message || "Failed to create property"
        );
      }

      const createdProperty = await response.json();

      // Process amenities from the API response to extract names
      const amenityNames = Array.isArray(createdProperty.amenities)
        ? createdProperty.amenities
            .map((a: any) =>
              typeof a === "string" ? a : a.amenity ? a.amenity.name : ""
            )
            .filter(Boolean)
        : [];

      setProperties([
        ...properties,
        {
          ...createdProperty,
          image: createdProperty.images[0]?.url || "",
          status: createdProperty.status,
          earnings: 0,
          occupancy: 0,
          amenities: amenityNames,
        },
      ]);

      // Close the modal after successful creation
      setShowAddProperty(false);

      // Show success toast
      updateToSuccess(loadingToastId, "Property added successfully!");
    } catch (error) {
      console.error("Error creating property:", error);
      if (error instanceof Error) {
        updateToError(
          loadingToastId,
          `Failed to create property: ${error.message}`
        );
      } else {
        updateToError(
          loadingToastId,
          "Failed to create property: Unknown error"
        );
      }
    }
  };

  const handleEditProperty = async (
    updatedProperty: Property & { images: string[]; amenities: string[] }
  ) => {
    const loadingToastId = showLoading("Updating property...");

    try {
      // Ensure images are strings (URLs) not objects
      const imageUrls = Array.isArray(updatedProperty.images)
        ? updatedProperty.images.map((img) => {
            if (typeof img === "string") return img;
            if (img && typeof img === "object") {
              return (img as any).url || "";
            }
            return "";
          })
        : [];

      const cleanData = {
        ...updatedProperty,
        status: updatedProperty.status,
        availableFrom:
          updatedProperty.availableFrom || new Date().toISOString(),
        virtualTourUrl: updatedProperty.virtualTourUrl || undefined,
        seoKeywords: updatedProperty.seoKeywords || undefined,
        contactPhone: updatedProperty.contactPhone || undefined,
        contactEmail: updatedProperty.contactEmail || undefined,
        deposit: updatedProperty.deposit || undefined,
        images: imageUrls.filter(Boolean),
      };

      const response = await fetch(`/api/properties/${updatedProperty.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(
          errorData.error || errorData.message || "Failed to update property"
        );
      }

      const updatedPropertyData = await response.json();

      // Safely access nested properties with optional chaining
      const propertyImage =
        updatedPropertyData.images && updatedPropertyData.images.length > 0
          ? updatedPropertyData.images[0]?.url || ""
          : "";

      // Process amenities from the API response to extract names
      const amenityNames = Array.isArray(updatedPropertyData.amenities)
        ? updatedPropertyData.amenities
            .map((a: any) =>
              typeof a === "string" ? a : a.amenity ? a.amenity.name : ""
            )
            .filter(Boolean)
        : [];

      // Update the properties state with proper fallbacks for missing data
      setProperties(
        properties.map((p) =>
          p.id === updatedProperty.id
            ? {
                ...p,
                ...updatedPropertyData,
                image: propertyImage,
                status: updatedPropertyData.status || p.status,
                earnings: updatedPropertyData.earnings || p.earnings || 0,
                occupancy: updatedPropertyData.occupancy || p.occupancy || 0,
                amenities: amenityNames,
              }
            : p
        )
      );

      // Close the edit modal after successful update
      setSelectedPropertyToEdit(null);

      // Show success toast
      updateToSuccess(loadingToastId, "Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      if (error instanceof Error) {
        updateToError(
          loadingToastId,
          `Failed to update property: ${error.message}`
        );
      } else {
        updateToError(
          loadingToastId,
          "Failed to update property: Unknown error"
        );
      }
    }
  };

  useEffect(() => {
    if (selectedPropertyToEdit && userId) {
      // Only track events if we have both a property and user ID
      trackAnalyticsEvent('property_view', selectedPropertyToEdit.id);
    }
    // Only fire when modal opens for a new property
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyToEdit?.id, userId]);

  // Fetch analytics data when analytics tab is selected
  useEffect(() => {
    if (!userId || properties.length === 0) {
      // Don't try to fetch analytics if we don't have a user or properties
      return;
    }

    setAnalyticsLoading(true);
    fetch(`/api/dashboard/analytics?ownerId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data);
        setAnalyticsLoading(false);
      })
      .catch(err => {
        console.error("Analytics error:", err);
        setAnalyticsError('Failed to load analytics');
        setAnalyticsLoading(false);
      });
  }, [userId, properties.length]);

  // 1. Add skeleton loader components at the top of the file:
  function StatsOverviewSkeleton() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col gap-4">
            <div className="h-5 w-1/3 bg-white/30 rounded" />
            <div className="h-10 w-2/3 bg-white/30 rounded" />
            <div className="h-4 w-1/4 bg-white/30 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  function PropertiesListSkeleton() {
    return (
      <div className="grid grid-cols-1 gap-6 py-6 mx-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-56 h-48 md:h-auto bg-gray-200" />
            <div className="flex-1 px-5 py-4 flex flex-col gap-2 justify-between">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-1/4 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function SidebarSkeleton() {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-40" />
        <div className="bg-white rounded-2xl shadow-lg p-6 h-40" />
        <div className="bg-white rounded-2xl shadow-lg p-6 h-40" />
      </div>
    );
  }

  // In the main render, replace the loading return with skeletons for all sections:
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" aria-busy="true">
        <Navbar />
        <div className="pt-16">
          <div className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <StatsOverviewSkeleton />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PropertiesListSkeleton />
              </div>
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" role="alert">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-red-200">
            <div className="text-3xl text-red-500 mb-4">&#9888;</div>
            <div className="text-red-600 text-lg font-semibold mb-2">Something went wrong</div>
            <div className="text-gray-700 mb-6">{error}</div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  // Force re-fetch by re-mounting
                  window.location.reload();
                }}
                className="bg-[var(--color-primary-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-600)] font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  // Allow user to see dashboard even with error
                  setError(null);
                  setProperties([]);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold"
              >
                View Dashboard Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apply background pattern styles */}
      <style jsx global>{backgroundPatternStyles}</style>
      
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Owner Dashboard
                </h1>
                <p className="text-xl text-white/90">
                  Manage your student accommodation listings and track
                  performance
                </p>
              </div>
              <button
                onClick={() => setShowAddProperty(true)}
                className="mt-6 md:mt-0 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3 border border-white/30"
              >
                <Plus className="w-5 h-5" />
                Add New Property
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">Total Properties</p>
                  <Home className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {totalProperties}
                </p>
                <div className="flex items-center gap-1 mt-2">
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">Active Listings</p>
                  <Building2 className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {activeProperties}
                </p>
                <div className="flex items-center gap-1 mt-2">
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">Total Views</p>
                  <EyeIcon className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-3xl font-bold text-white">
                {totalViews.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">Avg. Rating</p>
                  <StarIcon className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {averageRating}
                </p>
                <div className="flex items-center gap-1 mt-2">
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-gray-600">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        // Focus will trigger any needed UI updates
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                  />
                </div>
                <button 
                  className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-xl hover:bg-[var(--color-primary-600)] transition-colors duration-200 flex items-center justify-center gap-2 font-medium min-w-[100px]"
                  onClick={() => {
                    // This will force a re-render with current filters
                    // We're already using state for filters so this is enough
                    const searchInput = document.querySelector('input[placeholder="Search properties..."]');
                    if (searchInput instanceof HTMLInputElement) {
                      searchInput.focus();
                    }
                  }}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <div className="relative" ref={statusRef}>
                    <button
                      type="button"
                      onClick={() => setShowStatusModal(!showStatusModal)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[150px]"
                    >
                      {(() => {
                        const statusOption = STATUS_OPTIONS.find(s => s.value === selectedStatus);
                        const colorClass = 
                          statusOption?.color === 'green' ? 'bg-green-100 text-green-700' : 
                          statusOption?.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                          statusOption?.color === 'yellow' ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-700';
                        
                        return (
                          <>
                            <span className={`text-lg flex items-center justify-center w-6 h-6 rounded-md mr-2 ${colorClass}`}>
                              {statusOption?.icon}
                            </span>
                            <span>{statusOption?.label}</span>
                          </>
                        );
                      })()}
                      <span className="ml-auto">{showStatusModal ? "▲" : "▼"}</span>
                    </button>
                    
                    <div className={`absolute z-40 mt-2 w-[260px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden left-0 transition-all duration-200 origin-top ${showStatusModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      <div className="max-h-[280px] overflow-y-auto p-2">
                        {STATUS_OPTIONS.map(status => (
                          <button
                            key={status.value}
                            onClick={() => {
                              setSelectedStatus(status.value);
                              setShowStatusModal(false);
                            }}
                            className={`w-full text-left px-3 py-2 mb-1 rounded-lg hover:bg-gray-50 flex items-center gap-3 ${selectedStatus === status.value ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]" : ""}`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className={`text-xl flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${
                                status.color === 'green' ? 'bg-green-100 text-green-700' : 
                                status.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                                status.color === 'yellow' ? 'bg-amber-100 text-amber-700' : 
                                'bg-gray-100 text-gray-700'
                              }`}>{status.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{status.label}</div>
                                <div className="text-xs text-gray-500">{status.description}</div>
                              </div>
                              {selectedStatus === status.value && (
                                <span className="ml-auto text-[var(--color-primary-600)]">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Type:</span>
                  <div className="relative" ref={propertyTypeRef}>
                    <button
                      type="button"
                      onClick={() => setShowPropertyTypeModal(!showPropertyTypeModal)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[150px]"
                    >
                      {selectedPropertyType === "all" ? (
                        <span>All Types</span>
                      ) : (
                        <>
                          <span className="text-lg mr-1">
                            {PROPERTY_TYPES.find(t => t.value === selectedPropertyType)?.icon || "🏠"}
                          </span>
                          <span>
                            {PROPERTY_TYPES.find(t => t.value === selectedPropertyType)?.label || selectedPropertyType}
                          </span>
                        </>
                      )}
                      <span className="ml-auto">{showPropertyTypeModal ? "▲" : "▼"}</span>
                    </button>
                    
                    <div className={`absolute z-40 mt-2 w-[280px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden right-0 transition-all duration-200 origin-top ${showPropertyTypeModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      <div className="p-2 border-b border-gray-100">
                        <button
                          onClick={() => {
                            setSelectedPropertyType("all");
                            setShowPropertyTypeModal(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 ${selectedPropertyType === "all" ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]" : ""}`}
                        >
                          <span className="text-lg">🏠</span>
                          <span className="font-medium">All Types</span>
                          {selectedPropertyType === "all" && (
                            <span className="ml-auto text-[var(--color-primary-600)]">✓</span>
                          )}
                        </button>
                      </div>
                      <div className="max-h-[320px] overflow-y-auto p-2">
                        {PROPERTY_TYPES.map(type => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedPropertyType(type.value);
                              setShowPropertyTypeModal(false);
                            }}
                            className={`w-full text-left px-3 py-2 mb-1 rounded-lg hover:bg-gray-50 flex items-center ${selectedPropertyType === type.value ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]" : ""}`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className="text-2xl flex-shrink-0">{type.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500 truncate">{type.description}</div>
                              </div>
                              {selectedPropertyType === type.value && (
                                <span className="ml-auto text-[var(--color-primary-600)]">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-auto flex items-center">
                  <span className="text-sm bg-[var(--color-primary-50)] text-[var(--color-primary-700)] px-3 py-1.5 rounded-lg">
                    {filteredProperties.length} properties found
                  </span>
                </div>
              </div>
            </div>
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Properties
                  </h2>
                  <span className="text-sm text-gray-600">
                    {filteredProperties.length} properties
                  </span>
                </div>

                {filteredProperties.length === 0 ? (
                  <div className="text-center py-12 ">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get started by adding your first property listing
                    </p>
                    <button
                      onClick={() => setShowAddProperty(true)}
                      className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white px-6 py-3 rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300"
                    >
                      Add Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 py-6 mx-4">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-transform duration-200 hover:scale-[1.01] hover:shadow-2xl"
                      >
                        {/* Image with status badge */}
                        <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md z-10 ${property.status === 'ACTIVE' ? 'bg-green-500 text-white' : property.status === 'RENTED' ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'}`}>{property.status}</span>
                        </div>
                        {/* Card Content */}
                        <div className="flex-1 px-5 py-4 flex flex-col gap-2 justify-between">
                          {/* Title & Price */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg truncate flex-1" title={property.title}>{property.title}</h3>
                            <span className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-lg px-3 py-1 text-sm font-semibold shadow">₹{property.price.toLocaleString()}</span>
                          </div>
                          {/* Location, Type, Occupancy */}
                          <div className="flex flex-wrap gap-2 mb-1">
                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"><MapPin className="w-3 h-3" />{property.location}</span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"><Building2 className="w-3 h-3" />{property.type}</span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"><Users className="w-3 h-3" />{property.occupancy}% occupied</span>
                          </div>
                          {/* Features Row */}
                          <div className="flex flex-wrap gap-2 mb-1">
                            {property.furnished && <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><Home className="w-3 h-3" />Furnished</span>}
                            {property.petFriendly && <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">🐾 Pet Friendly</span>}
                            {property.parking && <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"><Car className="w-3 h-3" />Parking</span>}
                            {property.utilities && <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"><Wifi className="w-3 h-3" />Utilities</span>}
                          </div>
                          {/* Stats Row */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{property.views} views</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{property.inquiries} inquiries</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Updated {new Date(property.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          {/* Floating Action Buttons */}
                          <div className="flex items-center gap-2 mt-2 md:absolute md:bottom-4 md:right-4 md:flex-col md:gap-2 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
                            <button className="p-2 bg-white rounded-full shadow hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-colors duration-200"><Eye className="w-5 h-5" /></button>
                            <button onClick={() => setSelectedPropertyToEdit(property)} className="p-2 bg-white rounded-full shadow hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-colors duration-200"><Edit className="w-5 h-5" /></button>
                            <button onClick={() => setPropertyToDelete(property)} className="p-2 bg-white rounded-full shadow hover:text-red-600 hover:bg-red-50 transition-colors duration-200"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              {properties.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">No recent activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Generate placeholder activities from actual user properties */}
                  {generatePlaceholderActivities(properties).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="w-full mt-4 text-center p-2 text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium">
                View All Activity →
              </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Add New Property
                        </p>
                        <p className="text-sm text-gray-600">
                          List a new accommodation
                        </p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--color-secondary-100)] rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-[var(--color-secondary-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          View Analytics
                        </p>
                        <p className="text-sm text-gray-600">
                          Performance insights
                        </p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          View Inquiries
                        </p>
                        <p className="text-sm text-gray-600">
                          Respond to students
                        </p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Payment History
                        </p>
                        <p className="text-sm text-gray-600">
                          View transactions
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tips & Support */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tips & Support
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-[var(--color-primary-50)] rounded-xl">
                    <p className="text-sm font-medium text-[var(--color-primary-800)] mb-1">
                      Boost Your Listing
                    </p>
                    <p className="text-xs text-[var(--color-primary-700)]">
                      Add high-quality photos to increase views by 40%
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--color-secondary-50)] rounded-xl">
                    <p className="text-sm font-medium text-[var(--color-secondary-800)] mb-1">
                      Quick Response
                    </p>
                    <p className="text-xs text-[var(--color-secondary-700)]">
                      Respond to inquiries within 24 hours for better conversion
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-xl">
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Pricing Strategy
                    </p>
                    <p className="text-xs text-yellow-700">
                      Competitive pricing can increase inquiries by 60%
                    </p>
                  </div>
                  <button className="w-full text-center p-2 text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium">
                    Get Support →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PropertyModal
        open={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        onSave={handleAddProperty}
        mode="add"
      />

      {selectedPropertyToEdit && (
        <PropertyModal
          open={!!selectedPropertyToEdit}
          onClose={() => setSelectedPropertyToEdit(null)}
          onSave={handleEditProperty}
          initialValues={selectedPropertyToEdit}
          mode="edit"
        />
      )}

      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold z-10"
              onClick={() => setPropertyToDelete(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Delete Property</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete <span className="font-semibold">{propertyToDelete.title}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteProperty(propertyToDelete.id);
                  setPropertyToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
