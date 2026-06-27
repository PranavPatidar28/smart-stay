import { NextRequest } from 'next/server';

/**
 * Lightweight same-origin check for custom state-changing API routes.
 *
 * better-auth protects its own endpoints, but our hand-rolled mutating routes
 * (change-password, delete-account, etc.) authenticate purely from the session
 * cookie. SameSite=Lax cookies block classic cross-site form CSRF, but as
 * defense-in-depth we also verify the request Origin/Referer matches an allowed
 * origin. Returns true when the request may proceed.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Build the set of allowed origins from configured env + the request host.
  const allowed = new Set<string>();
  if (process.env.BETTER_AUTH_URL) allowed.add(process.env.BETTER_AUTH_URL);
  if (process.env.NEXT_PUBLIC_APP_URL) allowed.add(process.env.NEXT_PUBLIC_APP_URL);

  // Derive the current origin from forwarded headers (works behind Vercel proxy).
  const host = request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  if (host) allowed.add(`${proto}://${host}`);

  const candidate = origin || (referer ? safeOrigin(referer) : null);

  // If neither Origin nor Referer is present we cannot verify; be strict and reject.
  if (!candidate) return false;

  return allowed.has(candidate);
}

function safeOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
