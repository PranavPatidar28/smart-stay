import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'
import { decimalToNumber } from '@/lib/serialize'

// Define more flexible schemas for validation
const updatePropertySchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(5000).optional().nullable(),
  location: z.string().min(3).max(200).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  price: z.number().min(0).max(1000000).optional(),
  deposit: z.number().min(0).max(10000000).optional().nullable(),
  type: z.enum(['APARTMENT', 'STUDIO', 'SHARED_HOUSE', 'LUXURY', 'ROOM', 'FAMILY_HOME', 'HOSTEL', 'PG']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'RENTED']).optional(),
  bedrooms: z.number().int().min(0).max(50).optional().nullable(),
  bathrooms: z.number().min(0).max(50).optional().nullable(),
  availableFrom: z.string().optional().nullable(),
  virtualTourUrl: z.string().url().max(2000).optional().nullable(),
  seoKeywords: z.string().max(500).optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
  contactEmail: z.string().email().max(200).optional().nullable(),
  utilities: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  furnished: z.boolean().optional(),
  parking: z.boolean().optional(),
  images: z.array(z.string().url().max(2000)).max(20).optional(),
  amenities: z.array(z.string().min(1).max(50)).max(30).optional(),
  // NOTE: id and ownerId are intentionally NOT accepted — the property id comes
  // from the URL and ownership can never be reassigned via this endpoint.
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id: id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            verified: true,
            // Contact details (phone/email) are intentionally omitted from this
            // public endpoint. They are exchanged via the authenticated inquiry flow.
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
            inquiries: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // View counting is handled exclusively by POST /api/analytics/track
    // ('property_view') with per-session dedup, so we do NOT increment here
    // (incrementing on every fetch double-counts and is trivially inflatable).

    return NextResponse.json(decimalToNumber(property))
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Require authentication and ownership.
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePropertySchema.parse(body);

    // Check if property exists and is owned by the caller.
    const existingProperty = await prisma.property.findUnique({
      where: { id: id },
      select: { id: true, ownerId: true },
    });

    if (!existingProperty || existingProperty.ownerId !== session.user.id) {
      // Return 404 (not 403) so we don't leak the existence of others' properties.
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Separate relations from scalar fields. Build the scalar update payload
    // from an explicit allowlist so client input can never set ownerId/id/etc.
    const { images: imageUrls, amenities: amenityNames, ...updateData } = validatedData;

    const updateFields: Record<string, unknown> = {
      ...updateData,
      lastUpdated: new Date(),
    };

    // Handle nullable/derived fields properly.
    if (updateData.availableFrom !== undefined) {
      updateFields.availableFrom = updateData.availableFrom ? new Date(updateData.availableFrom) : null;
    }
    if (updateData.bedrooms !== undefined) {
      updateFields.bedrooms = updateData.bedrooms ?? 1;
    }
    if (updateData.bathrooms !== undefined) {
      updateFields.bathrooms = updateData.bathrooms ?? 1;
    }

    // Apply the property update plus any image/amenity replacement atomically,
    // so a partial failure cannot leave the property without images/amenities.
    const updatedProperty = await prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id: id },
        data: updateFields,
      });

      if (imageUrls) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });
        if (imageUrls.length > 0) {
          await tx.propertyImage.createMany({
            data: imageUrls.map((url, index) => ({
              propertyId: id,
              url,
              order: index,
              isCover: index === 0,
            })),
          });
        }
      }

      if (amenityNames) {
        await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });
        for (const amenityName of amenityNames) {
          await tx.propertyAmenity.create({
            data: {
              property: { connect: { id: id } },
              amenity: {
                connectOrCreate: {
                  where: { name: amenityName },
                  create: { name: amenityName, category: 'Custom' },
                },
              },
            },
          });
        }
      }

      return tx.property.findUnique({
        where: { id: id },
        include: {
          owner: { select: { id: true, name: true, verified: true } },
          images: { orderBy: { order: 'asc' } },
          amenities: { include: { amenity: true } },
        },
      });
    });

    return NextResponse.json(decimalToNumber(updatedProperty));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Require authentication and ownership.
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id: id },
      select: { id: true, ownerId: true },
    })

    if (!existingProperty || existingProperty.ownerId !== session.user.id) {
      // Return 404 (not 403) to avoid leaking existence of others' properties.
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Delete property (cascade will handle related records)
    await prisma.property.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}