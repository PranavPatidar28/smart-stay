import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validatePaginationParams, createPaginationResponse, sanitizeSearchQuery, handleApiError } from '@/lib/api-utils'
import { decimalToNumber } from '@/lib/serialize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = validatePaginationParams(searchParams)

    // Extract search parameters
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const amenities = searchParams.getAll('amenities')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    // Whitelist sort direction — Prisma throws (→ 500) on any value other than
    // 'asc'/'desc', so an attacker could trigger errors with ?sortOrder=foo.
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'
    const verifiedOnly = searchParams.get('verified') === 'true'
    const furnished = searchParams.get('furnished')
    const petFriendly = searchParams.get('petFriendly')
    const parking = searchParams.get('parking')
    const utilities = searchParams.get('utilities')

    // Build where clause
    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    }

    // Search in title, description, and location
    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search)
      // Only add the OR clause when something survives sanitization, otherwise
      // `contains: ''` matches every row and returns the whole catalog.
      if (sanitizedSearch) {
        where.OR = [
          { title: { contains: sanitizedSearch, mode: 'insensitive' } },
          { description: { contains: sanitizedSearch, mode: 'insensitive' } },
          { location: { contains: sanitizedSearch, mode: 'insensitive' } },
        ]
      }
    }

    // Filter by property type
    if (type && type !== 'all') {
      where.type = type
    }

    // Filter by status
    if (status && status !== 'all') {
      where.status = status
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {}
      const min = minPrice ? parseFloat(minPrice) : NaN
      const max = maxPrice ? parseFloat(maxPrice) : NaN
      if (!Number.isNaN(min)) priceFilter.gte = min
      if (!Number.isNaN(max)) priceFilter.lte = max
      if (Object.keys(priceFilter).length > 0) where.price = priceFilter
    }

    // Filter by location
    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Filter by bedrooms
    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms)
    }

    // Filter by bathrooms
    if (bathrooms) {
      where.bathrooms = parseFloat(bathrooms)
    }

    // Filter by amenities
    if (amenities.length > 0) {
      where.amenities = {
        some: {
          amenity: {
            name: { in: amenities },
          },
        },
      }
    }

    // Filter by property features
    if (furnished !== null) {
      where.furnished = furnished === 'true'
    }

    if (petFriendly !== null) {
      where.petFriendly = petFriendly === 'true'
    }

    if (parking !== null) {
      where.parking = parking === 'true'
    }

    if (utilities !== null) {
      where.utilities = utilities === 'true'
    }

    // Filter by verified owners only
    if (verifiedOnly) {
      where.owner = {
        verified: true,
      }
    }

    // Build order by clause
    const orderBy: Record<string, unknown> = {}
    switch (sortBy) {
      case 'price':
        orderBy.price = sortOrder
        break
      case 'rating':
        orderBy.rating = sortOrder
        break
      case 'views':
        orderBy.views = sortOrder
        break
      case 'createdAt':
        orderBy.createdAt = sortOrder
        break
      case 'updatedAt':
        orderBy.updatedAt = sortOrder
        break
      default:
        orderBy.createdAt = 'desc'
    }

    // Execute search with pagination
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              verified: true,
              image: true,
            },
          },
          images: {
            orderBy: { order: 'asc' },
            take: 5, // Limit images for performance
          },
          amenities: {
            include: {
              amenity: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              reviews: true,
              inquiries: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ])

    // Get search suggestions for autocomplete
    const suggestions = search ? await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
        status: 'ACTIVE',
      },
      select: {
        title: true,
        location: true,
      },
      take: 5,
    }) : []

    // Get filter options for UI
    const filterOptions = await Promise.all([
      // Property types
      prisma.property.groupBy({
        by: ['type'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
      }),
      // Price ranges
      prisma.property.aggregate({
        where: { status: 'ACTIVE' },
        _min: { price: true },
        _max: { price: true },
      }),
      // Popular locations
      prisma.property.groupBy({
        by: ['location'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ])

    const response = createPaginationResponse(properties, total, page, limit)
    
    return NextResponse.json(decimalToNumber({
      ...response,
      suggestions: suggestions.map(s => ({ text: s.title, type: 'title' }))
        .concat(suggestions.map(s => ({ text: s.location, type: 'location' }))),
      filterOptions: {
        types: filterOptions[0].map(t => ({ value: t.type, count: t._count.id })),
        priceRange: {
          min: filterOptions[1]._min.price || 0,
          max: filterOptions[1]._max.price || 0,
        },
        locations: filterOptions[2].map(l => ({ value: l.location, count: l._count.id })),
      },
    }))
  } catch (error) {
    return handleApiError(error)
  }
} 