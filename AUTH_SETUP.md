# Authentication Setup Guide

## Overview
This project uses NextAuth.js (Auth.js) with Google OAuth for authentication. The authentication system is fully integrated with your PostgreSQL database using Prisma.

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://your-username:your-password@your-host:5432/your-database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setting up Google OAuth

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

4. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file

## Generating NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Features Implemented

### ✅ Authentication Pages
- **Sign In** (`/auth/signin`) - Google OAuth and email/password
- **Sign Up** (`/auth/signup`) - Google OAuth and email/password registration

### ✅ User Management
- **User Menu** - Dropdown with user info and actions
- **Role-based Access** - Students and Landlords
- **Session Management** - Automatic session handling

### ✅ Protected Routes
- **Middleware Protection** - Automatic route protection
- **Role-based Routes** - Dashboard only for landlords
- **Authentication Guards** - Redirect unauthenticated users

### ✅ Database Integration
- **Prisma Adapter** - Full database integration
- **User Profiles** - Extended user model with roles
- **Session Storage** - Database-backed sessions

## User Roles

### Student
- Can browse properties
- Can add properties to favorites
- Can make inquiries
- Can leave reviews

### Landlord
- All student permissions
- Can access owner dashboard
- Can add/edit/delete properties
- Can manage bookings and inquiries

## Usage

### Sign In
```typescript
import { signIn } from "next-auth/react";

// Google OAuth
await signIn("google", { callbackUrl: "/" });

// Email/Password (if implemented)
await signIn("credentials", {
  email: "user@example.com",
  password: "password",
  redirect: false,
});
```

### Sign Out
```typescript
import { signOut } from "next-auth/react";

await signOut({ callbackUrl: "/" });
```

### Check Authentication
```typescript
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

if (status === "loading") {
  // Loading state
}

if (status === "authenticated") {
  // User is signed in
  console.log(session.user);
}

if (status === "unauthenticated") {
  // User is not signed in
}
```

### Protect API Routes
```typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Your protected API logic here
}
```

## Security Features

- **JWT Strategy** - Secure token-based authentication
- **CSRF Protection** - Built-in CSRF protection
- **Secure Cookies** - HttpOnly, secure cookies
- **Role-based Access Control** - Fine-grained permissions
- **Middleware Protection** - Route-level security

## Next Steps

1. **Set up environment variables** as described above
2. **Configure Google OAuth** in Google Cloud Console
3. **Test authentication flow** by running the development server
4. **Customize user roles** and permissions as needed
5. **Add email verification** if required
6. **Implement password reset** functionality

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check your Google OAuth redirect URIs in Google Cloud Console
   - Ensure they match exactly (including http/https)

2. **"NEXTAUTH_SECRET not set" error**
   - Generate and set the NEXTAUTH_SECRET environment variable

3. **Database connection issues**
   - Verify your DATABASE_URL is correct
   - Ensure your database is running and accessible

4. **Session not persisting**
   - Check that your database tables are created correctly
   - Verify the Prisma adapter is working

### Getting Help

- Check the [NextAuth.js documentation](https://next-auth.js.org/)
- Review the [Prisma documentation](https://www.prisma.io/docs/)
- Check the console for detailed error messages 