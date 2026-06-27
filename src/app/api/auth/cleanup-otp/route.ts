import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Constant-time comparison of the provided cron secret against the configured one.
 * Both methods on this route are guarded so the endpoint cannot be triggered
 * by anonymous callers (it performs destructive deleteMany operations and
 * discloses OTP table statistics).
 */
function isAuthorized(request: NextRequest): boolean {
  const configured = process.env.CRON_SECRET;
  if (!configured) {
    // Fail closed: if no secret is configured, the endpoint is disabled.
    return false;
  }
  const provided =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';

  // Constant-time compare to avoid timing leaks.
  if (provided.length !== configured.length) return false;
  let mismatch = 0;
  for (let i = 0; i < configured.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ configured.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Clean up expired OTPs (older than 15 minutes)
    const expiredOTPs = await prisma.otpVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(Date.now() - 15 * 60 * 1000), // Older than 15 minutes
        },
      },
    });

    // Clean up used OTPs older than 24 hours
    const usedOTPs = await prisma.otpVerification.deleteMany({
      where: {
        used: true,
        usedAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24 hours
        },
      },
    });

    return NextResponse.json({
      message: 'OTP cleanup completed successfully',
      deleted: {
        expired: expiredOTPs.count,
        used: usedOTPs.count,
        total: expiredOTPs.count + usedOTPs.count,
      },
    });
  } catch (error) {
    console.error('Error cleaning up OTPs:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup OTPs' },
      { status: 500 }
    );
  }
}

// GET endpoint to view OTP statistics (also guarded by the cron secret).
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await prisma.$transaction([
      prisma.otpVerification.count({
        where: { used: false },
      }),
      prisma.otpVerification.count({
        where: { used: true },
      }),
      prisma.otpVerification.count({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      }),
    ]);

    return NextResponse.json({
      active: stats[0], // Unused, not expired
      used: stats[1],   // Used OTPs
      expired: stats[2], // Expired OTPs
      total: stats[0] + stats[1] + stats[2],
    });
  } catch (error) {
    console.error('Error getting OTP stats:', error);
    return NextResponse.json(
      { error: 'Failed to get OTP statistics' },
      { status: 500 }
    );
  }
}
