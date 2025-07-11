import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { eventType, propertyId, metadata, bookingId, inquiryId } = body;
    const userId = session?.user?.id || body.userId || null;

    if (!eventType || !propertyId) {
      return NextResponse.json({ error: 'Missing eventType or propertyId' }, { status: 400 });
    }

    // Handle different event types
    if (eventType === 'property_view') {
      await prisma.propertyViewEvent.create({
        data: { propertyId, userId, metadata },
      });
      await prisma.property.update({
        where: { id: propertyId },
        data: { views: { increment: 1 } },
      });
    } else if (eventType === 'booking') {
      await prisma.bookingEvent.create({
        data: { propertyId, userId, bookingId, metadata },
      });
    } else if (eventType === 'inquiry') {
      await prisma.inquiryEvent.create({
        data: { propertyId, userId, inquiryId, metadata },
      });
    } else {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
} 