import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(500).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
        id: params.id,
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

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
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

    // Update property rating if rating changed
    if (validatedData.rating) {
      const allReviews = await prisma.review.findMany({
        where: { propertyId: existingReview.propertyId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

      await prisma.property.update({
        where: { id: existingReview.propertyId },
        data: { rating: averageRating },
      })
    }

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
  { params }: { params: { id: string } }
) {
  try {
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
        id: params.id,
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

    // Delete review
    await prisma.review.delete({
      where: { id: params.id },
    })

    // Update property rating
    const remainingReviews = await prisma.review.findMany({
      where: { propertyId: review.propertyId },
      select: { rating: true },
    })

    const averageRating = remainingReviews.length > 0
      ? remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length
      : 0

    await prisma.property.update({
      where: { id: review.propertyId },
      data: { rating: averageRating },
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