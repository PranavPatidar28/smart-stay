import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, generateOTPEmail } from '@/lib/email';
import { otpRateLimit, createRateLimit } from '@/lib/rate-limit';

const sendOtpSchema = z.object({
  email: z.string().email().max(200),
});

// Uniform response used for both "OTP sent" and "email already registered" so
// the endpoint cannot be used to enumerate which emails have accounts. Returns
// a fresh response each call — a Response body is a one-shot stream.
const neutralOk = () =>
  NextResponse.json(
    { message: 'If this email can be registered, an OTP has been sent.' },
    { status: 200 }
  );

export async function POST(request: NextRequest) {
  // Apply IP-based rate limiting first
  const ipRateLimitResult = otpRateLimit(request);
  if (ipRateLimitResult) {
    return ipRateLimitResult;
  }

  try {
    // Validate format BEFORE any DB write so a malformed address returns 400
    // instead of failing later at the email-send step with a 500.
    const parsed = sendOtpSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'A valid email is required' },
        { status: 400 }
      );
    }
    const email = parsed.data.email.toLowerCase().trim();

    // Apply email-specific rate limiting
    const emailRateLimiter = createRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // Maximum 3 OTP requests per 15 minutes per email
      keyGenerator: () => email,
    });

    const emailRateLimitResult = emailRateLimiter(request);
    if (emailRateLimitResult) {
      return emailRateLimitResult;
    }

    // If the email is already registered, return the SAME neutral response
    // without sending an OTP. Registration itself still rejects duplicates, so
    // this leaks nothing while closing the account-enumeration oracle.
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return neutralOk();
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

    // Generate a cryptographically secure 6-digit OTP
    const otp = randomInt(100000, 1000000).toString();

    // Store OTP in database with expiration (15 minutes)
    await prisma.otpVerification.upsert({
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

      // Remove the just-written OTP so the active-OTP guard above does not
      // strand the user for 15 minutes when delivery fails — they can retry
      // immediately. Do NOT log the OTP; it is an active auth secret.
      await prisma.otpVerification
        .deleteMany({ where: { email, used: false } })
        .catch(() => {});

      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return neutralOk();
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
