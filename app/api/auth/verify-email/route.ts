import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates, verificationTokens } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    const [vt] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, 'email_verification'),
          gt(verificationTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!vt) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    if (vt.companyId != null) {
      await db.update(companies).set({ emailVerified: true }).where(eq(companies.id, vt.companyId));
    } else if (vt.candidateId != null) {
      await db
        .update(candidates)
        .set({ emailVerified: true })
        .where(eq(candidates.id, vt.candidateId));
    }

    await db.delete(verificationTokens).where(eq(verificationTokens.id, vt.id));

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (e) {
    console.error('Verify email error:', e);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
