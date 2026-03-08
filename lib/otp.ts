import { db } from './db';
import { emailOtps } from './db/schema';
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

  if (!record) return false;
  if (record.otp !== otp) return false;
  if (record.expiresAt < new Date()) return false;

  await db.delete(emailOtps).where(eq(emailOtps.email, email));

  return true;
}
