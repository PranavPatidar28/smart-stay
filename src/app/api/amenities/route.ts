import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build where clause
    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const amenities = await prisma.amenity.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    })

    // Group by category
    const groupedAmenities = amenities.reduce((acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = []
      }
      acc[amenity.category].push(amenity)
      return acc
    }, {} as Record<string, unknown[]>)

    return NextResponse.json({
      amenities,
      groupedAmenities,
    })
  } catch (error) {
    console.error('Error fetching amenities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    )
  }
} 