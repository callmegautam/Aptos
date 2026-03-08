import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates, verificationTokens } from '@/lib/db/schema';
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name, accountType } = parsed.data;

    if (accountType === 'company') {
      const [existing] = await db
        .select()
        .from(companies)
        .where(eq(companies.email, email))
        .limit(1);
      if (existing) {
        return NextResponse.json(
          { error: 'A company with this email already exists' },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [company] = await db
        .insert(companies)
        .values({
          name,
          email,
          passwordHash,
          emailVerified: false
        })
        .returning();

      if (!company) {
        return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
      }

      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await db.insert(verificationTokens).values({
        companyId: company.id,
        token,
        type: 'email_verification',
        expiresAt
      });

      const { url } = await sendVerificationEmail(email, token);

      return NextResponse.json({
        message: 'Company registered. Please verify your email.',
        userId: company.id,
        ...(process.env.NODE_ENV === 'development' && { verifyUrl: url })
      });
    }

    // candidate
    const [existing] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: 'A candidate with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [candidate] = await db
      .insert(candidates)
      .values({
        name,
        email,
        passwordHash,
        emailVerified: false
      })
      .returning();

    if (!candidate) {
      return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.insert(verificationTokens).values({
      candidateId: candidate.id,
      token,
      type: 'email_verification',
      expiresAt
    });

    const { url } = await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: 'Candidate registered. Please verify your email.',
      userId: candidate.id,
      ...(process.env.NODE_ENV === 'development' && { verifyUrl: url })
    });
  } catch (e) {
    console.error('Register error:', e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
