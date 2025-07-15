import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createPropertySchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().optional(),
  location: z.string().min(5),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().min(1000).max(100000),
  deposit: z.number().min(0).optional(),
  type: z.enum(['APARTMENT', 'STUDIO', 'SHARED_HOUSE', 'LUXURY', 'ROOM', 'FAMILY_HOME', 'HOSTEL', 'PG']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'RENTED']).default('ACTIVE'),
  bedrooms: z.number().min(0).default(1),
  bathrooms: z.number().min(0).default(1),
  availableFrom: z.string().datetime().optional(),
  virtualTourUrl: z.string().url().optional(),
  seoKeywords: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  utilities: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  furnished: z.boolean().default(false),
  parking: z.boolean().default(false),
  images: z.array(z.string().url()),
  amenities: z.array(z.string()),
  ownerId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy')

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    }

    if (type) where.type = type
    if (status) where.status = status
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Determine orderBy based on sortBy
    let orderBy: Record<string, unknown> = { createdAt: 'desc' };
    if (sortBy === 'price-low') orderBy = { price: 'asc' };
    else if (sortBy === 'price-high') orderBy = { price: 'desc' };
    else if (sortBy === 'rating') orderBy = { rating: 'desc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    // Debug log
    console.log('sortBy:', sortBy, 'orderBy:', orderBy);

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

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
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
        ownerId: validatedData.ownerId,
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