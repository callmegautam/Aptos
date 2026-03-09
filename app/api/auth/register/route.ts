import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { HTTP_STATUS } from '@/types/http';
import { createOtp } from '@/lib/mail/otp';
import { sendVerificationEmail } from '@/lib/mail/email';
import { registerSchema } from '@/types/auth';
import { getCurrentUserByEmail } from '@/lib/auth/auth';
import { getUserTable } from '@/utils/db';

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
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const user = await getCurrentUserByEmail(parsed.data.email);

    if (user) {
      return NextResponse.json({ error: 'Email already exists' }, { status: HTTP_STATUS.CONFLICT });
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const table = getUserTable(parsed.data.role);

    const [result] = await db
      .insert(table)
      .values({
        email: parsed.data.email,
        name: parsed.data.name,
        emailVerified: false,
        passwordHash: await hashPassword(parsed.data.password)
      })
      .returning();

    const otp = await createOtp(parsed.data.email);
    await sendVerificationEmail(parsed.data.email, otp);

    return NextResponse.json(
      {
        message: `OTP sent to email.`,
        user: {
          id: result.id,
          email: result.email,
          role: parsed.data.role
        },
        otp
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
