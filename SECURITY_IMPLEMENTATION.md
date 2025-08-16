# Security Implementation Guide

## 🛡️ Rate Limiting Implementation

### Overview
This document outlines the comprehensive rate limiting and security measures implemented in the SmartStay application to prevent brute force attacks, email spam, and system abuse.

## 🔒 Rate Limiting Configuration

### 1. OTP (One-Time Password) Rate Limiting

#### IP-Based Rate Limiting
- **Window**: 15 minutes
- **Limit**: 3 OTP requests per IP address
- **Purpose**: Prevent IP-based OTP spam attacks

#### Email-Based Rate Limiting
- **Window**: 15 minutes  
- **Limit**: 3 OTP requests per email address
- **Purpose**: Prevent email-specific OTP abuse

#### Implementation
```typescript
// IP-based rate limiting
const ipRateLimitResult = otpRateLimit(request);
if (ipRateLimitResult) {
  return ipRateLimitResult;
}

// Email-specific rate limiting
const emailRateLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 OTP requests per 15 minutes per email
  keyGenerator: () => email.toLowerCase().trim(),
});
```

### 2. Authentication Rate Limiting

#### Credentials Authentication
- **Window**: 15 minutes
- **Limit**: 5 authentication attempts per IP address
- **Purpose**: Prevent brute force password attacks

#### Registration
- **Window**: 15 minutes
- **Limit**: 5 registration attempts per IP address
- **Purpose**: Prevent account creation abuse

#### Password Changes
- **Window**: 15 minutes
- **Limit**: 5 password change attempts per IP address
- **Purpose**: Prevent password brute force attacks

#### Account Deletion
- **Window**: 15 minutes
- **Limit**: 5 account deletion attempts per IP address
- **Purpose**: Prevent account deletion abuse

### 3. General API Rate Limiting

#### General Endpoints
- **Window**: 1 minute
- **Limit**: 100 requests per IP address
- **Purpose**: Prevent API abuse and DDoS attacks

## 🚨 Security Headers and Responses

### Rate Limit Exceeded Response
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in X seconds.",
  "retryAfter": 900
}
```

### HTTP Headers
- `Retry-After`: Seconds until rate limit resets
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when rate limit resets

## 🔧 Technical Implementation

### Rate Limiting Store
- **Type**: In-memory Map (development)
- **Production**: Should use Redis or similar distributed store
- **Cleanup**: Automatic cleanup every 5 minutes

### Key Generation
```typescript
// IP-based keys
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIP || req.ip || 'unknown';
}

// Email-based keys
keyGenerator: () => email.toLowerCase().trim()
```

### Middleware Integration
```typescript
// Apply rate limiting before processing request
const rateLimitResult = otpRateLimit(request);
if (rateLimitResult) {
  return rateLimitResult;
}
```

## 📍 Protected Endpoints

### Authentication Endpoints
- `POST /api/auth/send-otp` - OTP rate limiting
- `POST /api/auth/register` - Registration rate limiting
- `POST /api/auth/[...nextauth]` - Credentials rate limiting

### User Management Endpoints
- `POST /api/user/change-password` - Password change rate limiting
- `POST /api/user/delete-account` - Account deletion rate limiting

## 🚀 Production Considerations

### 1. Distributed Rate Limiting
```typescript
// Replace in-memory store with Redis
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Use Redis for rate limiting storage
const rateLimitKey = `rate_limit:${key}`;
const current = await redis.get(rateLimitKey);
```

### 2. Environment-Specific Limits
```typescript
// Production vs Development limits
const isProduction = process.env.NODE_ENV === 'production';
const maxOTPRequests = isProduction ? 3 : 10;
const maxAuthAttempts = isProduction ? 5 : 20;
```

### 3. Monitoring and Alerting
```typescript
// Log rate limit violations
if (current.count >= max) {
  console.warn(`Rate limit exceeded for ${key}`);
  // Send alert to security team
  await notifySecurityTeam(key, current.count, max);
}
```

## 🧪 Testing Rate Limiting

### Test Scenarios
1. **Normal Usage**: Verify requests within limits are processed
2. **Rate Limit Exceeded**: Verify 429 responses with proper headers
3. **Window Reset**: Verify limits reset after time window
4. **Different Keys**: Verify IP and email limits work independently

### Test Commands
```bash
# Test OTP rate limiting
for i in {1..5}; do
  curl -X POST http://localhost:3001/api/auth/send-otp \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
done

# Test authentication rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","password":"password123"}'
done
```

## 🔍 Security Monitoring

### Metrics to Track
- Rate limit violations per endpoint
- IP addresses hitting rate limits
- Email addresses hitting OTP limits
- Authentication failure patterns

### Alerting Rules
- Multiple rate limit violations from same IP
- Unusual authentication failure patterns
- OTP abuse attempts
- Registration spam attempts

## 📚 Additional Security Measures

### 1. Input Validation
- Zod schema validation for all inputs
- Email format validation
- Password strength requirements

### 2. Error Handling
- Generic error messages to prevent information disclosure
- Proper HTTP status codes
- Structured error responses

### 3. Session Management
- JWT-based authentication
- Secure cookie settings
- Session timeout configuration

### 4. Secure OTP Handling
- OTPs marked as used instead of deleted
- Prevention of OTP reuse attacks
- Automatic cleanup of expired and used OTPs
- Security validation and monitoring
- Rate limiting per email and IP address

### 5. CSRF Protection
- Cryptographically secure CSRF tokens (32 bytes)
- Session-bound token validation
- Automatic token expiration (24 hours)
- Form and API route protection
- React hooks and components for easy integration

## 🚨 Security Checklist

- [x] OTP rate limiting (IP + Email)
- [x] Authentication rate limiting
- [x] Registration rate limiting
- [x] Password change rate limiting
- [x] Account deletion rate limiting
- [x] General API rate limiting
- [x] Proper error responses
- [x] Security headers
- [x] Secure OTP handling (mark as used instead of delete)
- [x] CSRF protection (forms and API routes)
- [ ] Stronger password policy (Next: Fix 4)
- [ ] Account lockout mechanism (Next: Fix 6)

## 🔄 Next Steps

1. **Fix 4**: Strengthen password policy (8+ chars, complexity)
2. **Fix 5**: Implement generic error messages
3. **Fix 6**: Add account lockout after failed attempts

## 📞 Security Contact

For security issues or questions:
- **Email**: security@smartstay.com
- **Responsible Disclosure**: Please report vulnerabilities privately
- **Response Time**: Within 24 hours for critical issues
