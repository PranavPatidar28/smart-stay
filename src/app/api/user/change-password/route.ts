import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/password'
import { z } from 'zod'
import { getSession } from '@/lib/auth-server'
import { authRateLimit } from '@/lib/rate-limit'
import { isSameOrigin } from '@/lib/csrf'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export async function POST(request: NextRequest) {
  // Reject cross-origin state-changing requests (CSRF defense-in-depth).
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  // Apply rate limiting
  const rateLimitResult = authRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Passwords are stored on the better-auth credential Account, not on User.
    const account = await prisma.account.findFirst({
      where: { userId: session.user.id, providerId: 'credential' },
      select: { id: true, password: true },
    })

    if (!account || !account.password) {
      return NextResponse.json(
        { error: 'No password is set for this account' },
        { status: 400 }
      )
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(validatedData.currentPassword, account.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(validatedData.newPassword)

    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}