import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { isValidRole } from "@/types/role";
import { isSameOrigin } from "@/lib/csrf";
import { authRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Bound abuse of the role-change endpoint.
  const rateLimitResult = authRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // Reject cross-origin requests (defense-in-depth on top of SameSite cookies).
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    // Only STUDENT and LANDLORD are user-selectable. ADMIN is never assignable
    // through this self-service endpoint.
    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT or LANDLORD." },
        { status: 400 }
      );
    }

    // Update the role directly via Prisma. The `role` field is `input: false`
    // in the Better Auth config, so auth.api.updateUser would ignore it; with
    // cookieCache disabled the new role is read from the DB on the next request.
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
