# 🗄️ PostgreSQL Database Setup for SmartStay

This guide will help you set up PostgreSQL database integration for your SmartStay Next.js project.

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in your project root:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/smartstay"

# Better Auth (REQUIRED)
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="generate-a-strong-random-32-byte-value"  # openssl rand -base64 32

# Public base URL for trustedOrigins / CSRF check — set to same value as BETTER_AUTH_URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Scheduled OTP cleanup (REQUIRED for the cron) — protects /api/auth/cleanup-otp
CRON_SECRET="generate-a-strong-random-value"

# Email / OTP delivery (REQUIRED for signup OTP emails) — Gmail App Password
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> See `env.example` for the authoritative, commented list of variables.

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL:**
   - **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS:** `brew install postgresql`
   - **Ubuntu:** `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE smartstay;
   
   # Create user (optional)
   CREATE USER smartstay_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE smartstay TO smartstay_user;
   
   # Exit
   \q
   ```

#### Option B: Cloud Database (Recommended for Production)

- **Supabase:** Free tier available at [supabase.com](https://supabase.com)
- **Neon:** Serverless PostgreSQL at [neon.tech](https://neon.tech)
- **Railway:** Easy deployment at [railway.app](https://railway.app)

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

## 🛠️ Available Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## 📊 Database Schema Overview

### Core Models

- **User:** Students, landlords, and admins
- **Property:** Accommodation listings with full details
- **PropertyImage:** Multiple images per property
- **Amenity:** Available facilities and features
- **Favorite:** User's saved properties
- **Booking:** Property reservations
- **Review:** User reviews and ratings
- **Inquiry:** Property inquiries from students
- **Notification:** System notifications

### Key Features

- **Multi-role Users:** Students, landlords, and admins
- **Rich Property Data:** Images, amenities, pricing, availability
- **Booking System:** Complete reservation management
- **Review System:** User feedback and ratings
- **Inquiry Management:** Communication between users
- **Notification System:** Real-time updates

## 🔧 Database Configuration

### Prisma Schema Location
```
prisma/
├── schema.prisma    # Database schema definition
└── seed.ts         # Sample data seeding
```

### Database Utilities Location
```
src/lib/
├── prisma.ts       # Prisma client instantiation & configuration (singleton)
├── db.ts           # Backward-compat re-export of prisma.ts
└── auth.ts         # Authentication utilities
```

### API Routes Location
```
src/app/api/
├── properties/     # Property CRUD operations
├── user/           # User management (profile, change-password, etc.)
├── bookings/       # Booking operations
├── favorites/      # Favorite management
└── auth/           # Authentication endpoints
```

(Tree is illustrative, not exhaustive — other route groups include `amenities/`, `analytics/`, `inquiries/`, `notifications/`, `reviews/`, `search/`, and `dashboard/analytics/`.)

## 🌱 Sample Data

The seed script creates:

- **8 Users:** 3 students, 5 landlords (no admin is seeded)
- **12 Properties:** Various types and price ranges
- **24 Amenities:** Categorized facilities
- **Sample Data:** Favorites, reviews, inquiries, notifications

### Default Login Credentials

All users have the password: `password123`

- **Landlord:** sarah.johnson@example.com
- **Landlord:** mike.chen@example.com
- **Landlord:** emma.davis@example.com
- **Student:** alex.kumar@example.com
- **Student:** priya.sharma@example.com
- **Student:** rahul.singh@example.com
- **Landlord:** rajesh.patel@example.com
- **Landlord:** meera.reddy@example.com

## 🔒 Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds (`src/lib/password.ts`), used by Better Auth and the register/change-password routes. (`prisma/seed.ts` hashes seed fixtures at 12 rounds.)
- **Input Validation:** Zod schema validation
- **SQL Injection Protection:** Prisma ORM
- **Type Safety:** Full TypeScript support

## 📈 Performance Optimizations

- **Connection Pooling:** Prisma client optimization
- **Indexed Queries:** Optimized database indexes
- **Eager Loading:** Efficient relationship queries
- **Pagination:** Large dataset handling

## 🚀 Production Deployment

### Environment Variables

```env
# Production Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/smartstay"

# Better Auth (BETTER_AUTH_SECRET is REQUIRED — app throws on startup in production if missing)
BETTER_AUTH_SECRET="your-production-secret-key"   # openssl rand -base64 32
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Optional: tune the Prisma connection pool via the connection_limit query
# parameter on DATABASE_URL (default = num_physical_cpus * 2 + 1), e.g.:
#   DATABASE_URL="postgresql://username:password@your-db-host:5432/smartstay?connection_limit=20"
```

> See `env.example` for the full, authoritative list of variables (including `CRON_SECRET`, `EMAIL_USER`/`EMAIL_PASS`, and Google OAuth keys).

### Database Migration

```bash
# Create production migration
npm run db:migrate

# Apply migrations
npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error:**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check firewall settings

2. **Permission Error:**
   - Ensure database user has proper privileges
   - Check database ownership

3. **Migration Issues:**
   - Reset database: `npx prisma migrate reset`
   - Check schema compatibility

### Useful Commands

```bash
# Check database connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# View database in browser
npx prisma studio

# Check Prisma client
npx prisma generate
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zod Validation](https://zod.dev)

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review Prisma and PostgreSQL logs
3. Verify environment variables
4. Ensure all dependencies are installed

---

**Happy coding! 🎉** 