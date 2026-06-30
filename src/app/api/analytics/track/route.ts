import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { generalRateLimit } from '@/lib/rate-limit';

const trackSchema = z.object({
  eventType: z.string().min(1).max(64),
  propertyId: z.string().min(1).max(64).optional(),
  bookingId: z.string().min(1).max(64).optional(),
  inquiryId: z.string().min(1).max(64).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  // This endpoint is intentionally open to anonymous callers (view/contact
  // analytics), so rate-limit by IP to bound row-spam and view-count inflation.
  const rateLimitResult = generalRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const parsed = trackSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
    }
    const { eventType, propertyId, metadata, bookingId, inquiryId } = parsed.data;

    // The acting user is derived from the session, never from the request body,
    // so analytics trails cannot be spoofed onto other users. Anonymous events
    // are allowed (userId stays null).
    const session = await getSession();
    const sessionUserId: string | null = session?.user?.id ?? null;
    const hasMetadata = metadata !== undefined && metadata !== null && typeof metadata === 'object';

    // For events that don't require a propertyId (search/filter/sort/view-mode etc.), accept and return OK
    if (!propertyId) {
      return NextResponse.json({ success: true });
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

    const userIdField = sessionUserId ? { userId: sessionUserId } : {};
    const metaValue = hasMetadata ? (metadata as Prisma.InputJsonValue) : undefined;

    // Handle different event types
    if (eventType === 'property_view') {
      await prisma.propertyViewEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          ...(metaValue !== undefined ? { metadata: metaValue } : {}),
        },
      });
      await prisma.property.update({
        where: { id: sanitizedPropertyId },
        data: { views: { increment: 1 } },
      });
    } else if (eventType === 'booking' || eventType === 'booking_request') {
      await prisma.bookingEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          ...(bookingId && bookingId.trim().length > 0 ? { bookingId: bookingId.trim() } : {}),
          ...(metaValue !== undefined ? { metadata: metaValue } : {}),
        },
      });
    } else if (eventType === 'inquiry') {
      await prisma.inquiryEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          ...(inquiryId && inquiryId.trim().length > 0 ? { inquiryId: inquiryId.trim() } : {}),
          ...(metaValue !== undefined ? { metadata: metaValue } : {}),
        },
      });
    } else if (eventType === 'phone_contact' || eventType === 'email_contact' ||
               eventType === 'property_card_contact' || eventType === 'favorites_property_contact') {
      await prisma.inquiryEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          metadata: {
            ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
            contactType: eventType,
          } as Prisma.InputJsonValue,
        },
      });
    } else if (eventType === 'property_shared') {
      await prisma.propertyViewEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          metadata: {
            ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
            action: 'shared',
          } as Prisma.InputJsonValue,
        },
      });
    } else if (eventType === 'favorite_added' || eventType === 'favorite_removed') {
      await prisma.propertyViewEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          metadata: {
            ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
            action: eventType,
          } as Prisma.InputJsonValue,
        },
      });
    } else if (eventType === 'review_submitted') {
      await prisma.inquiryEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          metadata: {
            ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
            action: 'review_submitted',
          } as Prisma.InputJsonValue,
        },
      });
    } else {
      await prisma.propertyViewEvent.create({
        data: {
          propertyId: sanitizedPropertyId,
          ...userIdField,
          metadata: {
            ...(hasMetadata ? (metadata as Record<string, unknown>) : {}),
            action: eventType,
          } as Prisma.InputJsonValue,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
} 