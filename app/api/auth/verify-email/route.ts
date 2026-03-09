import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';
import { verifyOtp } from '@/lib/mail/otp';
import { signToken } from '@/lib/auth/jwt';
import { COOKIE_OPTIONS } from '@/config/cookies';
import { cookies } from 'next/headers';

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      console.log('-------', body);
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, otp } = parsed.data;

    const otpResult = await verifyOtp(email, otp);

    if (!otpResult) {
      console.log('-------', body);

      return NextResponse.json(
        { error: 'OTP is incorrect or expired' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // check company first
    const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);

    if (company) {
      console.log('---- checkpoint 1------');
      await db.update(companies).set({ emailVerified: true }).where(eq(companies.id, company.id));
      console.log('---- checkpoint 2------');

      const token = await signToken({
        id: company.id,
        email: company.email,
        role: 'COMPANY'
      });

      const cookieStore = await cookies();
      cookieStore.set('token', token, COOKIE_OPTIONS);

      return NextResponse.json(
        {
          message: 'Email verified successfully',
          user: {
            id: company.id,
            email: company.email,
            role: 'company',
            name: company.name
          }
        },
        { status: HTTP_STATUS.OK }
      );
    }

    // check candidate
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);

    if (candidate) {
      await db
        .update(candidates)
        .set({ emailVerified: true })
        .where(eq(candidates.id, candidate.id));

      const token = await signToken({
        id: candidate.id,
        email: candidate.email,
        role: 'CANDIDATE'
      });

      const cookieStore = await cookies();
      cookieStore.set('token', token, COOKIE_OPTIONS);

      return NextResponse.json(
        {
          message: 'Email verified successfully',
          user: {
            id: candidate.id,
            email: candidate.email,
            role: 'candidate',
            name: candidate.name
          }
        },
        { status: HTTP_STATUS.OK }
      );
    }

    return NextResponse.json({ error: 'User not found' }, { status: HTTP_STATUS.NOT_FOUND });
  } catch (error) {
    console.error('Verify email error:', error);

    return NextResponse.json(
      { error: 'Verification failed' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
