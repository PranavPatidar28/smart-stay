import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  messageNotifications: z.boolean().default(true),
  bookingNotifications: z.boolean().default(true),
  marketingNotifications: z.boolean().default(false),
});

// Defaults returned when a user has no preferences row yet.
const DEFAULTS = {
  emailNotifications: true,
  messageNotifications: true,
  bookingNotifications: true,
  marketingNotifications: false,
};

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const prefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
      select: {
        emailNotifications: true,
        messageNotifications: true,
        bookingNotifications: true,
        marketingNotifications: true,
      },
    })

    return NextResponse.json(prefs ?? DEFAULTS)
  } catch (error) {
    console.error('Error fetching notification preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = notificationSchema.parse(body)

    const saved = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
      select: {
        emailNotifications: true,
        messageNotifications: true,
        bookingNotifications: true,
        marketingNotifications: true,
      },
    })

    return NextResponse.json({
      ...saved,
      message: 'Notification preferences updated successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating notification preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
} 