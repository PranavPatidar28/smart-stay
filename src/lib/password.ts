import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    // 12 rounds — matches prisma/seed.ts and is a sensible 2026 default. bcrypt
    // hashes are self-describing, so existing 10-round hashes still verify fine.
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
