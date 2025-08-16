import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Global stats
    const [totalUsers, totalProperties, totalBookings, totalRevenue, totalInquiries, totalReviews] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { amount: true } }),
      prisma.inquiry.count(),
      prisma.review.count(),
    ]);

    // Time series for last 30 days
    const period = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // Views per day
    const viewEvents = await prisma.propertyViewEvent.findMany({
      where: { timestamp: { gte: startDate } },
      select: { timestamp: true },
    });
    const viewsByDay: Record<string, number> = {};
    viewEvents.forEach(e => {
      const day = e.timestamp.toISOString().slice(0, 10);
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });

    // Bookings per day
    const bookingEvents = await prisma.bookingEvent.findMany({
      where: { timestamp: { gte: startDate } },
      select: { timestamp: true },
    });
    const bookingsByDay: Record<string, number> = {};
    bookingEvents.forEach(e => {
      const day = e.timestamp.toISOString().slice(0, 10);
      bookingsByDay[day] = (bookingsByDay[day] || 0) + 1;
    });

    // Inquiries per day
    const inquiryEvents = await prisma.inquiryEvent.findMany({
      where: { timestamp: { gte: startDate } },
      select: { timestamp: true },
    });
    const inquiriesByDay: Record<string, number> = {};
    inquiryEvents.forEach(e => {
      const day = e.timestamp.toISOString().slice(0, 10);
      inquiriesByDay[day] = (inquiriesByDay[day] || 0) + 1;
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalInquiries,
        totalReviews,
      },
      timeSeries: {
        viewsByDay,
        bookingsByDay,
        inquiriesByDay,
      },
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch admin analytics' }, { status: 500 });
  }
}


