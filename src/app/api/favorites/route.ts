import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'
import { decimalToNumber } from '@/lib/serialize'

const addFavoriteSchema = z.object({
  propertyId: z.string().cuid(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10') || 10))
    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          property: {
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
                take: 1,
              },
              amenities: {
                include: {
                  amenity: true,
                },
              },
              _count: {
                select: {
                  reviews: true,
                  inquiries: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.favorite.count({
        where: { userId: session.user.id },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      favorites: decimalToNumber(favorites),
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
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = addFavoriteSchema.parse(body)

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Use upsert to create or return existing favorite
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: validatedData.propertyId,
        },
      },
      update: {}, // No updates needed if it exists
      create: {
        userId: session.user.id,
        propertyId: validatedData.propertyId,
      },
      include: {
        property: {
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
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json(decimalToNumber(favorite), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
} 