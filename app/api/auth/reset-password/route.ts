import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { HTTP_STATUS } from '@/types/http';
import { createOtp } from '@/lib/mail/otp';
import { sendVerificationEmail } from '@/lib/mail/email';
import { resetPasswordSchema } from '@/types/auth';
import { getCurrentUserByEmail } from '@/lib/auth/auth';
import { getUserTable } from '@/utils/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const payload = await getCurrentUserByEmail(parsed.data.email);

    if (!payload) {
      return NextResponse.json({ error: 'Email not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const table = getUserTable(payload.role);

    await db.update(table).set({ passwordHash }).where(eq(table.id, payload.id));

    return NextResponse.json(
      {
        message: 'Password reset successfully',
        user: payload
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

    const payload = await getCurrentUserByEmail(email);

    if (!payload) {
      return NextResponse.json({ error: 'Email not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const otp = await createOtp(payload.email);
    await sendVerificationEmail(payload.email, otp);

    return NextResponse.json({ message: 'OTP sent to email' }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
