import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// CSRF token store (in production, use Redis or database)
const csrfTokenStore = new Map<string, { token: string; expiresAt: number }>();

// Configuration
const CSRF_CONFIG = {
  tokenLength: 32, // 32 bytes = 64 hex characters
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  headerName: 'x-csrf-token',
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    path: '/',
  },
};

/**
 * Generate a cryptographically secure CSRF token using Web Crypto API
 */
export async function generateCSRFToken(): Promise<string> {
  const array = new Uint8Array(CSRF_CONFIG.tokenLength);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a CSRF token and store it with expiration
 */
export async function createCSRFToken(sessionId: string): Promise<string> {
  const token = await generateCSRFToken();
  const expiresAt = Date.now() + CSRF_CONFIG.tokenExpiry;
  
  csrfTokenStore.set(sessionId, { token, expiresAt });
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return token;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokenStore.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  if (Date.now() > stored.expiresAt) {
    csrfTokenStore.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

/**
 * Clean up expired CSRF tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokenStore.entries()) {
    if (now > data.expiresAt) {
      csrfTokenStore.delete(sessionId);
    }
  }
}

/**
 * Create HMAC using Web Crypto API
 */
async function createHMAC(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get CSRF token for a session
 */
export async function getCSRFToken(request: NextRequest): Promise<string | null> {
  try {
    // Try to get session from cookies
    const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                        request.cookies.get('__Secure-next-auth.session-token')?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    // For now, use session token as session ID
    // In production, you might want to decode the JWT to get user ID
    const sessionId = await createHMAC('csrf-salt', sessionToken);
    
    let stored = csrfTokenStore.get(sessionId);
    
    if (!stored || Date.now() > stored.expiresAt) {
      const token = await createCSRFToken(sessionId);
      return token;
    }
    
    return stored.token;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return null;
  }
}

/**
 * CSRF middleware for API routes
 */
export async function csrfProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Skip CSRF for GET requests and public endpoints
  if (request.method === 'GET') {
    return handler(request);
  }
  
  // Skip CSRF for NextAuth endpoints (they have their own protection)
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return handler(request);
  }
  
  // Skip CSRF for webhook endpoints (they use different authentication)
  if (request.nextUrl.pathname.startsWith('/api/webhooks/')) {
    return handler(request);
  }
  
  try {
    // Get CSRF token from header
    const csrfToken = request.headers.get(CSRF_CONFIG.headerName);
    
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing', message: 'CSRF token is required for this request' },
        { status: 403 }
      );
    }
    
    // Get stored CSRF token
    const storedToken = await getCSRFToken(request);
    
    if (!storedToken) {
      return NextResponse.json(
        { error: 'CSRF token invalid', message: 'Invalid or expired CSRF token' },
        { status: 403 }
      );
    }
    
    // Validate token
    if (csrfToken !== storedToken) {
      return NextResponse.json(
        { error: 'CSRF token mismatch', message: 'CSRF token validation failed' },
        { status: 403 }
      );
    }
    
    // Token is valid, proceed with request
    return handler(request);
  } catch (error) {
    console.error('CSRF validation error:', error);
    return NextResponse.json(
      { error: 'CSRF validation failed', message: 'Internal server error during CSRF validation' },
      { status: 500 }
    );
  }
}

/**
 * Generate CSRF token for forms
 */
export async function generateFormCSRFToken(request: NextRequest): Promise<{
  token: string;
  cookie: string;
}> {
  const token = await getCSRFToken(request);
  
  if (!token) {
    throw new Error('Failed to generate CSRF token');
  }
  
  // Create cookie string
  const cookie = `${CSRF_CONFIG.cookieName}=${token}; HttpOnly; Secure=${CSRF_CONFIG.cookieOptions.secure}; SameSite=${CSRF_CONFIG.cookieOptions.sameSite}; Max-Age=${CSRF_CONFIG.cookieOptions.maxAge}; Path=${CSRF_CONFIG.cookieOptions.path}`;
  
  return { token, cookie };
}

/**
 * Set CSRF token in response headers
 */
export function setCSRFHeaders(response: NextResponse, token: string): NextResponse {
  response.headers.set('X-CSRF-Token', token);
  return response;
}

/**
 * CSRF protection decorator for API routes
 */
export function withCSRFProtection<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    return csrfProtection(request, async (req) => handler(req, ...args));
  };
}

// Clean up expired tokens every hour
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
}
