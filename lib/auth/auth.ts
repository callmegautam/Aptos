import { cookies } from 'next/headers';
import { Payload, verifyToken } from '@/lib/auth/jwt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { interviewers } from '../db/schema';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  if (!payload) return null;

  return payload;
}

export async function getCurrentCompany(payload: Payload): Promise<number | null> {
  if (!payload) return null;
  if (payload.role === 'COMPANY') return payload.id;
  if (payload.role === 'INTERVIEWER') {
    const [interviewer] = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.id, payload.id))
      .limit(1);
    return interviewer?.companyId ?? null;
  }
  return null;
}
