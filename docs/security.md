# Security Implementation Guide

This document describes the security measures implemented in SmartStay: rate
limiting, secure OTP handling, CSRF defenses, session management, and the
remaining hardening roadmap. It reflects the code as it currently stands in the
repository.

## Rate Limiting

Rate limiting protects the app against brute-force attacks, email/OTP spam, and
general API abuse. Limiters live in `src/lib/rate-limit.ts`.

### OTP (One-Time Password)

OTP requests are limited on two independent keys so neither a single IP nor a
single email address can flood the system.

- **IP-based**: 3 requests per IP per 15 minutes (`otpRateLimit`).
- **Email-based**: 3 requests per email per 15 minutes (built inline in the
  send-OTP route).

```typescript
// IP-based rate limiting (applied first)
const ipRateLimitResult = otpRateLimit(request);
if (ipRateLimitResult) {
  return ipRateLimitResult;
}

// Email-specific rate limiting
const emailRateLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,                    // 3 OTP requests per 15 minutes per email
  keyGenerator: () => email.toLowerCase().trim(),
});
```

### Authentication

Credential sign-in, registration, password changes, and account deletion all
run through the shared `authRateLimit` limiter.

- **Window**: 15 minutes
- **Limit**: 5 attempts per IP address
- **Purpose**: bound brute-force password attempts and account-creation /
  deletion abuse.

### General API

- **Window**: 1 minute
- **Limit**: 100 requests per IP address (`generalRateLimit`)
- **Purpose**: blunt API abuse and crude DDoS attempts.

### Rate-limit responses

When a limit is exceeded the limiter returns `429 Too Many Requests`:

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in X seconds.",
  "retryAfter": 900
}
```

Response headers:

- `Retry-After` — seconds until the window resets
- `X-RateLimit-Limit` — maximum requests allowed
- `X-RateLimit-Remaining` — remaining requests in the current window
- `X-RateLimit-Reset` — ISO timestamp when the window resets

### Technical notes

- **Store**: in-memory `Map`. On serverless (Vercel) this is per-instance and
  resets on cold start, so limits are best-effort and not shared across
  instances. The interface is intentionally small so it can be swapped for a
  shared atomic store (Upstash Redis / Vercel KV using `INCR` + `EXPIRE`).
- **Cleanup**: a 5-minute interval prunes expired entries; entries also expire
  lazily on access, since the interval timer is not guaranteed to fire on
  serverless.
- **Client IP**: `x-vercel-forwarded-for` / `x-real-ip` are trusted first (set
  by the platform and not client-forgeable). Falling back to `x-forwarded-for`,
  the limiter takes the **right-most** entry (closest to our trusted proxy)
  because the left-most entries are client-controllable and spoofable.

## Secure OTP Handling

OTPs back email verification during registration. An earlier implementation
**deleted** the OTP after use, which left a window for replay if a record was
intercepted before deletion and provided no audit trail. The current
implementation marks OTPs as used instead.

### Schema

The `OtpVerification` model (table `otp_verification`) carries the fields that
make reuse detection and auditing possible:

```prisma
model OtpVerification {
  id        String    @id @default(cuid())
  email     String    @unique
  otp       String
  expiresAt DateTime
  used      Boolean   @default(false)  // set true once consumed
  usedAt    DateTime?                  // when it was consumed
  attempts  Int       @default(0)      // failed verification attempts
  createdAt DateTime  @default(now())

  @@map("otp_verification")
}
```

### Mark-as-used instead of delete

On successful registration the OTP is flipped to used within the same
transaction that creates the user and credential account, rather than deleted:

```typescript
await tx.otpVerification.update({
  where: { email },
  data: { used: true, usedAt: new Date() },
});
```

This keeps a permanent record that the OTP was consumed (audit trail) and makes
the used state authoritative for reuse checks.

### Reuse and active-OTP prevention

Registration rejects an OTP that is expired, already used, or has exhausted its
attempt budget before doing any comparison:

```typescript
if (otpRecord.expiresAt < new Date()) { /* expired -> reject */ }
if (otpRecord.used)                    { /* already used -> reject */ }
if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) { /* too many tries -> 429 */ }
```

The send-OTP route refuses to issue a second code while an unused, unexpired one
already exists, so only one active OTP per email can be outstanding at a time:

```typescript
const existingUnusedOTP = await prisma.otpVerification.findFirst({
  where: { email, used: false, expiresAt: { gt: new Date() } },
});
if (existingUnusedOTP) {
  // 400: "An active OTP already exists for this email"
}
```

When a new OTP is issued, the upsert resets `used` to `false` and clears
`usedAt`, so a fresh code starts from a clean state.

### Attempt limiting and constant-time comparison

OTP verification is hardened against brute force over the 6-digit space:

- A failed comparison increments `attempts`; once it reaches
  `MAX_OTP_ATTEMPTS` (5) the OTP is locked and the caller must request a new
  one.
- The submitted code is compared against the stored code with
  `crypto.timingSafeEqual` (length-checked first) to avoid timing
  side-channels.
- Codes are generated with `crypto.randomInt(100000, 1000000)` rather than
  `Math.random`, so they are cryptographically unpredictable. The OTP is never
  written to logs, even when email delivery fails.

### Cleanup

Cleanup lives in the `POST/GET /api/auth/cleanup-otp` route and is guarded by a
`CRON_SECRET` (constant-time compared; the endpoint fails closed and is disabled
if no secret is configured). Vercel Cron triggers it via `GET` with an
`Authorization: Bearer <CRON_SECRET>` header.

```typescript
// Delete OTPs that expired more than 15 minutes ago
await prisma.otpVerification.deleteMany({
  where: { expiresAt: { lt: new Date(Date.now() - 15 * 60 * 1000) } },
});

