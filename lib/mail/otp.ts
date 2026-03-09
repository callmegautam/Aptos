import { db } from '@/lib/db';
import { candidates, companies, interviewers, emailOtps, admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Payload } from '@/lib/auth/jwt';

const OTP_EXPIRY = 5 * 60 * 1000;

export function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function createOtp(email: string) {
  const otp = generateOtp();

  await db.delete(emailOtps).where(eq(emailOtps.email, email));

  await db.insert(emailOtps).values({
    email,
    otp,
    expiresAt: new Date(Date.now() + OTP_EXPIRY)
  });

  return otp;
}

export async function verifyOtp({
  email,
  otp
}: {
  email: string;
  otp: string;
}): Promise<Payload | null> {
  const [record] = await db.select().from(emailOtps).where(eq(emailOtps.email, email)).limit(1);

  if (!record) return null;

  if (record.otp !== otp) return null;

  if (record.expiresAt < new Date()) return null;

  await db.delete(emailOtps).where(eq(emailOtps.email, email));

  // return the user corresponding to this OTP
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.email, email))
    .limit(1);

  if (candidate) {
    return { id: candidate.id, email: candidate.email, role: 'CANDIDATE' };
  }

  const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);

  if (company) {
    return { id: company.id, email: company.email, role: 'COMPANY' };
  }

  const [interviewer] = await db
    .select()
    .from(interviewers)
    .where(eq(interviewers.email, email))
    .limit(1);

  if (interviewer) {
    return { id: interviewer.id, email: interviewer.email, role: 'INTERVIEWER' };
  }

  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

  if (admin) {
    return { id: admin.id, email: admin.email, role: 'ADMIN' };
  }

  return null;
}
