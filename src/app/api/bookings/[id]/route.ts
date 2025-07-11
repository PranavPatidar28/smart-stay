import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const updateBookingSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  amount: z.number().min(0).optional(),
  deposit: z.number().min(0).optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                verified: true,
                phone: true,
                email: true,
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
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        property: true,
      },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking can be modified
    if (existingBooking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot modify completed booking' },
        { status: 400 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                verified: true,
                phone: true,
                email: true,
              },
            },
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        },
      },
    })

    // Create notification if status changed
    if (validatedData.status && validatedData.status !== existingBooking.status) {
      await prisma.notification.create({
        data: {
          userId: existingBooking.property.ownerId,
          type: 'BOOKING',
          title: 'Booking Status Updated',
          message: `Booking for ${existingBooking.property.title} is now ${validatedData.status.toLowerCase()}`,
        },
      })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        property: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking can be cancelled
    if (booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel completed booking' },
        { status: 400 }
      )
    }

    // Cancel booking
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    // Create notification for property owner
    await prisma.notification.create({
      data: {
        userId: booking.property.ownerId,
        type: 'BOOKING',
        title: 'Booking Cancelled',
        message: `Booking for ${booking.property.title} has been cancelled`,
      },
    })

    return NextResponse.json({ message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
} 