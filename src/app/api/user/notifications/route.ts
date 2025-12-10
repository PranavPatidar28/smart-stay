import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

// This would normally be in its own model, but for simplicity we're creating it here
// In a real app, you'd extend the User model or create a separate UserPreferences model
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  messageNotifications: z.boolean().default(true),
  bookingNotifications: z.boolean().default(true),
  marketingNotifications: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In a real app, we would fetch this from the database
    // For demo purposes, we're returning default values
    return NextResponse.json({
      emailNotifications: true,
      messageNotifications: true,
      bookingNotifications: true,
      marketingNotifications: false,
    })
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

    // In a real app, we would update this in the database
    // For demo purposes, we're just returning the validated data

    // Example of how this would be saved in a real app:
    // await prisma.userPreferences.upsert({
    //   where: { userId: session.user.id },
    //   update: validatedData,
    //   create: {
    //     userId: session.user.id,
    //     ...validatedData
    //   }
    // })

    return NextResponse.json({
      ...validatedData,
      message: 'Notification preferences updated successfully'
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