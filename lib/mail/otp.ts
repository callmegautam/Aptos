import { db } from '@/lib/db';
import { candidates, companies, emailOtps } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

export async function verifyOtp(email: string, otp: string) {
  const [record] = await db.select().from(emailOtps).where(eq(emailOtps.email, email)).limit(1);

  console.log('--- record --- ', record);

  if (!record) return false;

  console.log('--- record --- ', record.otp, ',', otp);

  if (record.otp !== otp) return false;

  if (record.expiresAt < new Date()) return false;

  await db.delete(emailOtps).where(eq(emailOtps.email, email));

  // return the user corresponding to this OTP
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.email, email))
    .limit(1);
  const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);

  if (!candidate && !company) return null;

  console.log('--- user --- ', candidate, company);

  if (candidate) {
    return {
      id: candidate.id,
      email: candidate.email,
      name: candidate.name,
      role: 'candidate'
    };
  } else {
    return {
      id: company.id,
      email: company.email,
      name: company.name,
      role: 'company'
    };
  }
}
