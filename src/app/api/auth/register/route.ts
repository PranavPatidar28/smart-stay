import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { authRateLimit } from "@/lib/rate-limit";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["STUDENT", "LANDLORD"]).optional(),
  otp: z.string().min(6, "OTP is required").max(6, "OTP must be 6 digits"),
});

export async function POST(request: Request) {
  // Apply rate limiting
  const rateLimitResult = authRateLimit(request as any);
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

    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again" },
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
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        verified: true, // Mark as verified since OTP was verified
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

    // Mark OTP as used instead of deleting it
    await prisma.otpVerification.update({
      where: { email },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });
    
    return NextResponse.json({ 
      message: "User registered successfully",
      user
    }, { status: 201 });
    
  } catch (error) {
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Handle other errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Registration failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 