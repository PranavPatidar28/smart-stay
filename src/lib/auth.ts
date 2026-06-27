import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Fail fast in production if the auth secret is missing — a missing/derived
// secret would let sessions be forged. Skipped during `next build` (which
// runs with NODE_ENV=production but only collects route data) so the build
// doesn't require deploy-time secrets to be present.
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build" &&
  !process.env.BETTER_AUTH_SECRET
) {
  throw new Error("BETTER_AUTH_SECRET must be set in production");
}

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Origins allowed to drive auth flows (defense-in-depth against CSRF).
const trustedOrigins = [baseURL];
if (process.env.NEXT_PUBLIC_APP_URL) {
  trustedOrigins.push(process.env.NEXT_PUBLIC_APP_URL);
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  baseURL,
  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      verified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours (sliding window)
    // Cookie cache disabled to ensure role changes are reflected immediately
    // This trades some performance for correctness on role-based access control
    cookieCache: {
      enabled: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;