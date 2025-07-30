import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test basic database operations
    const propertyCount = await prisma.property.count();
    
    // Test analytics tables
    const viewEventsCount = await prisma.propertyViewEvent.count();
    const bookingEventsCount = await prisma.bookingEvent.count();
    const inquiryEventsCount = await prisma.inquiryEvent.count();
    
    // Try to create a test analytics event
    const testProperty = await prisma.property.findFirst({
      select: { id: true, title: true }
    });
    
    let testEventResult = null;
    if (testProperty) {
      try {
        testEventResult = await prisma.propertyViewEvent.create({
          data: {
            propertyId: testProperty.id,
            metadata: { test: true, timestamp: new Date() }
          }
        });
      } catch (error) {
        testEventResult = { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return NextResponse.json({
      success: true,
      propertyCount,
      viewEventsCount,
      bookingEventsCount,
      inquiryEventsCount,
      testProperty,
      testEventResult,
      message: 'Database test completed'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 