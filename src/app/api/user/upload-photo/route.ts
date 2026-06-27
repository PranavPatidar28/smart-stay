import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'

const updatePhotoSchema = z.object({
  imageUrl: z.string().url().max(2000).refine(
    (u) => /^https?:\/\//i.test(u),
    { message: 'Image URL must use http(s)' }
  ),
})

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
    const parsed = updatePhotoSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'A valid http(s) image URL is required' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: parsed.data.imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Profile picture updated successfully',
      image: updatedUser.image,
    })
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
} 