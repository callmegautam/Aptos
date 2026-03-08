import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates, verificationTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/mail/email';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  accountType: z.enum(['candidate', 'company'])
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, accountType } = parsed.data;

    if (accountType === 'company') {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.email, email))
        .limit(1);

      if (!company) {
        return NextResponse.json({ message: 'If that email exists, we sent a reset link.' });
      }

      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await db.insert(verificationTokens).values({
        companyId: company.id,
        token,
        type: 'password_reset',
        expiresAt
      });

      await sendPasswordResetEmail(email, token);
      return NextResponse.json({ message: 'If that email exists, we sent a reset link.' });
    }

    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);

    if (!candidate) {
      return NextResponse.json({ message: 'If that email exists, we sent a reset link.' });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await db.insert(verificationTokens).values({
      candidateId: candidate.id,
      token,
      type: 'password_reset',
      expiresAt
    });

    await sendPasswordResetEmail(email, token);
    return NextResponse.json({ message: 'If that email exists, we sent a reset link.' });
  } catch (e) {
    console.error('Forgot password error:', e);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
