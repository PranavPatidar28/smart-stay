# SmartStay Backend Documentation

## Overview

The SmartStay backend is a comprehensive REST API built with Next.js 15, Prisma ORM, and PostgreSQL. It provides all the necessary endpoints to support the SmartStay student accommodation platform.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Validation**: Zod schema validation
- **Error Handling**: Custom error handling with proper HTTP status codes
- **TypeScript**: Full type safety throughout the application

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Students, landlords, and admins
- **Properties**: Accommodation listings with detailed information
- **Bookings**: Reservation system for properties
- **Reviews**: User reviews and ratings
- **Inquiries**: Communication between users and property owners
- **Favorites**: User's saved properties
- **Notifications**: System notifications
- **Amenities**: Property features and facilities

## API Endpoints

### Authentication

#### `GET /api/auth/[...nextauth]`
- **Description**: NextAuth.js authentication endpoints
- **Features**: Google OAuth, JWT sessions, role-based access

#### `PUT /api/auth/update-role`
- **Description**: Update user role (STUDENT/LANDLORD/ADMIN)
- **Authentication**: Required
- **Body**: `{ role: string }`

### Properties

#### `GET /api/properties`
- **Description**: Get all properties with filtering and pagination
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `type`: Property type filter
  - `status`: Property status filter
  - `minPrice`/`maxPrice`: Price range filter
  - `location`: Location search
  - `search`: General search term

#### `POST /api/properties`
- **Description**: Create a new property
- **Authentication**: Required (LANDLORD role)
- **Body**: Property data with images and amenities

#### `GET /api/properties/[id]`
- **Description**: Get specific property details
- **Features**: Increments view count, includes reviews and owner info

#### `PUT /api/properties/[id]`
- **Description**: Update property details
- **Authentication**: Required (property owner)

#### `DELETE /api/properties/[id]`
- **Description**: Delete property
- **Authentication**: Required (property owner)

### Search

#### `GET /api/search`
- **Description**: Advanced property search with comprehensive filtering
- **Query Parameters**:
  - All property filters plus:
  - `amenities[]`: Array of amenity names
  - `sortBy`: Sort field (price, rating, views, createdAt, updatedAt)
  - `sortOrder`: asc/desc
  - `verified`: Filter by verified owners only
  - `furnished`, `petFriendly`, `parking`, `utilities`: Boolean filters
- **Features**: Search suggestions, filter options, grouped results

### Favorites

#### `GET /api/favorites`
- **Description**: Get user's favorite properties
- **Authentication**: Required
- **Query Parameters**: `page`, `limit`

#### `POST /api/favorites`
- **Description**: Add property to favorites
- **Authentication**: Required
- **Body**: `{ propertyId: string }`

#### `DELETE /api/favorites/[id]`
- **Description**: Remove property from favorites
- **Authentication**: Required

### Bookings

#### `GET /api/bookings`
- **Description**: Get user's bookings
- **Authentication**: Required
- **Query Parameters**: `page`, `limit`, `status`

#### `POST /api/bookings`
- **Description**: Create a new booking
- **Authentication**: Required
- **Body**: `{ propertyId, startDate, endDate?, amount, deposit?, notes? }`
- **Features**: Conflict checking, notification to owner

#### `GET /api/bookings/[id]`
- **Description**: Get specific booking details
- **Authentication**: Required

#### `PUT /api/bookings/[id]`
- **Description**: Update booking details
- **Authentication**: Required
- **Features**: Status change notifications

#### `DELETE /api/bookings/[id]`
- **Description**: Cancel booking
- **Authentication**: Required

### Reviews

#### `GET /api/reviews`
- **Description**: Get property reviews
- **Query Parameters**: `propertyId`, `page`, `limit`

#### `POST /api/reviews`
- **Description**: Create a new review
- **Authentication**: Required
- **Body**: `{ propertyId, rating, comment? }`
- **Features**: One review per user per property, booking validation

#### `PUT /api/reviews/[id]`
- **Description**: Update review
- **Authentication**: Required (review author)

#### `DELETE /api/reviews/[id]`
- **Description**: Delete review
- **Authentication**: Required (review author)

### Inquiries

#### `GET /api/inquiries`
- **Description**: Get inquiries (user's sent or property owner's received)
- **Authentication**: Required
- **Query Parameters**: `propertyId?`, `status?`, `page`, `limit`

