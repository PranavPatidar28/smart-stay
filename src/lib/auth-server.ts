import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Role } from "@/types/role";

/**
 * Get the current session on the server side.
 * Use this in API routes and server components.
 */
export async function getSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session;
}

/**
 * Get the current user from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
    const session = await getSession();
    return session?.user ?? null;
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(role: Role): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === role;
}

/**
 * Check if the current user is a landlord.
 */
export async function isLandlord(): Promise<boolean> {
    return hasRole('LANDLORD');
}

/**
 * Check if the current user is a student.
 */
export async function isStudent(): Promise<boolean> {
    return hasRole('STUDENT');
}

/**
 * Require authentication for an API route.
 * Returns the session or throws an error.
 */
export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}

