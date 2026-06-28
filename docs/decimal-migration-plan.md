# Plan: Migrate money fields from `Float` to `Decimal` (M15)

Status: **APPLIED — merged in commit `efc9f32`** (feat(money): store price/deposit/amount/earnings as Decimal(12,2)). The schema `Decimal(12,2)` fields, the `src/lib/serialize.ts` `decimalToNumber` helper, and the route-level boundary coercion across the money routes are all in place. Retained as an implementation record.
Scope: monetary precision only. Does not change auth, business logic, or API shapes.

---

## Why

`price`, `deposit`, `amount`, `earnings` are `Float` (IEEE-754 / Postgres `double precision`).
The dashboard sums them (`prisma.booking.aggregate({ _sum: { amount } })`) for landlord
earnings, so rounding drift accumulates. Money should be exact decimal.

## The one hard problem: serialization

Prisma returns `Decimal` columns as **`Prisma.Decimal` objects**, and `NextResponse.json()`
serializes those as **strings** (e.g. `"25000"`), not numbers. The frontend assumes `number`:

- `property.price.toLocaleString()` — `ViewPropertyModal.tsx:175,420`, `favorites/page.tsx:582,839,1926`, `listings/page.tsx:527,1633,2663`, `owner-dashboard/page.tsx:2920`
- arithmetic — `favorites/page.tsx:1628` (`reduce((sum,p)=>sum+p.price,0)`), `listings/page.tsx:1211` (`p.price >= priceRange[0]`), `owner-dashboard/page.tsx:719` (`form.price <= 0`)

If we ship Decimal without handling this, `sum + "25000"` becomes string concatenation and
range filters compare numbers to strings — silent, ugly breakage. **The fix is to coerce
Decimal → number at the API boundary so the JSON contract stays numeric** and the frontend
is untouched. (Full INR amounts here are well within `Number.MAX_SAFE_INTEGER`, so converting
to `number` for transport is safe; the DB keeps exact decimal.)

---

## Schema change (`prisma/schema.prisma`)

```prisma
// Property
price    Decimal  @db.Decimal(12, 2)
deposit  Decimal? @db.Decimal(12, 2)
earnings Decimal  @default(0) @db.Decimal(12, 2)

// Booking
amount   Decimal  @db.Decimal(12, 2)
deposit  Decimal? @db.Decimal(12, 2)
```

Leave `latitude`, `longitude`, `bathrooms`, `rating` as `Float` — they are not money and
`bathrooms`/`rating` legitimately need fractions without decimal-exactness requirements.

`Decimal(12,2)` = up to 9,999,999,999.99. Current zod caps (`price` ≤ 1e6, `deposit` ≤ 1e7)
fit comfortably.

## Migration

This repo uses `prisma db push` (no migrations dir). Postgres casts `double precision` →
`numeric(12,2)` automatically, rounding to 2 dp. Steps:

1. `npx prisma migrate dev --name money-to-decimal` (preferred — creates a reviewable SQL
   migration and starts a migrations history), **or** `npx prisma db push` to match current
   workflow.
2. Generated SQL should be plain `ALTER TABLE ... ALTER COLUMN ... TYPE numeric(12,2)`.
   Verify no data loss warning beyond the expected rounding.
3. `npx prisma generate`.

## Code changes (the boundary coercion)

Add a tiny helper and apply it where money is returned or used in arithmetic.

**`src/lib/serialize.ts`** (new):
```ts
import { Prisma } from '@prisma/client'

/** Convert Prisma.Decimal (and nested) to number for JSON responses. */
export function decimalToNumber<T>(value: T): T {
  if (value instanceof Prisma.Decimal) return value.toNumber() as unknown as T
  if (Array.isArray(value)) return value.map(decimalToNumber) as unknown as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = decimalToNumber(v)
    return out as T
  }
  return value
}
```

Apply at each route that returns property/booking objects, wrapping the payload:
`return NextResponse.json(decimalToNumber(property))`.

Routes returning money (from grep):
- `properties/route.ts` (GET list, POST create)
- `properties/[id]/route.ts` (GET, PUT)
- `bookings/route.ts` (GET list, POST), `bookings/[id]/route.ts` (GET, PUT)
- `favorites/route.ts` (GET, POST embed property)
- `search/route.ts` (incl. `_min/_max.price` in `filterOptions`, and `priceRange`)
- `dashboard/analytics/route.ts` (`_sum.amount`, `topProperties.price`, `totalEarnings`)

Server-side arithmetic to update (now operating on Decimal, not number):
- `bookings/route.ts:140-146` — `monthlyPrice * months`. Use
  `new Prisma.Decimal(property.price).mul(months)` and store the Decimal; or compute on
  `.toNumber()` then wrap. Keep `deposit = property.deposit` (already Decimal).
- `dashboard/analytics/route.ts:127,140` — `_sum.amount` is now Decimal; `decimalToNumber`
  before returning. `totalEarnings || 0` → guard null then convert.

Zod schemas stay `z.number()` (clients still send numbers); Prisma accepts `number` for
Decimal inputs, so create/update payloads need no change.

## Verification (requires live DB + app)

1. `prisma migrate` / `db push` on a dev DB seeded with `prisma/seed.ts`.
2. Hit each money route; assert JSON values are **numbers**, not strings
   (`typeof body.price === 'number'`).
3. In the app: listings price display + price-range filter, favorites average tile
   (`favorites/page.tsx:1628`), owner dashboard earnings, a full booking create → confirm
   cycle, and dashboard analytics totals.
4. Confirm `prisma/seed.ts` still runs (it passes JS numbers — fine for Decimal columns).

## Rollback

`Decimal → Float` is a safe widening cast in Postgres; revert schema + `db push`.
Remove the `decimalToNumber` wrappers (they are no-ops on plain numbers anyway, so they can
be left in place safely during rollback).

## Risk / sequencing

- Blast radius: every money-returning route + the 4 frontend arithmetic sites. Boundary
  coercion keeps the JSON contract numeric, so frontend code is **not** edited — that is the
  whole point of the helper.
- Do this **after** PR #2 merges and the auth/booking smoke test passes, on its own branch,
  in a DB-connected session. Not safe to apply blind.
