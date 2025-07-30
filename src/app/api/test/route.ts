import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const propertyCount = await prisma.property.count();
    const properties = await prisma.property.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        location: true
      }
    });

    return NextResponse.json({
      success: true,
      propertyCount,
      sampleProperties: properties,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 