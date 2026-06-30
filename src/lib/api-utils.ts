import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'
import { Role } from '@/types/role'

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  details?: unknown
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function createApiResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status: statusCode })
}

export function createErrorResponse(
  error: string,
  statusCode: number = 500,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { error, details },
    { status: statusCode }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  // Log the full error server-side for debugging.
  console.error('API Error:', error)

  // Intentional, safe-to-expose application errors.
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode, error.details)
  }

  if (error instanceof z.ZodError) {
    return createErrorResponse(
      'Validation error',
      400,
      error.errors
    )
  }

  // Never leak internal error details (Prisma constraint/table names, stack
  // traces, etc.) to the client. Return a generic message instead.
  return createErrorResponse('Internal server error', 500)
}

export async function requireAuth() {
  const session = await getSession()

  if (!session?.user?.id) {
    throw new ApiError(401, 'Unauthorized')
  }

  return session
}

export async function requireRole(requiredRole: Role) {
  const session = await requireAuth()

  if (session.user.role !== requiredRole) {
    throw new ApiError(403, `Access denied. ${requiredRole} role required.`)
  }

  return session
}

export async function requireLandlord() {
  return requireRole('LANDLORD')
}

export async function requireStudent() {
  return requireRole('STUDENT')
}

export function validatePaginationParams(searchParams: URLSearchParams) {
  // Guard against non-numeric input: Math.max(1, parseInt('abc')) is NaN, which
  // would propagate into skip/take and make Prisma throw a 500.
  const rawPage = parseInt(searchParams.get('page') || '1', 10)
  const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage)
  const rawLimit = parseInt(searchParams.get('limit') || '10', 10)
  const limit = Number.isNaN(rawLimit) ? 10 : Math.min(100, Math.max(1, rawLimit))

  return { page, limit, skip: (page - 1) * limit }
}

export function createPaginationResponse(
  data: unknown[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export function sanitizeSearchQuery(query: string): string {
  // Unicode-aware: keep letters/numbers from ANY script (Devanagari, accented
  // Latin, etc.) so non-English queries aren't stripped to an empty string,
  // which Prisma's `contains: ''` would treat as "match everything".
  return query.trim().replace(/[^\p{L}\p{N}\s-]/gu, '').substring(0, 100)
}

export function validateId(id: string): boolean {
  return /^[a-zA-Z0-9]{20,}$/.test(id)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/
  return phoneRegex.test(phone)
}

export function validatePropertyData(data: {
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
}) {
  const requiredFields: (keyof typeof data)[] = ['title', 'location', 'price', 'bedrooms', 'type']
  const missingFields = requiredFields.filter(field => !data[field])

  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`)
  }

  if (data.price < 1000 || data.price > 100000) {
    throw new ApiError(400, 'Price must be between ₹1,000 and ₹100,000')
  }

  if (data.bedrooms < 0 || data.bedrooms > 10) {
    throw new ApiError(400, 'Number of bedrooms must be between 0 and 10')
  }

  if (data.bathrooms < 0 || data.bathrooms > 10) {
    throw new ApiError(400, 'Number of bathrooms must be between 0 and 10')
  }
}

export function validateBookingData(data: {
  startDate: string;
  endDate?: string;
  amount: number;
  deposit?: number;
}) {
  if (!data.startDate) {
    throw new ApiError(400, 'Start date is required')
  }

  if (data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    throw new ApiError(400, 'End date must be after start date')
  }

  if (data.amount < 0) {
    throw new ApiError(400, 'Amount must be positive')
  }

  if (data.deposit && data.deposit < 0) {
    throw new ApiError(400, 'Deposit must be positive')
  }
}

export function validateReviewData(data: {
  rating: number;
  comment?: string;
}) {
  if (data.rating < 1 || data.rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5')
  }

  if (data.comment && (data.comment.length < 10 || data.comment.length > 500)) {
    throw new ApiError(400, 'Comment must be between 10 and 500 characters')
  }
}

export function validateInquiryData(data: {
  message: string;
}) {
  if (!data.message || data.message.length < 10 || data.message.length > 1000) {
    throw new ApiError(400, 'Message must be between 10 and 1000 characters')
  }
}

export function getDateRange(period: string): { startDate: Date; endDate: Date } {
  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case '7':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90':
      startDate.setDate(startDate.getDate() - 90)
      break
    case '365':
      startDate.setDate(startDate.getDate() - 365)
      break
    default:
      startDate.setDate(startDate.getDate() - 30)
  }

  return { startDate, endDate }
} 