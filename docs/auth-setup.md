# Authentication Setup Guide

## Overview
This project uses [better-auth](https://www.better-auth.com/) (v1.4.x) for authentication, integrated with PostgreSQL via the Prisma adapter. It supports email/password sign-in (passwords hashed with bcryptjs) and email-OTP signup verification, plus optional Google OAuth. Sessions are database-backed.

The core configuration lives in `src/lib/auth.ts`; the client helpers in `src/lib/auth-client.ts`; and the server-side helpers in `src/lib/auth-server.ts`.

## Environment Variables Required

Copy `env.example` to `.env` (it is gitignored) and fill in the values. See `env.example` for the authoritative, commented list — the keys the auth system reads are:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@host:5432/smartstay?sslmode=require"

# Better Auth (REQUIRED)
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="generate-a-strong-random-32-byte-value"

# Public base URL for trustedOrigins + the same-origin CSRF check on sensitive
# routes. Set to the SAME value as BETTER_AUTH_URL (your real domain in prod).
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Scheduled OTP cleanup — protects /api/auth/cleanup-otp (endpoint disabled if unset)
CRON_SECRET="generate-a-strong-random-value"

# Email / OTP delivery (REQUIRED for signup OTP emails via nodemailer)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# Google OAuth (OPTIONAL — only if Google sign-in is enabled)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> `BETTER_AUTH_SECRET` is **required in production** — the app throws on startup if it is missing (`src/lib/auth.ts`).

## Setting up Google OAuth

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Configure the OAuth consent screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in the app name, support email, and scopes (email, profile)

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

4. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Generating the Auth Secret

Generate a secure random string for `BETTER_AUTH_SECRET`:

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Features Implemented

### ✅ Authentication Pages
- **Sign In** (`/auth/signin`) - Google OAuth and email/password
- **Sign Up** (`/auth/signup`) - Google OAuth and email/password registration with OTP email verification

### ✅ User Management
- **User Menu** - Dropdown with user info and actions
- **Role-based Access** - Students and Landlords
- **Session Management** - Database-backed session handling

### ✅ Protected Routes
- **Middleware Protection** - Automatic route protection
- **Role-based Routes** - Dashboard only for landlords
- **Authentication Guards** - Redirect unauthenticated users

### ✅ Database Integration
- **Prisma Adapter** - Full database integration (`prismaAdapter`, provider `postgresql`)
- **User Profiles** - Extended user model with `role`, `phone`, and `verified` fields
- **Session Storage** - Database-backed sessions (Session table with a unique token)

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

All client-side auth helpers are re-exported from `@/lib/auth-client`.

### Sign In
```typescript
import { signIn } from "@/lib/auth-client";

// Google OAuth
await signIn.social({ provider: "google", callbackURL: "/" });

// Email/Password
await signIn.email({
  email: "user@example.com",
  password: "password",
  callbackURL: "/",
});
```

### Sign Out
```typescript
import { signOut } from "@/lib/auth-client";

await signOut();
```

### Check Authentication
```typescript
import { useSession } from "@/lib/auth-client";

const { data: session, isPending } = useSession();

if (isPending) {
  // Loading state
}

if (session) {
  // User is signed in
  console.log(session.user);
} else {
  // User is not signed in
}
```

### Protect API Routes
Use the server-side helpers from `@/lib/auth-server`:

```typescript
import { getSession } from "@/lib/auth-server";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Your protected API logic here
}
```

`@/lib/auth-server` also exports `requireAuth()` (returns the session or throws `"Unauthorized"`), `getCurrentUser()`, `hasRole(role)`, `isLandlord()`, and `isStudent()`. The better-auth catch-all handler route lives at `src/app/api/auth/[...all]/route.ts` (wired via `toNextJsHandler` from `better-auth/next-js`).

## Security Features

- **Database-backed Sessions** - Sessions are stored in PostgreSQL via the Prisma adapter, with a 7-day expiry and a 24-hour sliding update window; cookie caching is disabled so role changes take effect immediately (`src/lib/auth.ts`).
- **CSRF Protection** - `trustedOrigins` allowlist plus a same-origin check on sensitive routes (change-password, delete-account)
- **Secure Cookies** - HttpOnly, secure cookies
- **Role-based Access Control** - Fine-grained permissions
- **Middleware Protection** - Route-level security

## Next Steps

1. **Set up environment variables** as described above
2. **Configure Google OAuth** in Google Cloud Console
3. **Test authentication flow** by running the development server
4. **Customize user roles** and permissions as needed

> Email verification is already implemented — signup sends a cryptographically secure 6-digit OTP via email (see `src/app/api/auth/send-otp/route.ts`, `src/lib/email.ts`, and the `EMAIL_USER`/`EMAIL_PASS` vars in `env.example`), with expired/used OTPs cleaned up by `src/app/api/auth/cleanup-otp/route.ts`. Password reset is not yet implemented.

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check your Google OAuth redirect URIs in Google Cloud Console
   - Ensure they match exactly (including http/https)

2. **"BETTER_AUTH_SECRET must be set in production" error**
   - Generate and set the `BETTER_AUTH_SECRET` environment variable (the app fails fast on startup in production if it is missing)

3. **Database connection issues**
   - Verify your `DATABASE_URL` is correct
   - Ensure your database is running and accessible

4. **Session not persisting**
   - Check that your database tables are created correctly (`npm run db:push`)
   - Verify the Prisma adapter is working

### Getting Help

- Check the [Better Auth documentation](https://www.better-auth.com/docs)
- Review the [Prisma documentation](https://www.prisma.io/docs/)
- Check the console for detailed error messages
