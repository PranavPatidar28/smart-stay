import { NextRequest, NextResponse } from 'next/server';
import { getCSRFToken, setCSRFHeaders } from '@/lib/csrf';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required for CSRF token' },
        { status: 401 }
      );
    }

    // Generate CSRF token
    const token = await getCSRFToken(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token generation failed', message: 'Failed to generate CSRF token' },
        { status: 500 }
      );
    }

    // Create response with token
    const response = NextResponse.json({
      token,
      message: 'CSRF token generated successfully',
      expiresIn: '24 hours',
    });

    // Set CSRF token in response headers
    setCSRFHeaders(response, token);

    // Set CSRF token as HttpOnly cookie for additional security
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Refresh CSRF token
  return GET(request);
}
