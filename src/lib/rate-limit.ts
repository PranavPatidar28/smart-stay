import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number;        // Time window in milliseconds
  max: number;             // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Skip rate limiting for successful requests
  skipFailedRequests?: boolean;     // Skip rate limiting for failed requests
}

export function createRateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    keyGenerator = (req) => req.ip || 'anonymous',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return function rateLimitMiddleware(req: NextRequest) {
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

// Clean up expired entries periodically (every 5 minutes)
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

// Get client IP from request
function getClientIP(req: NextRequest): string {
  // Check for forwarded headers (common in production)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Check for real IP header
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection remote address
  return req.ip || 'unknown';
}

// Predefined rate limiters
export const otpRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 OTP requests per 15 minutes per email/IP
  keyGenerator: (req) => {
    // Try to get email from request body for more specific rate limiting
    try {
      // For POST requests, we'll rate limit by IP since body isn't available here
      // The actual email-based rate limiting will be done in the route handler
      return getClientIP(req);
    } catch {
      return getClientIP(req);
    }
  },
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 auth attempts per 15 minutes per IP
  keyGenerator: (req) => getClientIP(req),
});

export const generalRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Maximum 100 requests per minute per IP
  keyGenerator: (req) => getClientIP(req),
});

// Email-specific rate limiting for OTP
export const emailOTPRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 OTP requests per 15 minutes per email
  keyGenerator: (req) => {
    // This will be used with a custom key generator that extracts email from body
    return 'email-specific';
  },
});
