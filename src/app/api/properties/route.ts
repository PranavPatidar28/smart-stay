import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const createPropertySchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().max(5000).optional(),
  location: z.string().min(5).max(200),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  price: z.number().min(1000).max(1000000),
  deposit: z.number().min(0).max(10000000).optional(),
  type: z.enum(['APARTMENT', 'STUDIO', 'SHARED_HOUSE', 'LUXURY', 'ROOM', 'FAMILY_HOME', 'HOSTEL', 'PG']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'RENTED']).default('ACTIVE'),
  bedrooms: z.number().int().min(0).max(50).default(1),
  bathrooms: z.number().min(0).max(50).default(1),
  availableFrom: z.string().datetime().optional(),
  virtualTourUrl: z.string().url().max(2000).optional(),
  seoKeywords: z.string().max(500).optional(),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email().max(200).optional(),
  utilities: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  furnished: z.boolean().default(false),
  parking: z.boolean().default(false),
  images: z.array(z.string().url().max(2000)).max(20),
  amenities: z.array(z.string().min(1).max(50)).max(30),
  // NOTE: ownerId is intentionally NOT accepted from the client. It is always
  // derived from the authenticated session to prevent identity forgery.
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    // Clamp pagination to safe bounds to prevent resource-exhaustion DoS.
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10') || 10))
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy')
    const ownerId = searchParams.get('ownerId')
    const furnished = searchParams.get('furnished') === 'true'
    const petFriendly = searchParams.get('petFriendly') === 'true'
    const availableNow = searchParams.get('availableNow') === 'true'
    const amenities = searchParams.getAll('amenities')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    // Collect OR-groups into an AND array so independent filters don't clobber
    // each other (a single `where.OR =` assignment would overwrite a prior one).
    const andClauses: Record<string, unknown>[] = []

    // Only show ACTIVE properties by default if not filtering by ownerId
    // When filtering by owner, show all their properties regardless of status
    if (!ownerId) {
      where.status = 'ACTIVE'
    }

    // If ownerId is provided, filter by owner
    if (ownerId) {
      where.ownerId = ownerId
    }

    if (type) where.type = type
    if (status) where.status = status
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {}
      const min = minPrice ? parseFloat(minPrice) : NaN
      const max = maxPrice ? parseFloat(maxPrice) : NaN
      if (!Number.isNaN(min)) priceFilter.gte = min
      if (!Number.isNaN(max)) priceFilter.lte = max
      if (Object.keys(priceFilter).length > 0) where.price = priceFilter
    }
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (search) {
      andClauses.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      })
    }
    // Add quick filters
    if (furnished) where.furnished = true
    if (petFriendly) where.petFriendly = true
    if (availableNow) {
      andClauses.push({
        OR: [
          { availableFrom: null },
          { availableFrom: { lte: new Date() } },
        ],
      })
    }
    // Apply amenities filter at the DB level (AND semantics) so pagination
    // counts and contents stay consistent across pages.
    if (amenities.length > 0) {
      for (const amenity of amenities) {
        andClauses.push({ amenities: { some: { amenity: { name: amenity } } } })
      }
    }

    if (andClauses.length > 0) {
      where.AND = andClauses
    }

    // Determine orderBy based on sortBy
    let orderBy: Record<string, unknown> = { createdAt: 'desc' };
    if (sortBy === 'price-low') orderBy = { price: 'asc' };
    else if (sortBy === 'price-high') orderBy = { price: 'desc' };
    else if (sortBy === 'rating') orderBy = { rating: 'desc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    // Optimize the query by limiting the data fetched
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              verified: true,
            },
          },
          images: {
            orderBy: { order: 'asc' },
            take: 4, // Limit to 4 images for performance
          },
          amenities: {
            include: {
              amenity: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                }
              },
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

    const totalPages = Math.ceil(total / limit)

    const response = NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require an authenticated LANDLORD. ownerId is derived from the session,
    // never from the request body.
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'LANDLORD') {
      return NextResponse.json(
        { error: 'Access denied. Landlord role required.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createPropertySchema.parse(body)

    // Create property with images and amenities
    const property = await prisma.property.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        price: validatedData.price,
        deposit: validatedData.deposit,
        type: validatedData.type,
        status: validatedData.status,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        availableFrom: validatedData.availableFrom ? new Date(validatedData.availableFrom) : null,
        virtualTourUrl: validatedData.virtualTourUrl,
        seoKeywords: validatedData.seoKeywords,
        contactPhone: validatedData.contactPhone,
        contactEmail: validatedData.contactEmail,
        utilities: validatedData.utilities,
        petFriendly: validatedData.petFriendly,
        furnished: validatedData.furnished,
        parking: validatedData.parking,
        ownerId: session.user.id,
        images: {
          create: validatedData.images.map((url, index) => ({
            url,
            order: index,
            isCover: index === 0,
          })),
        },
        amenities: {
          create: validatedData.amenities.map(amenityName => ({
            amenity: {
              connectOrCreate: {
                where: { name: amenityName },
                create: {
                  name: amenityName,
                  category: 'Custom',
                },
              },
            },
          })),
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
} 