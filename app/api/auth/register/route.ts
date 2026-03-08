import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates, verificationTokens, emailOtps } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  accountType: z.enum(['candidate', 'company'])
});
const OTP_EXPIRY = 5 * 60 * 1000;
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function createOtp(email: string) {
  const otp = generateOtp();

  await db.delete(emailOtps).where(eq(emailOtps.email, email));

  await db.insert(emailOtps).values({
    email,
    otp,
    expiresAt: new Date(Date.now() + OTP_EXPIRY)
  });

  return otp;
}

function generateToken() {
  return randomBytes(32).toString('hex');
}

async function createVerificationToken(data: { companyId?: number; candidateId?: number }) {
  const token = generateToken();

  await db.insert(verificationTokens).values({
    ...data,
    token,
    type: 'email_verification',
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY)
  });

  return token;
}

async function registerCompany(email: string, password: string, name: string) {
  const [existing] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);

  if (existing) {
    throw new Error('A company with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  const [company] = await db
    .insert(companies)
    .values({
      name,
      email,
      passwordHash,
      emailVerified: false
    })
    .returning();

  if (!company) throw new Error('Failed to create company');

  const token = await createVerificationToken({ companyId: company.id });
  const otp = await createOtp(email);

  return { user: company, otp };

  // return { user: company, token };
}

async function registerCandidate(email: string, password: string, name: string) {
  const [existing] = await db.select().from(candidates).where(eq(candidates.email, email)).limit(1);

  if (existing) {
    throw new Error('A candidate with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  const [candidate] = await db
    .insert(candidates)
    .values({
      name,
      email,
      passwordHash,
      emailVerified: false
    })
    .returning();

  if (!candidate) throw new Error('Failed to create candidate');
  const otp = await createOtp(email);

  return { user: candidate, otp };

  const token = await createVerificationToken({ candidateId: candidate.id });

  return { user: candidate, token };
}

export async function POST(req: Request) {
  try {
    console.log('Register request received');

    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name, accountType } = parsed.data;

    const result =
      accountType === 'company'
        ? await registerCompany(email, password, name)
        : await registerCandidate(email, password, name);

    if (!result.otp) {
      return NextResponse.json({ error: 'Failed to create OTP' }, { status: 500 });
    }

    await sendVerificationEmail(email, result.otp);

    return NextResponse.json({
      message: `${accountType} registered. OTP sent to email.`,
      userId: result.user.id
    });

    // const { url } = await sendVerificationEmail(email, result.token);
    // console.log('Verification email sent to:', email, url);
    // return NextResponse.json({
    //   message: `${accountType} registered. Please verify your email.`,
    //   userId: result.user.id,
    //   ...(process.env.NODE_ENV === 'development' && { verifyUrl: url })
    // });
  } catch (error) {
    console.error('Register error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
