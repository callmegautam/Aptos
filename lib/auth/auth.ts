import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  if (!payload) return null;

  return payload;
}
