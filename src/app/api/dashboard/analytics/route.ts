import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a landlord
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'LANDLORD') {
      return NextResponse.json(
        { error: 'Access denied. Landlord role required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get all properties owned by the user
    const properties = await prisma.property.findMany({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    const propertyIds = properties.map(p => p.id)

    // Get property statistics
    const [propertyStats, bookingStats, inquiryStats, reviewStats, earningsStats] = await Promise.all([
      // Property statistics
      prisma.property.groupBy({
        by: ['status'],
        where: { ownerId: session.user.id },
        _count: { id: true },
      }),

      // Booking statistics
      prisma.booking.groupBy({
        by: ['status'],
        where: {
          propertyId: { in: propertyIds },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        _sum: { amount: true },
      }),

      // Inquiry statistics
      prisma.inquiry.groupBy({
        by: ['status'],
        where: {
          propertyId: { in: propertyIds },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
      }),

      // Review statistics
      prisma.review.aggregate({
        where: {
          propertyId: { in: propertyIds },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        _avg: { rating: true },
      }),

      // Earnings statistics
      prisma.booking.aggregate({
        where: {
          propertyId: { in: propertyIds },
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ])

    // Get recent activity
    const recentActivity = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Get top performing properties
    const topProperties = await prisma.property.findMany({
      where: { ownerId: session.user.id },
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        views: true,
        rating: true,
        _count: {
          select: {
            bookings: true,
            inquiries: true,
            reviews: true,
          },
        },
      },
      orderBy: { views: 'desc' },
      take: 5,
    })

    // Calculate total earnings
    const totalEarnings = earningsStats._sum.amount || 0
    const totalBookings = earningsStats._count || 0

    // Format property stats
    const propertyStatusStats = propertyStats.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.id
      return acc
    }, {} as Record<string, number>)

    // Format booking stats
    const bookingStatusStats = bookingStats.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = {
        count: stat._count.id,
        amount: stat._sum.amount || 0,
      }
      return acc
    }, {} as Record<string, { count: number; amount: number }>)

    // Format inquiry stats
    const inquiryStatusStats = inquiryStats.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.id
      return acc
    }, {} as Record<string, number>)

    // Time series analytics for views, bookings, inquiries
    const timeSeriesPeriod = parseInt(period);
    const timeSeriesStart = new Date();
    timeSeriesStart.setDate(timeSeriesStart.getDate() - timeSeriesPeriod);

    // Views per day
    const viewEvents = await prisma.propertyViewEvent.findMany({
      where: {
        propertyId: { in: propertyIds },
        timestamp: { gte: timeSeriesStart },
      },
      select: { timestamp: true },
    });
    const viewsByDay: Record<string, number> = {};
    viewEvents.forEach(e => {
      const day = e.timestamp.toISOString().slice(0, 10);
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });

    // Bookings per day
    const bookingEvents = await prisma.bookingEvent.findMany({
      where: {
        propertyId: { in: propertyIds },
        timestamp: { gte: timeSeriesStart },
      },
      select: { timestamp: true },
    });
    const bookingsByDay: Record<string, number> = {};
    bookingEvents.forEach(e => {
      const day = e.timestamp.toISOString().slice(0, 10);
      bookingsByDay[day] = (bookingsByDay[day] || 0) + 1;
    });

    // Inquiries per day
    const inquiryEvents = await prisma.inquiryEvent.findMany({
      where: {
        propertyId: { in: propertyIds },
        timestamp: { gte: timeSeriesStart },
      },
      select: { timestamp: true },
    });
    const inquiriesByDay: Record<string, number> = {};
    inquiryEvents.forEach(e => {
      const day = e.timestamp.toISOString().slice(0, 10);
      inquiriesByDay[day] = (inquiriesByDay[day] || 0) + 1;
    });

    return NextResponse.json({
      overview: {
        totalProperties: properties.length,
        totalEarnings,
        totalBookings,
        averageRating: reviewStats._avg.rating || 0,
        totalReviews: reviewStats._count.id || 0,
      },
      propertyStats: propertyStatusStats,
      bookingStats: bookingStatusStats,
      inquiryStats: inquiryStatusStats,
      recentActivity,
      topProperties,
      period: parseInt(period),
      timeSeries: {
        viewsByDay,
        bookingsByDay,
        inquiriesByDay,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    )
  }
} 