// Delete used OTPs older than 24 hours (kept until then for audit)
await prisma.otpVerification.deleteMany({
  where: { used: true, usedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
});
```

Retention summary:

- **Active OTPs** — kept until expiry (15 minutes).
- **Used OTPs** — kept 24 hours for audit, then purged.
- **Expired OTPs** — purged on the next cleanup run.

### Monitoring

The same route exposes table statistics via `GET /api/auth/cleanup-otp?stats=true`
(read-only, no deletion), reporting active, used, expired, and total counts for
spotting abuse patterns.

### Test scenarios

```bash
# 1. OTP reuse prevention
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" -d '{"email":"test@example.com"}'

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","otp":"123456"}'

# Re-using the same OTP should now fail ("OTP has already been used")
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test2","email":"test@example.com","password":"password456","otp":"123456"}'

# 2. Multiple active OTP prevention (second request should be rejected)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" -d '{"email":"test2@example.com"}'
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" -d '{"email":"test2@example.com"}'

# 3. Stats / manual cleanup (requires CRON_SECRET)
curl -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/auth/cleanup-otp?stats=true"
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/auth/cleanup-otp
```

## Protected Endpoints

Authentication:

- `POST /api/auth/send-otp` — OTP IP + email rate limiting
- `POST /api/auth/register` — auth rate limiting + OTP verification
- `/api/auth/[...all]` — better-auth credential/social sign-in
- `GET|POST /api/auth/cleanup-otp` — `CRON_SECRET`-guarded cleanup/stats

User management:

- `POST /api/user/change-password` — auth rate limiting + same-origin check
- `POST /api/user/delete-account` — auth rate limiting

## Additional Security Measures

### Input validation

- Zod schemas validate all request bodies (email format, string bounds, OTP
  length, role enum).
- Generic, user-safe error messages; full detail is logged server-side only so
  Prisma schema/constraint internals are not leaked to clients.

### Password handling

- Passwords are hashed with bcrypt (`src/lib/password.ts`) and stored on the
  better-auth credential `Account`, never on `User`.
- A minimum length of 8 characters (max 72) is enforced at registration
  (`register/route.ts`), on password change (`change-password/route.ts`), and in
  the better-auth config (`minPasswordLength: 8`).

### Session management

- better-auth issues database-backed sessions (stored in the `Session` table with a unique token) with a 7-day expiry and a 24-hour sliding refresh window.
- Cookie cache is disabled so role changes take effect immediately for
  role-based access control.
- `BETTER_AUTH_SECRET` is required in production (the app throws at startup if
  it is missing outside the build phase) to prevent session forgery.

### CSRF protection

- State-changing routes reject cross-origin requests via an `isSameOrigin`
  check (`src/lib/csrf.ts`), e.g. on password change.
- better-auth is configured with an explicit `trustedOrigins` allow-list.

## Production Considerations

### Distributed rate limiting

The in-memory store should be replaced with a shared atomic store so limits hold
across serverless instances:

```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
const current = await redis.incr(`rate_limit:${key}`);
// set EXPIRE on first increment
```

### Environment-specific limits

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const maxOTPRequests = isProduction ? 3 : 10;
const maxAuthAttempts = isProduction ? 5 : 20;
```

### Monitoring and alerting

Track rate-limit violations per endpoint, IPs and emails hitting limits, and
authentication failure patterns. Alert on repeated violations from a single IP,
unusual auth-failure bursts, OTP abuse, and registration spam.

## Security Checklist

- [x] OTP rate limiting (IP + email)
- [x] Authentication rate limiting (sign-in, registration, password change, account deletion)
- [x] General API rate limiting
- [x] Proper 429 responses with rate-limit headers
- [x] Secure OTP handling (mark as used instead of delete)
- [x] OTP reuse / single-active-OTP prevention
- [x] OTP attempt limiting (max 5 tries per OTP) with constant-time comparison
- [x] Cryptographically secure OTP generation (`crypto.randomInt`)
- [x] CRON_SECRET-guarded OTP cleanup + stats endpoint
- [x] CSRF defense (same-origin checks + trusted-origins allow-list)
- [x] bcrypt password hashing
- [x] Password minimum length (8 chars) enforced everywhere
- [x] Session secret required in production; immediate role propagation
- [ ] Password complexity rules (uppercase / number / symbol) — only length is enforced today
- [ ] Account lockout after repeated failed *login* attempts (only IP-based auth rate limiting exists today)

## Roadmap

1. **Password complexity** — add uppercase/number/symbol requirements on top of
   the existing 8-character minimum.
2. **Account lockout** — lock an account after repeated failed sign-ins, beyond
   the current IP-based rate limit.
3. **Distributed rate limiting** — move the in-memory limiter to Redis / Vercel
   KV for correctness across serverless instances.

## Security Contact

For security issues or questions:

- **Email**: security@smartstay.com
- **Responsible disclosure**: please report vulnerabilities privately.
- **Response time**: within 24 hours for critical issues.
