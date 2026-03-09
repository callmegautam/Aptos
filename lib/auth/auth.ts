import { cookies } from 'next/headers';
import { Payload, verifyToken } from '@/lib/auth/jwt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { companies, admins, candidates, interviewers } from '../db/schema';

export async function getCurrentUser(): Promise<Payload | null> {
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

export async function getCurrentUserByEmail(email: string): Promise<Payload | null> {
  const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);
  if (company) return { id: company.id, email, role: 'COMPANY' };
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.email, email))
    .limit(1);
  if (candidate) return { id: candidate.id, email, role: 'CANDIDATE' };
  const [interviewer] = await db
    .select()
    .from(interviewers)
    .where(eq(interviewers.email, email))
    .limit(1);
  if (interviewer) return { id: interviewer.id, email, role: 'INTERVIEWER' };
  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (admin) return { id: admin.id, email, role: 'ADMIN' };
  return null;
}
