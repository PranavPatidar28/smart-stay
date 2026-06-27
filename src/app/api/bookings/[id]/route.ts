import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

// Renters may only edit notes and (while PENDING) their dates. Status
// transitions and money fields are landlord-only and handled separately below.
const updateBookingSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
})

export async function GET(
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

    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
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
    const validatedData = updateBookingSchema.parse(body)

    // Load the booking and its property owner. The caller must be EITHER the
    // renter who made the booking OR the owner of the booked property.
    const existingBooking = await prisma.booking.findUnique({
      where: { id: id },
      include: { property: { select: { ownerId: true, title: true } } },
    })

    if (
      !existingBooking ||
      (existingBooking.userId !== session.user.id &&
        existingBooking.property.ownerId !== session.user.id)
    ) {
      // 404 to avoid leaking existence of other users' bookings.
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const isOwner = existingBooking.property.ownerId === session.user.id
    const isRenter = existingBooking.userId === session.user.id

    if (existingBooking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot modify completed booking' },
        { status: 400 }
      )
    }

    // Build the update payload based on role. This is the core authorization
    // fix: a renter must NOT be able to confirm/complete or re-price their own
    // booking; only the property owner can change status.
    const updateData: Record<string, unknown> = {}

    if (validatedData.notes !== undefined) {
      // Both parties may update notes.
      updateData.notes = validatedData.notes
    }

    // Date changes: renter may reschedule only while still PENDING.
    if (validatedData.startDate !== undefined || validatedData.endDate !== undefined) {
      if (!isRenter || existingBooking.status !== 'PENDING') {
        return NextResponse.json(
          { error: 'Dates can only be changed by the renter while the booking is pending' },
          { status: 403 }
        )
      }
      const newStart = validatedData.startDate ? new Date(validatedData.startDate) : existingBooking.startDate
      const newEnd = validatedData.endDate
        ? new Date(validatedData.endDate)
        : existingBooking.endDate
      if (newEnd && newEnd <= newStart) {
        return NextResponse.json(
          { error: 'endDate must be after startDate' },
          { status: 400 }
        )
      }
      if (validatedData.startDate !== undefined) updateData.startDate = newStart
      if (validatedData.endDate !== undefined) updateData.endDate = newEnd
    }

    // Status transitions are owner-only. Renters can only CANCEL their own
    // pending/confirmed booking (handled via DELETE), not self-confirm/complete.
    if (validatedData.status !== undefined && validatedData.status !== existingBooking.status) {
      if (!isOwner) {
        return NextResponse.json(
          { error: 'Only the property owner can change the booking status' },
          { status: 403 }
        )
      }
      updateData.status = validatedData.status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No permitted fields to update' },
        { status: 400 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: updateData,
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

    // Notify the relevant counterparty when status changed.
    if (updateData.status) {
      await prisma.notification.create({
        data: {
          // Owner changed status -> notify the renter.
          userId: existingBooking.userId,
          type: 'BOOKING',
          title: 'Booking Status Updated',
          message: `Your booking for ${existingBooking.property.title} is now ${String(updateData.status).toLowerCase()}`,
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

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
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
      where: { id: id },
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