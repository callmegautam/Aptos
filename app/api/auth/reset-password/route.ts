import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates, verificationTokens } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const schema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8)
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

    const { token, newPassword } = parsed.data;

    const [vt] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, 'password_reset'),
          gt(verificationTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!vt) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (vt.companyId != null) {
      await db.update(companies).set({ passwordHash }).where(eq(companies.id, vt.companyId));
    } else if (vt.candidateId != null) {
      await db.update(candidates).set({ passwordHash }).where(eq(candidates.id, vt.candidateId));
    }

    await db.delete(verificationTokens).where(eq(verificationTokens.id, vt.id));

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (e) {
    console.error('Reset password error:', e);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
