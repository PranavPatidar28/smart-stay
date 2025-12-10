import { PrismaClient, UserRole, PropertyType, PropertyStatus, BookingStatus, InquiryStatus, NotificationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (including Better Auth tables)
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.propertyAmenity.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.amenity.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create amenities
  const amenities = [
    // Basic Amenities
    { name: 'WiFi', category: 'Internet', icon: 'wifi' },
    { name: 'Kitchen', category: 'Kitchen', icon: 'utensils' },
    { name: 'Laundry', category: 'Laundry', icon: 'washing-machine' },
    { name: 'AC', category: 'Climate', icon: 'snowflake' },
    { name: 'Heating', category: 'Climate', icon: 'thermometer' },

    // Security
    { name: 'Security System', category: 'Security', icon: 'shield' },
    { name: 'CCTV', category: 'Security', icon: 'video' },
    { name: 'Gated Community', category: 'Security', icon: 'lock' },

    // Parking & Transport
    { name: 'Parking', category: 'Transport', icon: 'car' },
    { name: 'Bike Storage', category: 'Transport', icon: 'bike' },
    { name: 'Near Bus Stop', category: 'Transport', icon: 'bus' },
    { name: 'Near Metro', category: 'Transport', icon: 'train' },

    // Recreation
    { name: 'Gym', category: 'Recreation', icon: 'dumbbell' },
    { name: 'Pool', category: 'Recreation', icon: 'swimming' },
    { name: 'Garden', category: 'Recreation', icon: 'tree' },
    { name: 'Study Room', category: 'Recreation', icon: 'book-open' },
    { name: 'Common Room', category: 'Recreation', icon: 'users' },

    // Additional Features
    { name: 'Furnished', category: 'Furniture', icon: 'sofa' },
    { name: 'Pet Friendly', category: 'Pets', icon: 'paw' },
    { name: 'Balcony', category: 'Outdoor', icon: 'sun' },
    { name: 'Elevator', category: 'Accessibility', icon: 'arrow-up' },
    { name: '24/7 Support', category: 'Support', icon: 'phone' },
    { name: 'Housekeeping', category: 'Services', icon: 'sparkles' },
    { name: 'Utilities Included', category: 'Utilities', icon: 'zap' },
  ]

  const createdAmenities = await Promise.all(
    amenities.map(amenity =>
      prisma.amenity.create({ data: amenity })
    )
  )

  console.log(`✅ Created ${createdAmenities.length} amenities`)

  // Create users with Better Auth Account model for passwords
  const hashedPassword = await bcrypt.hash('password123', 12)

  const users = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+91-9876543210',
      role: UserRole.LANDLORD,
      verified: true,
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      phone: '+91-9876543211',
      role: UserRole.LANDLORD,
      verified: true,
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      phone: '+91-9876543212',
      role: UserRole.LANDLORD,
      verified: false,
      emailVerified: false,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Alex Kumar',
      email: 'alex.kumar@example.com',
      phone: '+91-9876543213',
      role: UserRole.STUDENT,
      verified: true,
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91-9876543214',
      role: UserRole.STUDENT,
      verified: true,
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Rahul Singh',
      email: 'rahul.singh@example.com',
      phone: '+91-9876543215',
      role: UserRole.STUDENT,
      verified: false,
      emailVerified: false,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Rajesh Patel',
      email: 'rajesh.patel@example.com',
      phone: '+91-9876543216',
      role: UserRole.LANDLORD,
      verified: true,
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Meera Reddy',
      email: 'meera.reddy@example.com',
      phone: '+91-9876543217',
      role: UserRole.LANDLORD,
      verified: true,
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
  ]

  // Create users and their accounts (Better Auth stores passwords in Account)
  const createdUsers = await Promise.all(
    users.map(async (user) => {
      const createdUser = await prisma.user.create({ data: user })

      // Create credential account for the user (Better Auth pattern)
      await prisma.account.create({
        data: {
          userId: createdUser.id,
          accountId: createdUser.id,
          providerId: 'credential',
          password: hashedPassword,
        }
      })

      return createdUser
    })
  )

  console.log(`✅ Created ${createdUsers.length} users with accounts`)

  // Create properties
  const properties = [
    {
      title: 'Modern Student Apartment Near Campus',
      description: 'Beautiful, fully furnished apartment perfect for students. Located just 5 minutes from the university campus with excellent amenities and modern facilities.',
      location: 'Near University Campus, Bangalore',
      price: 25000,
      deposit: 50000,
      type: PropertyType.APARTMENT,
      status: PropertyStatus.ACTIVE,
      bedrooms: 2,
      bathrooms: 1,
      availableFrom: new Date('2024-02-01'),
      virtualTourUrl: 'https://example.com/virtual-tour-1',
      seoKeywords: 'student apartment, near campus, furnished, modern',
      contactPhone: '+91-9876543210',
      contactEmail: 'sarah.johnson@example.com',
      utilities: true,
      petFriendly: false,
      furnished: true,
      parking: true,
      ownerId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'Laundry', 'Gym', 'Study Room', 'Security System', 'Parking']
    },
    {
      title: 'Cozy Studio Room in Downtown',
      description: 'Perfect studio apartment for students who prefer privacy. Fully furnished with modern amenities and located in the heart of the city.',
      location: 'Downtown Area, Bangalore',
      price: 18000,
      deposit: 36000,
      type: PropertyType.STUDIO,
      status: PropertyStatus.ACTIVE,
      bedrooms: 1,
      bathrooms: 1,
      availableFrom: new Date('2024-01-15'),
      virtualTourUrl: 'https://example.com/virtual-tour-2',
      seoKeywords: 'studio apartment, downtown, furnished, cozy',
      contactPhone: '+91-9876543211',
      contactEmail: 'mike.chen@example.com',
      utilities: false,
      petFriendly: true,
      furnished: true,
      parking: false,
      ownerId: createdUsers[1].id,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'Furnished', 'Security System', 'AC']
    },
    {
      title: 'Shared Student House with Garden',
      description: 'Spacious shared house with beautiful garden and parking. Great for students who enjoy community living and outdoor activities.',
      location: 'Residential District, Bangalore',
      price: 15000,
      deposit: 30000,
      type: PropertyType.SHARED_HOUSE,
      status: PropertyStatus.ACTIVE,
      bedrooms: 3,
      bathrooms: 2,
      availableFrom: new Date('2024-02-15'),
      virtualTourUrl: 'https://example.com/virtual-tour-3',
      seoKeywords: 'shared house, garden, community living, spacious',
      contactPhone: '+91-9876543212',
      contactEmail: 'emma.davis@example.com',
      utilities: true,
      petFriendly: true,
      furnished: false,
      parking: true,
      ownerId: createdUsers[2].id,
      images: [
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Garden', 'Parking', 'Study Room', 'Kitchen', 'Laundry']
    },
    {
      title: 'Luxury Student Complex with Pool',
      description: 'Premium student accommodation with luxury amenities including swimming pool, gym, and 24/7 security. Perfect for students who want the best.',
      location: 'Premium Location, Bangalore',
      price: 45000,
      deposit: 90000,
      type: PropertyType.LUXURY,
      status: PropertyStatus.ACTIVE,
      bedrooms: 2,
      bathrooms: 2,
      availableFrom: new Date('2024-01-20'),
      virtualTourUrl: 'https://example.com/virtual-tour-4',
      seoKeywords: 'luxury accommodation, pool, gym, premium',
      contactPhone: '+91-9876543210',
      contactEmail: 'sarah.johnson@example.com',
      utilities: true,
      petFriendly: false,
      furnished: true,
      parking: true,
      ownerId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Pool', 'Gym', 'Security System', 'Study Room', '24/7 Support', 'Housekeeping']
    },
    {
      title: 'Budget-Friendly PG Accommodation',
      description: 'Affordable paying guest accommodation with basic amenities. Perfect for students on a budget who need a clean and safe place to stay.',
      location: 'Student Area, Bangalore',
      price: 8000,
      deposit: 16000,
      type: PropertyType.PG,
      status: PropertyStatus.ACTIVE,
      bedrooms: 1,
      bathrooms: 1,
      availableFrom: new Date('2024-02-01'),
      virtualTourUrl: 'https://example.com/virtual-tour-5',
      seoKeywords: 'PG accommodation, budget-friendly, affordable',
      contactPhone: '+91-9876543211',
      contactEmail: 'mike.chen@example.com',
      utilities: true,
      petFriendly: false,
      furnished: true,
      parking: false,
      ownerId: createdUsers[1].id,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'Laundry', 'Security System', 'Utilities Included']
    },
    // New India-focused properties
    {
      title: 'Traditional Family Home in Mumbai',
      description: 'Beautiful traditional Indian family home with modern amenities. Located in a peaceful neighborhood with easy access to colleges and universities.',
      location: 'Andheri West, Mumbai',
      price: 35000,
      deposit: 70000,
      type: PropertyType.FAMILY_HOME,
      status: PropertyStatus.ACTIVE,
      bedrooms: 3,
      bathrooms: 2,
      availableFrom: new Date('2024-03-01'),
      virtualTourUrl: 'https://example.com/virtual-tour-6',
      seoKeywords: 'family home, Mumbai, traditional, spacious',
      contactPhone: '+91-9876543216',
      contactEmail: 'rajesh.patel@example.com',
      utilities: true,
      petFriendly: true,
      furnished: true,
      parking: true,
      ownerId: createdUsers[6].id,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'Garden', 'Security System', 'Parking', 'Study Room', 'Common Room']
    },
    {
      title: 'Student Hostel Near Delhi University',
      description: 'Affordable student hostel with shared facilities. Perfect for students studying at Delhi University or nearby colleges.',
      location: 'North Campus, Delhi',
      price: 12000,
      deposit: 24000,
      type: PropertyType.HOSTEL,
      status: PropertyStatus.ACTIVE,
      bedrooms: 1,
      bathrooms: 1,
      availableFrom: new Date('2024-02-15'),
      virtualTourUrl: 'https://example.com/virtual-tour-7',
      seoKeywords: 'student hostel, Delhi University, affordable, shared',
      contactPhone: '+91-9876543217',
      contactEmail: 'meera.reddy@example.com',
      utilities: true,
      petFriendly: false,
      furnished: true,
      parking: false,
      ownerId: createdUsers[7].id,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'Laundry', 'Study Room', 'Common Room', 'Security System', 'Utilities Included']
    },
    {
      title: 'Premium PG for Working Professionals',
      description: 'High-quality paying guest accommodation designed for working professionals and students. Includes premium amenities and 24/7 support.',
      location: 'Koramangala, Bangalore',
      price: 22000,
      deposit: 44000,
      type: PropertyType.PG,
      status: PropertyStatus.ACTIVE,
      bedrooms: 1,
      bathrooms: 1,
      availableFrom: new Date('2024-01-25'),
      virtualTourUrl: 'https://example.com/virtual-tour-8',
      seoKeywords: 'premium PG, working professionals, Koramangala, Bangalore',
      contactPhone: '+91-9876543216',
      contactEmail: 'rajesh.patel@example.com',
      utilities: true,
      petFriendly: false,
      furnished: true,
      parking: true,
      ownerId: createdUsers[6].id,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'Laundry', 'Gym', 'Study Room', 'Security System', '24/7 Support', 'Housekeeping']
    },
    {
      title: 'Cozy Room in Hyderabad Tech Hub',
      description: 'Comfortable room in the heart of Hyderabad\'s tech corridor. Perfect for students and professionals working in IT companies.',
      location: 'Hitech City, Hyderabad',
      price: 16000,
      deposit: 32000,
      type: PropertyType.ROOM,
      status: PropertyStatus.ACTIVE,
      bedrooms: 1,
      bathrooms: 1,
      availableFrom: new Date('2024-02-10'),
      virtualTourUrl: 'https://example.com/virtual-tour-9',
      seoKeywords: 'room, Hitech City, Hyderabad, tech hub',
      contactPhone: '+91-9876543217',
      contactEmail: 'meera.reddy@example.com',
      utilities: true,
      petFriendly: true,
      furnished: true,
      parking: false,
      ownerId: createdUsers[7].id,
      images: [
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'AC', 'Security System', 'Study Room', 'Utilities Included']
    },
    {
      title: 'Luxury Apartment in Pune University Area',
      description: 'Premium apartment complex near Pune University with world-class amenities. Ideal for students who want luxury living.',
      location: 'Koregaon Park, Pune',
      price: 55000,
      deposit: 110000,
      type: PropertyType.LUXURY,
      status: PropertyStatus.ACTIVE,
      bedrooms: 2,
      bathrooms: 2,
      availableFrom: new Date('2024-01-30'),
      virtualTourUrl: 'https://example.com/virtual-tour-10',
      seoKeywords: 'luxury apartment, Pune University, premium, Koregaon Park',
      contactPhone: '+91-9876543216',
      contactEmail: 'rajesh.patel@example.com',
      utilities: true,
      petFriendly: false,
      furnished: true,
      parking: true,
      ownerId: createdUsers[6].id,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Pool', 'Gym', 'Security System', 'Study Room', '24/7 Support', 'Housekeeping', 'Garden']
    },
    {
      title: 'Budget Studio Near Chennai College',
      description: 'Affordable studio apartment perfect for students. Located near major colleges and universities in Chennai.',
      location: 'T Nagar, Chennai',
      price: 14000,
      deposit: 28000,
      type: PropertyType.STUDIO,
      status: PropertyStatus.ACTIVE,
      bedrooms: 1,
      bathrooms: 1,
      availableFrom: new Date('2024-02-20'),
      virtualTourUrl: 'https://example.com/virtual-tour-11',
      seoKeywords: 'budget studio, Chennai, student-friendly, T Nagar',
      contactPhone: '+91-9876543217',
      contactEmail: 'meera.reddy@example.com',
      utilities: false,
      petFriendly: false,
      furnished: true,
      parking: false,
      ownerId: createdUsers[7].id,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Kitchen', 'AC', 'Security System', 'Study Room']
    },
    {
      title: 'Shared House in Kolkata Student Area',
      description: 'Spacious shared house in a student-friendly neighborhood. Great for students who want community living at affordable rates.',
      location: 'Salt Lake, Kolkata',
      price: 13000,
      deposit: 26000,
      type: PropertyType.SHARED_HOUSE,
      status: PropertyStatus.ACTIVE,
      bedrooms: 4,
      bathrooms: 2,
      availableFrom: new Date('2024-02-05'),
      virtualTourUrl: 'https://example.com/virtual-tour-12',
      seoKeywords: 'shared house, Kolkata, Salt Lake, community living',
      contactPhone: '+91-9876543216',
      contactEmail: 'rajesh.patel@example.com',
      utilities: true,
      petFriendly: true,
      furnished: false,
      parking: true,
      ownerId: createdUsers[6].id,
      images: [
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Garden', 'Parking', 'Study Room', 'Kitchen', 'Laundry', 'Common Room']
    }
  ]

  const createdProperties = await Promise.all(
    properties.map(async (property) => {
      const { images, amenities, ...propertyData } = property

      const createdProperty = await prisma.property.create({
        data: propertyData,
      })

      // Create property images
      await Promise.all(
        images.map((url, index) =>
          prisma.propertyImage.create({
            data: {
              propertyId: createdProperty.id,
              url,
              order: index,
              isCover: index === 0,
            },
          })
        )
      )

      // Create property amenities
      await Promise.all(
        amenities.map(async (amenityName) => {
          const amenity = createdAmenities.find(a => a.name === amenityName)
          if (amenity) {
            await prisma.propertyAmenity.create({
              data: {
                propertyId: createdProperty.id,
                amenityId: amenity.id,
              },
            })
          }
        })
      )

      return createdProperty
    })
  )

  console.log(`✅ Created ${createdProperties.length} properties`)

  // Create some reviews
  const reviews = [
    {
      propertyId: createdProperties[0].id,
      userId: createdUsers[3].id,
      rating: 5,
      comment: 'Excellent apartment! Very clean and well-maintained. The location is perfect for students.',
    },
    {
      propertyId: createdProperties[0].id,
      userId: createdUsers[4].id,
      rating: 4,
      comment: 'Great place to stay. The amenities are good and the landlord is very helpful.',
    },
    {
      propertyId: createdProperties[1].id,
      userId: createdUsers[5].id,
      rating: 4,
      comment: 'Cozy studio with all the basic amenities. Perfect for students who prefer privacy.',
    },
    {
      propertyId: createdProperties[3].id,
      userId: createdUsers[3].id,
      rating: 5,
      comment: 'Luxury accommodation with amazing facilities. The pool and gym are fantastic!',
    },
    {
      propertyId: createdProperties[5].id,
      userId: createdUsers[4].id,
      rating: 5,
      comment: 'Beautiful traditional home with modern amenities. The garden is perfect for relaxation.',
    },
    {
      propertyId: createdProperties[6].id,
      userId: createdUsers[5].id,
      rating: 4,
      comment: 'Great hostel near Delhi University. Clean and affordable with good facilities.',
    },
    {
      propertyId: createdProperties[7].id,
      userId: createdUsers[3].id,
      rating: 5,
      comment: 'Premium PG accommodation with excellent amenities. Perfect for working professionals.',
    },
    {
      propertyId: createdProperties[8].id,
      userId: createdUsers[4].id,
      rating: 4,
      comment: 'Comfortable room in Hitech City. Great location for tech professionals.',
    },
  ]

  const createdReviews = await Promise.all(
    reviews.map(review =>
      prisma.review.create({ data: review })
    )
  )

  console.log(`✅ Created ${createdReviews.length} reviews`)

  // Create some bookings
  const bookings = [
    {
      propertyId: createdProperties[0].id,
      userId: createdUsers[3].id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-31'),
      status: BookingStatus.CONFIRMED,
      amount: 25000,
      deposit: 50000,
      notes: 'Student accommodation for semester',
    },
    {
      propertyId: createdProperties[1].id,
      userId: createdUsers[4].id,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      status: BookingStatus.CONFIRMED,
      amount: 18000,
      deposit: 36000,
      notes: 'Studio apartment booking',
    },
    {
      propertyId: createdProperties[5].id,
      userId: createdUsers[5].id,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-31'),
      status: BookingStatus.CONFIRMED,
      amount: 35000,
      deposit: 70000,
      notes: 'Family home booking for student',
    },
    {
      propertyId: createdProperties[6].id,
      userId: createdUsers[3].id,
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-07-31'),
      status: BookingStatus.CONFIRMED,
      amount: 12000,
      deposit: 24000,
      notes: 'Hostel accommodation near Delhi University',
    },
  ]

  const createdBookings = await Promise.all(
    bookings.map(booking =>
      prisma.booking.create({ data: booking })
    )
  )

  console.log(`✅ Created ${createdBookings.length} bookings`)

  // Create some inquiries
  const inquiries = [
    {
      propertyId: createdProperties[2].id,
      userId: createdUsers[5].id,
      message: 'Hi, I am interested in the shared house. Is it still available for February?',
      status: InquiryStatus.PENDING,
    },
    {
      propertyId: createdProperties[3].id,
      userId: createdUsers[4].id,
      message: 'Hello, I would like to know more about the luxury complex. Are pets allowed?',
      status: InquiryStatus.RESPONDED,
    },
    {
      propertyId: createdProperties[7].id,
      userId: createdUsers[3].id,
      message: 'Hi, I am interested in the premium PG. Do you have any rooms available for March?',
      status: InquiryStatus.PENDING,
    },
    {
      propertyId: createdProperties[8].id,
      userId: createdUsers[4].id,
      message: 'Hello, I would like to know more about the room in Hitech City. Is parking available?',
      status: InquiryStatus.RESPONDED,
    },
  ]

  const createdInquiries = await Promise.all(
    inquiries.map(inquiry =>
      prisma.inquiry.create({ data: inquiry })
    )
  )

  console.log(`✅ Created ${createdInquiries.length} inquiries`)

  // Create some favorites
  const favorites = [
    {
      propertyId: createdProperties[0].id,
      userId: createdUsers[3].id,
    },
    {
      propertyId: createdProperties[3].id,
      userId: createdUsers[4].id,
    },
    {
      propertyId: createdProperties[1].id,
      userId: createdUsers[5].id,
    },
    {
      propertyId: createdProperties[5].id,
      userId: createdUsers[3].id,
    },
    {
      propertyId: createdProperties[7].id,
      userId: createdUsers[4].id,
    },
    {
      propertyId: createdProperties[9].id,
      userId: createdUsers[5].id,
    },
  ]

  const createdFavorites = await Promise.all(
    favorites.map(favorite =>
      prisma.favorite.create({ data: favorite })
    )
  )

  console.log(`✅ Created ${createdFavorites.length} favorites`)

  // Create some notifications
  const notifications = [
    {
      userId: createdUsers[0].id,
      type: NotificationType.BOOKING,
      title: 'New Booking Confirmed',
      message: 'Your property "Modern Student Apartment" has been booked by Alex Kumar',
    },
    {
      userId: createdUsers[1].id,
      type: NotificationType.INQUIRY,
      title: 'New Inquiry Received',
      message: 'You have received a new inquiry for your studio apartment',
    },
    {
      userId: createdUsers[3].id,
      type: NotificationType.REVIEW,
      title: 'New Review Posted',
      message: 'A new review has been posted for a property you booked',
    },
    {
      userId: createdUsers[6].id,
      type: NotificationType.BOOKING,
      title: 'New Booking Confirmed',
      message: 'Your property "Traditional Family Home" has been booked by Rahul Singh',
    },
    {
      userId: createdUsers[7].id,
      type: NotificationType.INQUIRY,
      title: 'New Inquiry Received',
      message: 'You have received a new inquiry for your student hostel',
    },
  ]

  const createdNotifications = await Promise.all(
    notifications.map(notification =>
      prisma.notification.create({ data: notification })
    )
  )

  console.log(`✅ Created ${createdNotifications.length} notifications`)

  // Update property ratings based on reviews
  for (const property of createdProperties) {
    const propertyReviews = await prisma.review.findMany({
      where: { propertyId: property.id },
      select: { rating: true },
    })

    if (propertyReviews.length > 0) {
      const averageRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0) / propertyReviews.length

      await prisma.property.update({
        where: { id: property.id },
        data: { rating: averageRating },
      })
    }
  }

  console.log('✅ Updated property ratings')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 