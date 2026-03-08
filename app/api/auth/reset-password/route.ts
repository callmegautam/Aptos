import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import { createOtp } from '@/lib/mail/otp';
import { sendVerificationEmail } from '@/lib/mail/email';

const resetSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, password } = parsed.data;

    const [company, candidate] = await Promise.all([
      db.select().from(companies).where(eq(companies.email, email)).limit(1),
      db.select().from(candidates).where(eq(candidates.email, email)).limit(1)
    ]);

    const user = company[0] ?? candidate[0];

    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const role = company[0] ? 'company' : 'candidate';

    const passwordHash = await bcrypt.hash(password, 10);

    const table = role === 'company' ? companies : candidates;

    await db.update(table).set({ passwordHash }).where(eq(table.id, user.id));

    return NextResponse.json(
      {
        message: 'Password reset successfully',
        user: { id: user.id, email, role }
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Reset password error:', error);

    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);

    if (!company && !candidate) {
      return NextResponse.json({ error: 'Email not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const otp = await createOtp(email);
    await sendVerificationEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent to email' }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
