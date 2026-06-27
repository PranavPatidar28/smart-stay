import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Prisma } from "@prisma/client";
import { authRateLimit } from "@/lib/rate-limit";

const MAX_OTP_ATTEMPTS = 5;

// Constant-time string comparison that doesn't leak length-independent timing.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(200),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  phone: z.string().max(20).optional(),
  role: z.enum(["STUDENT", "LANDLORD"]).optional(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: Request) {
  // Apply rate limiting
  const rateLimitResult = authRateLimit(request as unknown as import("next/server").NextRequest);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role, otp } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Verify OTP
    const otpRecord = await prisma.otpVerification.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "OTP not found. Please request a new OTP" },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new OTP" },
        { status: 400 }
      );
    }

    if (otpRecord.used) {
      return NextResponse.json(
        { error: "OTP has already been used. Please request a new OTP" },
        { status: 400 }
      );
    }

    // Bound brute-force attempts against the 6-digit space.
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP" },
        { status: 429 }
      );
    }

    // Constant-time comparison to avoid timing side-channels.
    if (!safeEqual(otpRecord.otp, otp)) {
      await prisma.otpVerification.update({
        where: { email },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and credential account, and mark the OTP used, atomically.
    // Passwords are stored on the Account model (better-auth credential
    // provider), NOT on User — mirroring how better-auth and the seed expect it.
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          phone,
          role,
          verified: true, // Mark as verified since OTP was verified
          emailVerified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          verified: true,
          createdAt: true,
        },
      });

      await tx.account.create({
        data: {
          userId: createdUser.id,
          accountId: createdUser.id,
          providerId: 'credential',
          password: hashedPassword,
        },
      });

      await tx.otpVerification.update({
        where: { email },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });

      return createdUser;
    });

    return NextResponse.json({
      message: "User registered successfully",
      user
    }, { status: 201 });

  } catch (error) {
    // Log full detail server-side; return a generic message to the client so
    // we don't leak Prisma schema/constraint internals.
    console.error("Registration error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 