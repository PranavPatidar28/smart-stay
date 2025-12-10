import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isValidRole } from "@/types/role";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    // Type-safe validation - only STUDENT and LANDLORD are valid
    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT or LANDLORD." },
        { status: 400 }
      );
    }

    // Use Better Auth's updateUser API to update role
    // This properly updates the session/cookie cache
    const updatedUser = await auth.api.updateUser({
      headers: await headers(),
      body: {
        role: role,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}