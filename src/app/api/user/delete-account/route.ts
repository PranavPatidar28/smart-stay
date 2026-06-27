import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth-server'
import { verifyPassword } from '@/lib/password'
import { authRateLimit } from '@/lib/rate-limit'
import { isSameOrigin } from '@/lib/csrf'

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
    const { password, confirm } = body

    // Get the user and their credential account (passwords live on Account).
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const account = await prisma.account.findFirst({
      where: { userId: session.user.id, providerId: 'credential' },
      select: { password: true },
    })

    if (account?.password) {
      // Password-based account: require correct current password.
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        )
      }

      const isPasswordValid = await verifyPassword(password, account.password)

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Password is incorrect' },
          { status: 400 }
        )
      }
    } else {
      // Social-login account with no password: require an explicit typed
      // confirmation so account deletion is never a single unconfirmed click.
      if (confirm !== 'DELETE') {
        return NextResponse.json(
          { error: 'Please confirm account deletion by sending confirm: "DELETE"' },
          { status: 400 }
        )
      }
    }

    // Delete user and all related data (will cascade delete because of schema relations)
    await prisma.user.delete({
      where: { id: user.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}