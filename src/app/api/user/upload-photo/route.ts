import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()

    // Check if this is an actual file upload or just a test/placeholder request
    if (body.placeholder) {
      // For testing purposes only - should be removed in production

      // Return the current user image without changing it
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          image: true
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Profile picture check successful',
        image: currentUser?.image || null
      });
    }

    // In a real implementation, this would process an actual file upload
    // For example, using formData to get the file and upload to cloud storage
    if (body.imageData) {
      // This is where you would handle the actual image upload
      // For example: const imageUrl = await uploadToCloudStorage(body.imageData);

      // For now, we'll use a fixed profile image instead of a random one
      // to prevent unexpected changes
      const imageUrl = body.imageUrl || session.user.image;

      // Only update if we have a new image URL
      if (imageUrl && imageUrl !== session.user.image) {
        // Update user with new image URL
        const updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: { image: imageUrl },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Profile picture updated successfully',
          image: updatedUser.image
        });
      }
    }

    // If no valid image data was provided
    return NextResponse.json({
      success: false,
      message: 'No valid image data provided',
      image: session.user.image
    }, { status: 400 });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
} 