/**
 * SmartStay Role System
 * Centralized type definitions for user roles
 */

// Role type - the only two roles in the system
export type Role = 'STUDENT' | 'LANDLORD';

// All valid roles as an array (useful for validation)
export const VALID_ROLES: readonly Role[] = ['STUDENT', 'LANDLORD'] as const;

// Role metadata for UI display
export const ROLES = {
    STUDENT: {
        label: 'Student',
        description: 'Browse and book accommodations near your university',
        icon: 'GraduationCap',
    },
    LANDLORD: {
        label: 'Property Owner',
        description: 'List and manage your properties for student rental',
        icon: 'Building',
    },
} as const satisfies Record<Role, { label: string; description: string; icon: string }>;

/**
 * Type guard to check if a value is a valid Role
 */
export function isValidRole(value: unknown): value is Role {
    return typeof value === 'string' && VALID_ROLES.includes(value as Role);
}

/**
 * Default role for new users who haven't selected a role yet
 */
export const DEFAULT_ROLE: Role = 'STUDENT';

/**
 * Get role label for display
 */
export function getRoleLabel(role: Role | null | undefined): string {
    if (!role || !isValidRole(role)) return 'Unknown';
    return ROLES[role].label;
}

/**
 * Get role description for display
 */
export function getRoleDescription(role: Role | null | undefined): string {
    if (!role || !isValidRole(role)) return '';
    return ROLES[role].description;
}
