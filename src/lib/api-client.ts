import { ApiResponse } from './api-utils'
import { Role } from '@/types/role'

// Types
export interface Property {
  id: string
  title: string
  description?: string
  location: string
  latitude?: number
  longitude?: number
  price: number
  deposit?: number
  type: string
  status: string
  bedrooms: number
  bathrooms: number
  availableFrom?: string
  virtualTourUrl?: string
  isAvailable: boolean
  seoKeywords?: string
  contactPhone?: string
  contactEmail?: string
  utilities: boolean
  petFriendly: boolean
  furnished: boolean
  parking: boolean
  views: number
  rating: number
  earnings: number
  occupancy: number
  lastUpdated: string
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name: string
    verified: boolean
    phone?: string
    email?: string
    image?: string
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
      icon?: string
    }
  }>
  _count: {
    favorites: number
    reviews: number
    inquiries: number
  }
}

export interface Booking {
  id: string
  startDate: string
  endDate?: string
  status: string
  amount: number
  deposit?: number
  notes?: string
  createdAt: string
  updatedAt: string
  property: Property
}

export interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image?: string
  }
}

export interface Inquiry {
  id: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  property: {
    id: string
    title: string
    location: string
    images: Array<{ url: string }>
  }
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role | null
  verified: boolean
  image?: string
  createdAt: string
  updatedAt: string
  _count: {
    properties: number
    favorites: number
    bookings: number
    reviews: number
    inquiries: number
  }
}

export interface SearchFilters {
  search?: string
  type?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  sortBy?: string
  sortOrder?: string
  verified?: boolean
  furnished?: boolean
  petFriendly?: boolean
  parking?: boolean
  utilities?: boolean
  page?: number
  limit?: number
}

export interface DashboardAnalytics {
  overview: {
    totalProperties: number
    totalEarnings: number
    totalBookings: number
    averageRating: number
    totalReviews: number
  }
  propertyStats: Record<string, number>
  bookingStats: Record<string, { count: number; amount: number }>
  inquiryStats: Record<string, number>
  recentActivity: Notification[]
  topProperties: Property[]
  period: number
}

// API Client Class
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Properties API
  async getProperties(filters: SearchFilters = {}): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, String(value))
        }
      }
    })

    return this.request<ApiResponse<Property[]>>(`/properties?${params.toString()}`)
  }

  async getProperty(id: string): Promise<Property> {
    return this.request<Property>(`/properties/${id}`)
  }

  async createProperty(data: Partial<Property>): Promise<Property> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/properties/${id}`, {
      method: 'DELETE',
    })
  }

  // Search API
  async searchProperties(filters: SearchFilters = {}): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, String(value))
        }
      }
    })

    return this.request<ApiResponse<Property[]>>(`/search?${params.toString()}`)
  }

  // Favorites API
  async getFavorites(page = 1, limit = 10): Promise<ApiResponse<Property[]>> {
    return this.request<ApiResponse<Property[]>>(`/favorites?page=${page}&limit=${limit}`)
  }

  async addFavorite(propertyId: string): Promise<Property> {
    return this.request<Property>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    })
  }

  async removeFavorite(propertyId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/favorites/${propertyId}`, {
      method: 'DELETE',
    })
  }

  // Bookings API
  async getBookings(status?: string, page = 1, limit = 10): Promise<ApiResponse<Booking[]>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) params.append('status', status)

    return this.request<ApiResponse<Booking[]>>(`/bookings?${params.toString()}`)
  }

  async getBooking(id: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`)
  }

  async createBooking(data: {
    propertyId: string
    startDate: string
    endDate?: string
    amount: number
    deposit?: number
    notes?: string
  }): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async cancelBooking(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/bookings/${id}`, {
      method: 'DELETE',
    })
  }

  // Reviews API
  async getReviews(propertyId: string, page = 1, limit = 10): Promise<ApiResponse<Review[]>> {
    return this.request<ApiResponse<Review[]>>(`/reviews?propertyId=${propertyId}&page=${page}&limit=${limit}`)
  }

  async createReview(data: {
    propertyId: string
    rating: number
    comment?: string
  }): Promise<Review> {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review> {
    return this.request<Review>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteReview(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/reviews/${id}`, {
      method: 'DELETE',
    })
  }

  // Inquiries API
  async getInquiries(propertyId?: string, status?: string, page = 1, limit = 10): Promise<ApiResponse<Inquiry[]>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (propertyId) params.append('propertyId', propertyId)
    if (status) params.append('status', status)

    return this.request<ApiResponse<Inquiry[]>>(`/inquiries?${params.toString()}`)
  }

  async createInquiry(data: {
    propertyId: string
    message: string
  }): Promise<Inquiry> {
    return this.request<Inquiry>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    return this.request<Inquiry>(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Notifications API
  async getNotifications(unreadOnly = false, page = 1, limit = 10): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (unreadOnly) params.append('unread', 'true')

    return this.request<ApiResponse<Notification[]>>(`/notifications?${params.toString()}`)
  }

  async markNotificationsAsRead(notificationIds: string[]): Promise<{ message: string }> {
    return this.request<{ message: string }>('/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notificationIds }),
    })
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    return this.request<Notification>(`/notifications/${id}`, {
      method: 'PUT',
    })
  }

  // User Profile API
  async getUserProfile(): Promise<User> {
    return this.request<User>('/user/profile')
  }

  async updateUserProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Amenities API
  async getAmenities(category?: string, search?: string): Promise<{
    amenities: Array<{
      id: string
      name: string
      category: string
      icon?: string
    }>
    groupedAmenities: Record<string, unknown[]>
  }> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)

    return this.request(`/amenities?${params.toString()}`)
  }

  // Dashboard Analytics API
  async getDashboardAnalytics(period = 30): Promise<DashboardAnalytics> {
    return this.request<DashboardAnalytics>(`/dashboard/analytics?period=${period}`)
  }
}

export type AnalyticsEventType =
  | 'property_view'
  | 'booking_request'
  | 'inquiry'
  | 'phone_contact'
  | 'email_contact'
  | 'property_card_contact'
  | 'favorites_property_contact'
  | 'favorite_added'
  | 'favorite_removed'
  | 'property_shared'
  | 'review_submitted'
  | 'search_performed'
  | 'filter_applied'
  | 'sort_applied'
  | 'quick_filter_applied'
  | 'filters_cleared'
  | 'view_mode_changed';

export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  propertyId?: string,
  options: Record<string, unknown> = {}
): Promise<void> {
  try {
    if (!eventType || typeof eventType !== 'string') {
      return;
    }

    const sanitizedPropertyId = typeof propertyId === 'string' && propertyId.trim().length > 0
      ? propertyId.trim()
      : undefined;

    // Split known top-level fields from generic metadata
    const { bookingId, inquiryId, ...metadata } = options || {};

    const payload: Record<string, unknown> = {
      eventType,
      ...(sanitizedPropertyId ? { propertyId: sanitizedPropertyId } : {}),
      ...(bookingId ? { bookingId } : {}),
      ...(inquiryId ? { inquiryId } : {}),
      ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
    };

    const json = JSON.stringify(payload);

    // Prefer sendBeacon for non-blocking delivery
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        const blob = new Blob([json], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/analytics/track', blob);
        if (sent) return;
        // If sendBeacon returns false, fall back to fetch below
      } catch {
        // fall through to fetch
      }
    }

    // Fallback: fire-and-forget fetch with keepalive
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => { });
  } catch {
    // Swallow errors — analytics should never block user flows
  }
}

// Export singleton instance
export const apiClient = new ApiClient();