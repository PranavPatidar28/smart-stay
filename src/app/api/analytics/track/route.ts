import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, propertyId, metadata, bookingId, inquiryId, userId } = body;
    const sessionUserId: string | null = typeof userId === 'string' && userId.trim().length > 0 ? userId.trim() : null;
    const hasMetadata = metadata !== undefined && metadata !== null && typeof metadata === 'object';

    // Validate required fields
    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid eventType' }, { status: 400 });
    }

    // For events that don't require a propertyId (search/filter/sort/view-mode etc.), accept and return OK
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
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      if (hasMetadata) data.metadata = metadata;
      await prisma.propertyViewEvent.create({ data });
      await prisma.property.update({
        where: { id: sanitizedPropertyId },
        data: { views: { increment: 1 } },
      });
    } else if (eventType === 'booking' || eventType === 'booking_request') {
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      if (typeof bookingId === 'string' && bookingId.trim().length > 0) data.bookingId = bookingId.trim();
      if (hasMetadata) data.metadata = metadata;
      await prisma.bookingEvent.create({ data });
    } else if (eventType === 'inquiry') {
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      if (typeof inquiryId === 'string' && inquiryId.trim().length > 0) data.inquiryId = inquiryId.trim();
      if (hasMetadata) data.metadata = metadata;
      await prisma.inquiryEvent.create({ data });
    } else if (eventType === 'phone_contact' || eventType === 'email_contact' || 
               eventType === 'property_card_contact' || eventType === 'favorites_property_contact') {
      // Track contact events as inquiry events for now
      const meta = {
        ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
        contactType: eventType,
        timestamp: new Date().toISOString(),
      };
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId, metadata: meta };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      await prisma.inquiryEvent.create({ data });
    } else if (eventType === 'property_shared') {
      // Track share events as view events with metadata
      const meta = {
        ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
        action: 'shared',
        timestamp: new Date().toISOString(),
      };
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId, metadata: meta };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      await prisma.propertyViewEvent.create({ data });
    } else if (eventType === 'favorite_added' || eventType === 'favorite_removed') {
      // Track favorite events as view events with metadata
      const meta = {
        ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
        action: eventType,
        timestamp: new Date().toISOString(),
      };
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId, metadata: meta };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      await prisma.propertyViewEvent.create({ data });
    } else if (eventType === 'review_submitted') {
      // Track review events as inquiry events with metadata
      const meta = {
        ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
        action: 'review_submitted',
        timestamp: new Date().toISOString(),
      };
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId, metadata: meta };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      await prisma.inquiryEvent.create({ data });
    } else {
      // For any other event type, track as a view event with metadata
      const meta = {
        ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
        action: eventType,
        timestamp: new Date().toISOString(),
      };
      const data: Record<string, unknown> = { propertyId: sanitizedPropertyId, metadata: meta };
      if (typeof sessionUserId === 'string') data.userId = sessionUserId;
      await prisma.propertyViewEvent.create({ data });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
} 