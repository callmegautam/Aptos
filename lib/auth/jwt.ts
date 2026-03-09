import { COOKIE_OPTIONS } from '@/config/cookies';
import { UserRole } from '@/types/auth';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type Payload = {
  id: number;
  email: string;
  role: UserRole;
};

export async function signToken(payload: Payload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string): Promise<Payload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Payload;
  } catch {
    return null;
  }
}

export async function setToken(payload: Payload): Promise<void> {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set('token', token, COOKIE_OPTIONS);
}
