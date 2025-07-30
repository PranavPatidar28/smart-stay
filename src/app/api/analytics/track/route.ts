import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, propertyId, metadata, bookingId, inquiryId, userId } = body;
    const sessionUserId = body.userId || null;

    // Validate required fields
    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid eventType' }, { status: 400 });
    }

    // For events that don't require a propertyId (like performance metrics), skip property-specific tracking
    if (!propertyId) {
      return NextResponse.json({ success: true });
    }

    // Validate propertyId format
    if (typeof propertyId !== 'string' || propertyId.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid propertyId format' }, { status: 400 });
    }

    const sanitizedPropertyId = propertyId.trim();

    // Verify the property exists before tracking events
    const property = await prisma.property.findUnique({
      where: { id: sanitizedPropertyId },
      select: { id: true }
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Handle different event types
    if (eventType === 'property_view') {
      await prisma.propertyViewEvent.create({
        data: { propertyId: sanitizedPropertyId, userId: sessionUserId, metadata },
      });
      await prisma.property.update({
        where: { id: sanitizedPropertyId },
        data: { views: { increment: 1 } },
      });
    } else if (eventType === 'booking' || eventType === 'booking_request') {
      await prisma.bookingEvent.create({
        data: { propertyId: sanitizedPropertyId, userId: sessionUserId, bookingId, metadata },
      });
    } else if (eventType === 'inquiry') {
      await prisma.inquiryEvent.create({
        data: { propertyId: sanitizedPropertyId, userId: sessionUserId, inquiryId, metadata },
      });
    } else if (eventType === 'phone_contact' || eventType === 'email_contact' || 
               eventType === 'property_card_contact' || eventType === 'favorites_property_contact') {
      // Track contact events as inquiry events for now
      await prisma.inquiryEvent.create({
        data: { 
          propertyId: sanitizedPropertyId, 
          userId: sessionUserId, 
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
          propertyId: sanitizedPropertyId, 
          userId: sessionUserId, 
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
          propertyId: sanitizedPropertyId, 
          userId: sessionUserId, 
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
          propertyId: sanitizedPropertyId, 
          userId: sessionUserId, 
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
          propertyId: sanitizedPropertyId, 
          userId: sessionUserId, 
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