import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting.
//
// IMPORTANT (serverless): on Vercel/serverless this Map is per-instance and
// resets on cold start, so limits are best-effort and NOT shared across
// instances. For robust, durable limits in production, back these limiters
// with a shared atomic store (Upstash Redis / Vercel KV: INCR + EXPIRE).
// The interface below is intentionally small so it can be swapped.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number;        // Time window in milliseconds
  max: number;             // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

export function createRateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    keyGenerator = (req) => getClientIP(req),
  } = options;

  return function rateLimitMiddleware(req: NextRequest): NextResponse | null {
    const key = keyGenerator(req);
    const now = Date.now();

    // Get current rate limit data
    const current = rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // Allow request
    }

    if (current.count >= max) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(current.resetTime).toISOString(),
          },
        }
      );
    }

    // Increment counter
    current.count++;
    rateLimitStore.set(key, current);

    return null; // Allow request
  };
}

// Clean up expired entries periodically (every 5 minutes).
// Note: on serverless this timer is not guaranteed to run; entries also expire
// lazily on access (see the `now > current.resetTime` check above).
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Derive the client IP from request headers.
 *
 * NextRequest.ip was removed in Next.js 15, so we read forwarding headers.
 * `x-forwarded-for` is a client-controllable header; an attacker can spoof the
 * left-most entries. When the app runs behind a trusted proxy/CDN (e.g. Vercel),
 * the proxy appends the real client IP as the RIGHT-most entry, so we take the
 * last value rather than the first. If you run behind N proxies, pick the
 * (N+1)-th from the right instead.
 */
function getClientIP(req: NextRequest): string {
  // Vercel sets this to the real client IP and is not forgeable by the client.
  const vercelIP = req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-real-ip');
  if (vercelIP) {
    return vercelIP.trim();
  }

  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      // Take the right-most (closest to our trusted proxy) entry.
      return parts[parts.length - 1];
    }
  }

  return 'unknown';
}

// Predefined rate limiters
export const otpRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 OTP requests per 15 minutes per IP
  keyGenerator: (req) => `otp:${getClientIP(req)}`,
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 auth attempts per 15 minutes per IP
  keyGenerator: (req) => `auth:${getClientIP(req)}`,
});

export const generalRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Maximum 100 requests per minute per IP
  keyGenerator: (req) => `general:${getClientIP(req)}`,
});
