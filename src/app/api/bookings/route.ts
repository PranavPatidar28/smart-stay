import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'
import { ApiError } from '@/lib/api-utils'

const createBookingSchema = z
  .object({
    propertyId: z.string().cuid(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    notes: z.string().max(1000).optional(),
    // NOTE: amount/deposit are NOT accepted from the client. They are computed
    // server-side from the property's price/deposit to prevent price tampering.
  })
  .refine(
    (data) => !data.endDate || new Date(data.endDate) > new Date(data.startDate),
    { message: 'endDate must be after startDate', path: ['endDate'] }
  )

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

    const startDate = new Date(validatedData.startDate)
    const endDate = validatedData.endDate ? new Date(validatedData.endDate) : null

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

    // A landlord cannot book their own property.
    if (property.ownerId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot book your own property' },
        { status: 400 }
      )
    }

    // Compute the amount server-side from the property's price. The monthly
    // price is prorated by the number of months in the requested range
    // (minimum one month). deposit comes from the property, not the client.
    const monthlyPrice = property.price
    let months = 1
    if (endDate) {
      const msPerMonth = 1000 * 60 * 60 * 24 * 30
      months = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / msPerMonth))
    }
    const amount = monthlyPrice * months
    const deposit = property.deposit ?? null

    // Atomically re-check for conflicts and create the booking so two
    // concurrent requests can't both pass the overlap check.
    const booking = await prisma.$transaction(async (tx) => {
      // Null-safe, symmetric overlap test:
      //   existing.start <= newEnd  AND  (existing.end >= newStart OR existing.end IS NULL)
      const effectiveNewEnd = endDate ?? startDate
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          propertyId: validatedData.propertyId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          startDate: { lte: effectiveNewEnd },
          OR: [
            { endDate: { gte: startDate } },
            { endDate: null },
          ],
        },
      })

      if (conflictingBooking) {
        throw new ApiError(400, 'Property is already booked for the selected dates')
      }

      const created = await tx.booking.create({
        data: {
          userId: session.user.id,
          propertyId: validatedData.propertyId,
          startDate,
          endDate,
          amount,
          deposit,
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
      })

      // Analytics: Create BookingEvent
      await tx.bookingEvent.create({
        data: {
          propertyId: created.propertyId,
          userId: created.userId,
          bookingId: created.id,
          metadata: { amount: created.amount, deposit: created.deposit },
        },
      })

      // Create notification for property owner
      await tx.notification.create({
        data: {
          userId: property.ownerId,
          type: 'BOOKING',
          title: 'New Booking Request',
          message: `New booking request for ${property.title}`,
        },
      })

      return created
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
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