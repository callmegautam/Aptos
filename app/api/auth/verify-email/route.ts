import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';
import { verifyOtp } from '@/lib/mail/otp';
import { setToken } from '@/lib/auth/jwt';
import { verifySchema } from '@/types/auth';
import { getUserTable } from '@/utils/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const payload = await verifyOtp({ email: parsed.data.email, otp: parsed.data.otp });

    if (!payload) {
      return NextResponse.json(
        { error: 'OTP is incorrect or expired' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const table = getUserTable(payload.role);

    await db.update(table).set({ emailVerified: true }).where(eq(table.id, payload.id));

    await setToken(payload);

    return NextResponse.json(
      {
        message: 'Email verified successfully',
        user: payload
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Verify email error:', error);

    return NextResponse.json(
      { error: 'Verification failed' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
