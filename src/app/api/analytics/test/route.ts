import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get recent analytics events for testing
    const recentEvents = await prisma.propertyViewEvent.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        property: {
          select: { title: true }
        }
      }
    });

    const recentInquiries = await prisma.inquiryEvent.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        property: {
          select: { title: true }
        }
      }
    });

    const recentBookings = await prisma.bookingEvent.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        property: {
          select: { title: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        recentViews: recentEvents,
        recentInquiries,
        recentBookings,
        totalViews: await prisma.propertyViewEvent.count(),
        totalInquiries: await prisma.inquiryEvent.count(),
        totalBookings: await prisma.bookingEvent.count(),
      }
    });
  } catch (error) {
    console.error('Error fetching analytics test data:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics test data' }, { status: 500 });
  }
} 