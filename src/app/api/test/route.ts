import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const propertyCount = await prisma.property.count()
    
    return NextResponse.json({
      message: 'Backend is working!',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      propertyCount
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    )
  }
} 