import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const createReviewSchema = z.object({
  propertyId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10') || 10))
    const skip = (page - 1) * limit

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { propertyId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { propertyId } }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      reviews,
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
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
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
    const validatedData = createReviewSchema.parse(body)

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

    // Check if user has already reviewed this property
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: validatedData.propertyId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this property' },
        { status: 400 }
      )
    }

    // Check if user has booked this property (optional validation)
    const hasBooked = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        propertyId: validatedData.propertyId,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    })

    if (!hasBooked) {
      return NextResponse.json(
        { error: 'You can only review properties you have booked' },
        { status: 400 }
      )
    }

    // Create the review, recompute the property's average rating, and notify
    // the owner atomically so concurrent reviews can't persist a stale average.
    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          userId: session.user.id,
          propertyId: validatedData.propertyId,
          rating: validatedData.rating,
          comment: validatedData.comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      const agg = await tx.review.aggregate({
        where: { propertyId: validatedData.propertyId },
        _avg: { rating: true },
      })

      await tx.property.update({
        where: { id: validatedData.propertyId },
        data: { rating: agg._avg.rating ?? 0 },
      })

      await tx.notification.create({
        data: {
          userId: property.ownerId,
          type: 'REVIEW',
          title: 'New Review Received',
          message: `New ${validatedData.rating}-star review for ${property.title}`,
        },
      })

      return created
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
} 