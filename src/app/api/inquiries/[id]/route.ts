import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const updateInquirySchema = z.object({
  status: z.enum(['PENDING', 'RESPONDED', 'CLOSED']),
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
    const validatedData = updateInquirySchema.parse(body)

    // Check if inquiry exists and user owns the property
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id: params.id,
        property: {
          ownerId: session.user.id,
        },
      },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found or access denied' },
        { status: 404 }
      )
    }

    // Update inquiry status
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: { status: validatedData.status },
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
    })

    // Create notification for the user who sent the inquiry
    await prisma.notification.create({
      data: {
        userId: inquiry.userId,
        type: 'INQUIRY',
        title: 'Inquiry Update',
        message: `Your inquiry for ${inquiry.property.title} has been ${validatedData.status.toLowerCase()}`,
      },
    })

    return NextResponse.json(updatedInquiry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
} 