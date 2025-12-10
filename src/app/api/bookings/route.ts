import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const createBookingSchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  amount: z.number().min(0),
  deposit: z.number().min(0).optional(),
  notes: z.string().optional(),
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = { userId: session.user.id }
    if (status) where.status = status

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      bookings,
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
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
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
    const validatedData = createBookingSchema.parse(body)

    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Property is not available for booking' },
        { status: 400 }
      )
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: validatedData.propertyId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: new Date(validatedData.startDate) },
            endDate: { gte: new Date(validatedData.startDate) },
          },
          {
            startDate: { lte: validatedData.endDate ? new Date(validatedData.endDate) : new Date(validatedData.startDate) },
            endDate: { gte: validatedData.endDate ? new Date(validatedData.endDate) : new Date(validatedData.startDate) },
          },
        ],
      },
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Property is already booked for the selected dates' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        propertyId: validatedData.propertyId,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        amount: validatedData.amount,
        deposit: validatedData.deposit,
        notes: validatedData.notes,
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
    });

    // Analytics: Create BookingEvent
    await prisma.bookingEvent.create({
      data: {
        propertyId: booking.propertyId,
        userId: booking.userId,
        bookingId: booking.id,
        metadata: { amount: booking.amount, deposit: booking.deposit },
      },
    });

    // Create notification for property owner
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'BOOKING',
        title: 'New Booking Request',
        message: `New booking request for ${property.title}`,
      },
    });

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
} 