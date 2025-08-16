import { NextRequest, NextResponse } from 'next/server';
import { getCSRFToken } from '@/lib/csrf';

/**
 * CSRF middleware for automatic token injection
 * This middleware runs after authentication and adds CSRF tokens to responses
 */
export async function csrfMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  try {
    // Only add CSRF tokens for authenticated users
    const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                        request.cookies.get('__Secure-next-auth.session-token')?.value;
    
    if (!sessionToken) {
      return response;
    }

    // Get CSRF token for the session
    const csrfToken = await getCSRFToken(request);
    
    if (csrfToken) {
      // Add CSRF token to response headers
      response.headers.set('X-CSRF-Token', csrfToken);
      
      // Add CSRF token to cookies for client-side access
      response.cookies.set('csrf-token', csrfToken, {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });
    }
  } catch (error) {
    // Log error but don't fail the request
    console.error('CSRF middleware error:', error);
  }

  return response;
}
