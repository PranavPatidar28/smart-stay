import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Define more flexible schemas for validation
const updatePropertySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(100).optional(),
  description: z.string().optional().nullable(),
  location: z.string().min(3).optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  price: z.number().min(0).optional(),
  deposit: z.number().min(0).optional().nullable(),
  type: z.enum(['APARTMENT', 'STUDIO', 'SHARED_HOUSE', 'LUXURY', 'ROOM', 'FAMILY_HOME', 'HOSTEL', 'PG']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'RENTED']).optional(),
  bedrooms: z.number().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
  availableFrom: z.string().optional().nullable(),
  virtualTourUrl: z.string().url().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  utilities: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  furnished: z.boolean().optional(),
  parking: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  ownerId: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
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

    // Increment view count
    await prisma.property.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(property)
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    try {
      const validatedData = updatePropertySchema.parse(body);

      // Check if property exists
      const existingProperty = await prisma.property.findUnique({
        where: { id: params.id },
      });

      if (!existingProperty) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      // Remove images and amenities from validatedData before update
      const { images: imageUrls, amenities: amenityNames, ...updateData } = validatedData;
      
      // Prepare update data with proper handling of nullable fields
      const updateFields: Record<string, unknown> = {
        ...updateData,
        lastUpdated: new Date(),
      };

      // Handle nullable fields properly
      if (updateData.availableFrom !== undefined) {
        updateFields.availableFrom = updateData.availableFrom ? new Date(updateData.availableFrom) : null;
      }
      
      if (updateData.bedrooms !== undefined) {
        updateFields.bedrooms = updateData.bedrooms ?? 1; // Use default if null
      }
      
      if (updateData.bathrooms !== undefined) {
        updateFields.bathrooms = updateData.bathrooms ?? 1; // Use default if null
      }
      
      // Update property
      let updatedProperty = await prisma.property.update({
        where: { id: params.id },
        data: updateFields,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              verified: true,
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
      });
      
      // Update images if provided
      if (imageUrls && imageUrls.length > 0) {
        try {
          // Delete existing images
          await prisma.propertyImage.deleteMany({
            where: { propertyId: params.id },
          });

          // Create new images
          await prisma.propertyImage.createMany({
            data: imageUrls.map((url, index) => ({
              propertyId: params.id,
              url,
              order: index,
              isCover: index === 0,
            })),
          });
        } catch (imageError) {
          throw new Error(`Image update failed: ${(imageError as Error).message}`);
        }
      }

      // Update amenities if provided
      if (amenityNames && amenityNames.length > 0) {
        try {
          // Delete existing amenities
          await prisma.propertyAmenity.deleteMany({
            where: { propertyId: params.id },
          });

          // Create new amenities
          for (const amenityName of amenityNames) {
            await prisma.propertyAmenity.create({
              data: {
                property: {
                  connect: { id: params.id }
                },
                amenity: {
                  connectOrCreate: {
                    where: { name: amenityName },
                    create: {
                      name: amenityName,
                      category: 'Custom',
                    },
                  },
                },
              },
            });
          }
        } catch (amenityError) {
          throw new Error(`Amenity update failed: ${(amenityError as Error).message}`);
        }
      }

      // Fetch the updated property with fresh data
      if (validatedData.images || validatedData.amenities) {
        try {
          const refreshedProperty = await prisma.property.findUnique({
            where: { id: params.id },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  verified: true,
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
          });
          
          if (refreshedProperty) {
            updatedProperty = refreshedProperty;
          }
        } catch (fetchError) {
          throw new Error(`Fetch updated property failed: ${(fetchError as Error).message}`);
        }
      }

      return NextResponse.json(updatedProperty);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Delete property (cascade will handle related records)
    await prisma.property.delete({
      where: { id: params.id },
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