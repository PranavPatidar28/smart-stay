import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["STUDENT", "LANDLORD"]).optional(),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    console.log("Registration request body:", JSON.stringify(body, null, 2));
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password, phone, role } = validationResult.data;
    console.log("Validated data:", { name, email, phone, role });
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      console.log("User already exists with email:", email);
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log("Password hashed successfully");
    
    // Create user
    console.log("Creating user with data:", { name, email, phone, role });
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        verified: false,
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
    
    console.log("User created successfully:", user.id);
    return NextResponse.json({ 
      message: "User registered successfully",
      user
    }, { status: 201 });
    
  } catch (error) {
    console.error("Registration error:", error);
    
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
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
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