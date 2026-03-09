import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { SignJWT, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const scryptAsync = promisify(scrypt);

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    process.env.JWT_SECRET ||
    'aptos-admin-secret-change-in-production'
);
const SALT_LEN = 16;
const KEY_LEN = 64;
const TOKEN_EXP = '7d';

export type AdminPayload = { adminId: number; email: string; role: string };

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN).toString('hex');
  const key = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  return `${salt}:${key.toString('hex')}`;
}

export async function verifyAdminPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const key = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  const hashBuf = Buffer.from(hash, 'hex');
  return timingSafeEqual(key, hashBuf);
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXP)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.adminId || !payload.email) return null;
    return {
      adminId: Number(payload.adminId),
      email: String(payload.email),
      role: String(payload.role ?? 'support')
    };
  } catch {
    return null;
  }
}

export function getAdminTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

/**
 * Use in admin API routes. Returns admin payload or sends 401 and returns null.
 */
export async function requireAdmin(
  req: Request
): Promise<{ payload: AdminPayload; response: null } | { payload: null; response: NextResponse }> {
  const token = getAdminTokenFromRequest(req);
  if (!token) {
    return {
      payload: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }
  const payload = await verifyAdminToken(token);
  if (!payload) {
    return {
      payload: null,
      response: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    };
  }
  return { payload, response: null };
}
