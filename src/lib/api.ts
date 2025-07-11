// API utility functions for connecting frontend to database

export interface Property {
  id: string
  title: string
  description?: string
  location: string
  latitude?: number
  longitude?: number
  price: number
  deposit?: number
  type: 'APARTMENT' | 'STUDIO' | 'SHARED_HOUSE' | 'LUXURY' | 'ROOM' | 'FAMILY_HOME' | 'HOSTEL' | 'PG'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'RENTED'
  bedrooms: number
  bathrooms: number
  availableFrom?: string
  virtualTourUrl?: string
  seoKeywords?: string
  contactPhone?: string
  contactEmail?: string
  utilities: boolean
  petFriendly: boolean
  furnished: boolean
  parking: boolean
  views: number
  inquiries: number
  rating: number
  earnings: number
  occupancy: number
  lastUpdated: string
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: {
    id: string
    name: string
    verified: boolean
    phone?: string
    email?: string
  }
  images: Array<{
    id: string
    url: string
    order: number
    isCover: boolean
  }>
  amenities: Array<{
    amenity: {
      id: string
      name: string
      category: string
    }
  }>
  _count: {
    favorites: number
    reviews: number
    inquiries: number
  }
}

export interface CreatePropertyData {
  title: string
  description?: string
  location: string
  price: number
  deposit?: number
  type: Property['type']
  status?: Property['status']
  bedrooms: number
  bathrooms: number
  availableFrom?: string
  virtualTourUrl?: string
  seoKeywords?: string
  contactPhone?: string
  contactEmail?: string
  utilities: boolean
  petFriendly: boolean
  furnished: boolean
  parking: boolean
  images: string[]
  amenities: string[]
  ownerId: string
}

export interface PropertiesResponse {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Fetch properties with filters
export async function fetchProperties(params: {
  page?: number
  limit?: number
  type?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  search?: string
} = {}): Promise<PropertiesResponse> {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/properties?${searchParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }

  return response.json()
}

// Fetch single property
export async function fetchProperty(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }

  return response.json()
}

// Create new property
export async function createProperty(data: CreatePropertyData): Promise<Property> {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create property')
  }

  return response.json()
}

// Update property
export async function updateProperty(id: string, data: Partial<CreatePropertyData>): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update property')
  }

  return response.json()
}

// Delete property
export async function deleteProperty(id: string): Promise<void> {
  const response = await fetch(`/api/properties/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete property')
  }
}

// Fetch user's properties (for owner dashboard)
export async function fetchUserProperties(userId: string): Promise<Property[]> {
  const response = await fetch(`/api/properties?ownerId=${userId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch user properties')
  }

  const data = await response.json()
  return data.properties
}

// Utility function to transform property data for frontend
export function transformPropertyForFrontend(property: Property) {
  return {
    ...property,
    image: property.images[0]?.url || '',
    images: property.images.map(img => img.url),
    amenities: property.amenities.map(a => a.amenity.name),
    landlord: {
      name: property.owner.name,
      rating: 4.5, // This would come from reviews
      verified: property.owner.verified,
    },
    features: {
      furnished: property.furnished,
      parking: property.parking,
      petFriendly: property.petFriendly,
      utilities: property.utilities,
    },
    isAvailable: property.status === 'ACTIVE',
    isFavorite: false, // This would be determined by user context
    distance: '5 min from campus', // This would be calculated
    availableFrom: property.availableFrom || new Date().toISOString(),
  }
}

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Response wrapper for better error handling
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new APIError(
        data.error || 'API request failed',
        response.status,
        data.details
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError('Network error', 0)
  }
} 