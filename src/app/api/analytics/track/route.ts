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
    } else if (eventType === 'booking' || eventType === 'booking_request') {
      await prisma.bookingEvent.create({
        data: { propertyId, userId, bookingId, metadata },
      });
    } else if (eventType === 'inquiry') {
      await prisma.inquiryEvent.create({
        data: { propertyId, userId, inquiryId, metadata },
      });
    } else if (eventType === 'phone_contact' || eventType === 'email_contact' || 
               eventType === 'property_card_contact' || eventType === 'favorites_property_contact') {
      // Track contact events as inquiry events for now
      await prisma.inquiryEvent.create({
        data: { 
          propertyId, 
          userId, 
          metadata: { 
            ...metadata, 
            contactType: eventType,
            timestamp: new Date()
          }
        },
      });
    } else if (eventType === 'property_shared') {
      // Track share events as view events with metadata
      await prisma.propertyViewEvent.create({
        data: { 
          propertyId, 
          userId, 
          metadata: { 
            ...metadata, 
            action: 'shared',
            timestamp: new Date()
          }
        },
      });
    } else if (eventType === 'favorite_added' || eventType === 'favorite_removed') {
      // Track favorite events as view events with metadata
      await prisma.propertyViewEvent.create({
        data: { 
          propertyId, 
          userId, 
          metadata: { 
            ...metadata, 
            action: eventType,
            timestamp: new Date()
          }
        },
      });
    } else if (eventType === 'review_submitted') {
      // Track review events as inquiry events with metadata
      await prisma.inquiryEvent.create({
        data: { 
          propertyId, 
          userId, 
          metadata: { 
            ...metadata, 
            action: 'review_submitted',
            timestamp: new Date()
          }
        },
      });
    } else {
      // For any other event type, track as a view event with metadata
      await prisma.propertyViewEvent.create({
        data: { 
          propertyId, 
          userId, 
          metadata: { 
            ...metadata, 
            action: eventType,
            timestamp: new Date()
          }
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
} 