import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';
import { createOtp } from '@/lib/mail/otp';
import { sendVerificationEmail } from '@/lib/mail/email';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  accountType: z.enum(['candidate', 'company'])
});

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function registerCompany(email: string, password: string, name: string) {
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

  const otp = await createOtp(email);

  return { user: company, otp, alreadyExists: false };
}

async function registerCandidate(email: string, password: string, name: string) {
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

  return { user: candidate, otp, alreadyExists: false };
}

export async function POST(req: Request) {
  try {
    console.log('Register request received');

    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, password, name, accountType } = parsed.data;

    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.email, email))
      .limit(1);

    if (existingCompany) {
      // throw new Error('A company with this email already exists');
      return NextResponse.json({ error: 'Email already exists' }, { status: HTTP_STATUS.CONFLICT });
    }

    const [existingCandidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);

    if (existingCandidate) {
      return NextResponse.json({ error: 'Email already exists' }, { status: HTTP_STATUS.CONFLICT });
    }

    const result =
      accountType === 'company'
        ? await registerCompany(email, password, name)
        : await registerCandidate(email, password, name);

    if (result.alreadyExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: HTTP_STATUS.CONFLICT });
    }

    if (!result.otp) {
      return NextResponse.json(
        { error: 'Failed to create OTP' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    // TODO: enable email verification
    await sendVerificationEmail(email, result.otp);

    return NextResponse.json(
      {
        message: `OTP sent to email.`,
        userId: result.user.id,
        email: email,
        accountType: accountType
      },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error('Register error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
