import NextAuth from "next-auth/next";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { authRateLimit } from "@/lib/rate-limit";

// Extend the User type to include password
interface UserWithPassword {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: UserRole | null;
  password?: string;
  // Other fields omitted for brevity
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_URL,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    maxTokenAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  // Prevent storing large amounts of data in database
  database: {
    type: "postgresql",
    url: process.env.DATABASE_URL,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          // Don't include image to prevent large sessions
          // image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Apply rate limiting for credentials
        try {
          const rateLimitResult = authRateLimit(req as any);
          if (rateLimitResult) {
            throw new Error('Rate limit exceeded');
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Rate limit exceeded') {
            throw error;
          }
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          }) as UserWithPassword | null;

          if (!user || !user.password) {
            return null;
          }

          const isValid = await verifyPassword(credentials.password, user.password);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role ? user.role.toString() : undefined,
            // Remove image to prevent large session data
            // image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Clean up user data before storing
      if (user) {
        // Only keep essential fields
        const cleanUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        
        // Replace the user object with cleaned version
        Object.assign(user, cleanUser);
        
        // Log user data size for debugging
        if (process.env.NODE_ENV === 'development') {
          const userSize = JSON.stringify(user).length;
          console.log(`User data size after cleanup: ${userSize} bytes`);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Only store essential user data in the JWT token
        token.id = user.id;
        token.role = user.role;
        
        // Log token size for debugging
        if (process.env.NODE_ENV === 'development') {
          const tokenSize = JSON.stringify(token).length;
          console.log(`JWT token size: ${tokenSize} bytes`);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Only include essential user data to minimize session size
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        
        // Remove image completely to reduce session size significantly
        delete session.user.image;
        
        // Remove any other non-essential fields
        if (session.user.emailVerified !== undefined) {
          delete session.user.emailVerified;
        }
        
        // Additional cleanup to prevent large sessions
        Object.keys(session.user).forEach(key => {
          if (!['id', 'email', 'name', 'role'].includes(key)) {
            delete (session.user as any)[key];
          }
        });
        
        // Ensure session only contains essential data
        const essentialSession = {
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
          },
          expires: session.expires,
        };
        
        // Log session size for debugging
        if (process.env.NODE_ENV === 'development') {
          const sessionSize = JSON.stringify(essentialSession).length;
          console.log(`Final session size: ${sessionSize} bytes`);
          
          // Warn if session is still too large
          if (sessionSize > 1000) {
            console.warn(`Session size is still large: ${sessionSize} bytes`);
            console.log('Session content:', JSON.stringify(essentialSession, null, 2));
            
            // Check what's taking up space
            Object.keys(essentialSession).forEach(key => {
              const keySize = JSON.stringify(essentialSession[key as keyof typeof essentialSession]).length;
              if (keySize > 100) {
                console.warn(`Large session key '${key}': ${keySize} bytes`);
              }
            });
          }
        }
        
        return essentialSession;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the user doesn't have a role set, redirect them to role selection
      if (url.startsWith(baseUrl) && !url.includes('/auth/select-role')) {
        // This will be handled by the middleware
        return url;
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };