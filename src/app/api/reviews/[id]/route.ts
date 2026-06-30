import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(500).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateReviewSchema.parse(body)

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        property: true,
      },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Update review and recompute the property's average rating atomically.
    const updatedReview = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: id },
        data: validatedData,
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

      if (validatedData.rating) {
        const agg = await tx.review.aggregate({
          where: { propertyId: existingReview.propertyId },
          _avg: { rating: true },
        })
        await tx.property.update({
          where: { id: existingReview.propertyId },
          data: { rating: agg._avg.rating ?? 0 },
        })
      }

      return updated
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        property: true,
      },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Delete review and recompute the property's average rating atomically.
    await prisma.$transaction(async (tx) => {
      await tx.review.delete({
        where: { id: id },
      })

      const agg = await tx.review.aggregate({
        where: { propertyId: review.propertyId },
        _avg: { rating: true },
        _count: { _all: true },
      })

      await tx.property.update({
        where: { id: review.propertyId },
        data: { rating: agg._count._all > 0 ? agg._avg.rating ?? 0 : 0 },
      })
    })

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
} 