#### `POST /api/inquiries`
- **Description**: Send inquiry to property owner
- **Authentication**: Required
- **Body**: `{ propertyId, message }`
- **Features**: Notification to owner, prevents self-inquiry

#### `PUT /api/inquiries/[id]`
- **Description**: Update inquiry status (respond)
- **Authentication**: Required (property owner)
- **Body**: `{ status: 'PENDING' | 'RESPONDED' | 'CLOSED' }`

### Notifications

#### `GET /api/notifications`
- **Description**: Get user notifications
- **Authentication**: Required
- **Query Parameters**: `page`, `limit`, `unread`

#### `PUT /api/notifications`
- **Description**: Mark multiple notifications as read
- **Authentication**: Required
- **Body**: `{ notificationIds: string[] }`

#### `PUT /api/notifications/[id]`
- **Description**: Mark single notification as read
- **Authentication**: Required

### User Profile

#### `GET /api/user/profile`
- **Description**: Get user profile with statistics
- **Authentication**: Required

#### `PUT /api/user/profile`
- **Description**: Update user profile
- **Authentication**: Required
- **Body**: `{ name?, phone?, role? }`

### Amenities

#### `GET /api/amenities`
- **Description**: Get all amenities with grouping
- **Query Parameters**: `category?`, `search?`
- **Features**: Grouped by category, search functionality

### Dashboard Analytics

#### `GET /api/dashboard/analytics`
- **Description**: Get landlord dashboard analytics
- **Authentication**: Required (LANDLORD role)
- **Query Parameters**: `period` (days, default: 30)
- **Features**: Property stats, earnings, bookings, inquiries, recent activity

## Error Handling

The backend implements comprehensive error handling:

### Error Types
- **400 Bad Request**: Validation errors, invalid data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Business logic conflicts (e.g., duplicate bookings)
- **500 Internal Server Error**: Server errors

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Security Features

### Authentication & Authorization
- JWT-based sessions with NextAuth.js
- Role-based access control (STUDENT, LANDLORD, ADMIN)
- Secure password hashing with bcrypt
- OAuth integration with Google

### Data Validation
- Zod schema validation for all inputs
- SQL injection prevention with Prisma ORM
- Input sanitization and length limits
- Type safety with TypeScript

### Business Logic Security
- User ownership verification for all operations
- Booking conflict detection
- Review validation (one per user per property)
- Inquiry restrictions (no self-inquiry)

## Performance Features

### Database Optimization
- Efficient queries with Prisma ORM
- Proper indexing on frequently queried fields
- Pagination for all list endpoints
- Selective field inclusion to reduce payload size

### Caching Strategy
- Database query optimization
- Efficient data fetching patterns
- Minimal redundant queries

## API Client

A comprehensive TypeScript API client is provided at `src/lib/api-client.ts` with:

- Full type safety for all endpoints
- Error handling and retry logic
- Easy-to-use methods for all API operations
- Consistent response formatting

### Usage Example
```typescript
import { apiClient } from '@/lib/api-client'

// Search properties
const properties = await apiClient.searchProperties({
  search: 'student apartment',
  minPrice: 5000,
  maxPrice: 15000,
  type: 'APARTMENT'
})

// Create booking
const booking = await apiClient.createBooking({
  propertyId: 'property-id',
  startDate: '2024-02-01T00:00:00Z',
  amount: 12000
})
```

## Database Setup

### Prerequisites
- PostgreSQL database
- Node.js 18+ and npm

### Setup Steps
1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.example`)
3. Generate Prisma client: `npm run db:generate`
4. Run database migrations: `npm run db:migrate`
5. Seed the database: `npm run db:seed`

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartstay"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Testing

The backend includes comprehensive error handling and validation. To test the API:

1. Start the development server: `npm run dev`
2. Use tools like Postman or curl to test endpoints
3. Check the console for detailed error logs
4. Verify database operations with Prisma Studio: `npm run db:studio`

## Deployment

The backend is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Railway
- Heroku
- AWS/GCP with proper environment setup

### Production Considerations
- Set up proper environment variables
- Configure database connection pooling
- Enable HTTPS
- Set up monitoring and logging
- Configure CORS if needed

## Support

For issues or questions:
1. Check the error logs in the console
2. Verify database connectivity
3. Ensure all environment variables are set
4. Check Prisma schema and migrations

The backend is designed to be robust, scalable, and maintainable with comprehensive error handling and type safety throughout. 