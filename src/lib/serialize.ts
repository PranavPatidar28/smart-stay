import { Prisma } from '@prisma/client'

/**
 * Recursively convert Prisma.Decimal values to plain numbers so API responses
 * serialize money as JSON numbers (not strings, which is how NextResponse.json
 * renders Decimal objects). The frontend types money as `number` and does
 * arithmetic on it, so the JSON contract must stay numeric.
 *
 * Pass-through for plain numbers means this is also safe to call during a
 * Float→Decimal migration window, when some rows may still come back as numbers.
 *
 * Note: INR amounts in this app are well within Number.MAX_SAFE_INTEGER, so the
 * number conversion is lossless for transport. Exact decimal precision is kept
 * in the database.
 */
export function decimalToNumber<T>(value: T): T {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber() as unknown as T
  }
  if (Array.isArray(value)) {
    return value.map((v) => decimalToNumber(v)) as unknown as T
  }
  if (value !== null && typeof value === 'object') {
    // Leave Date and other non-plain objects untouched.
    if (value instanceof Date) return value
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = decimalToNumber(v)
    }
    return out as unknown as T
  }
  return value
}
