import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const createInquirySchema = z.object({
  propertyId: z.string().cuid(),
  message: z.string().min(10).max(1000),
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
    const propertyId = searchParams.get('propertyId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}

    if (propertyId) {
      where.propertyId = propertyId
    }

    if (status) {
      where.status = status
    }

    // If propertyId is provided, get inquiries for that property
    // Otherwise, get user's own inquiries
    if (propertyId) {
      // Check if user owns the property
      const property = await prisma.property.findFirst({
        where: {
          id: propertyId,
          ownerId: session.user.id,
        },
      })

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found or access denied' },
          { status: 404 }
        )
      }
    } else {
      where.userId = session.user.id
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              location: true,
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
      prisma.inquiry.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      inquiries,
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
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
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
    const validatedData = createInquirySchema.parse(body)

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

    if (property.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Property is not available for inquiries' },
        { status: 400 }
      )
    }

    // Check if user is not the property owner
    if (property.ownerId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot send inquiries to your own property' },
        { status: 400 }
      )
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        userId: session.user.id,
        propertyId: validatedData.propertyId,
        message: validatedData.message,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        },
      },
    });

    // Analytics: Create InquiryEvent
    await prisma.inquiryEvent.create({
      data: {
        propertyId: inquiry.propertyId,
        userId: inquiry.userId,
        inquiryId: inquiry.id,
        metadata: { messageLength: inquiry.message.length },
      },
    });

    // Create notification for property owner
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'INQUIRY',
        title: 'New Inquiry Received',
        message: `New inquiry for ${property.title}`,
      },
    });

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
} 