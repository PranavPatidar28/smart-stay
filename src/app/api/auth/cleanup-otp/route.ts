import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

// GET endpoint to view OTP statistics
export async function GET() {
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
