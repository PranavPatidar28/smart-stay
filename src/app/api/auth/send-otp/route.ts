import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, generateOTPEmail } from '@/lib/email';
import { otpRateLimit, createRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply IP-based rate limiting first
  const ipRateLimitResult = otpRateLimit(request);
  if (ipRateLimitResult) {
    return ipRateLimitResult;
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Apply email-specific rate limiting
    const emailRateLimiter = createRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // Maximum 3 OTP requests per 15 minutes per email
      keyGenerator: () => email.toLowerCase().trim(),
    });

    const emailRateLimitResult = emailRateLimiter(request);
    if (emailRateLimitResult) {
      return emailRateLimitResult;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if there's an unused OTP that hasn't expired
    const existingUnusedOTP = await prisma.otpVerification.findFirst({
      where: {
        email,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingUnusedOTP) {
      const timeRemaining = Math.ceil((existingUnusedOTP.expiresAt.getTime() - Date.now()) / 1000);
      return NextResponse.json(
        { 
          error: 'An active OTP already exists for this email',
          message: `Please wait ${timeRemaining} seconds before requesting a new OTP, or use the existing OTP if you still have it.`
        },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiration (15 minutes)
    const otpRecord = await prisma.otpVerification.upsert({
      where: { email },
      update: {
        otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        used: false, // Reset used status for new OTP
        usedAt: null, // Clear used timestamp
      },
      create: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      },
    });

    // Send OTP email
    try {
      const emailData = generateOTPEmail(email, otp);
      await sendEmail(emailData);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Still log OTP for development purposes
      console.log(`OTP for ${email}: ${otp}`);
      
      // Return error if email fails
      return NextResponse.json(
        { error: 'OTP generated but failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
