// Analytics event tracking — the only part of this module that is actually
// used (imported by the listings, favorites, and owner-dashboard pages). The
// former ApiClient class and its typed wrappers were dead code (never imported)
// and were removed; pages call the real /api routes via fetch directly.

export type AnalyticsEventType =
  | 'property_view'
  | 'booking_request'
  | 'inquiry'
  | 'phone_contact'
  | 'email_contact'
  | 'property_card_contact'
  | 'favorites_property_contact'
  | 'favorite_added'
  | 'favorite_removed'
  | 'property_shared'
  | 'review_submitted'
  | 'search'
  | 'search_performed'
  | 'filter_changed'
  | 'filter_applied'
  | 'filters_cleared'
  | 'quick_filter_applied'
  | 'sort_changed'
  | 'sort_applied'
  | 'view_mode_changed';

export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  propertyId?: string,
  options: Record<string, unknown> = {}
): Promise<void> {
  try {
    if (!eventType || typeof eventType !== 'string') {
      return;
    }

    const sanitizedPropertyId = typeof propertyId === 'string' && propertyId.trim().length > 0
      ? propertyId.trim()
      : undefined;

    // Split known top-level fields from generic metadata
    const { bookingId, inquiryId, ...metadata } = options || {};

    const payload: Record<string, unknown> = {
      eventType,
      ...(sanitizedPropertyId ? { propertyId: sanitizedPropertyId } : {}),
      ...(bookingId ? { bookingId } : {}),
      ...(inquiryId ? { inquiryId } : {}),
      ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
    };

    const json = JSON.stringify(payload);

    // Prefer sendBeacon for non-blocking delivery
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        const blob = new Blob([json], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/analytics/track', blob);
        if (sent) return;
        // If sendBeacon returns false, fall back to fetch below
      } catch {
        // fall through to fetch
      }
    }

    // Fallback: fire-and-forget fetch with keepalive
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => { });
  } catch {
    // Swallow errors — analytics should never block user flows
  }
}
