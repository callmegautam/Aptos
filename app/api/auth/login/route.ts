import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, candidates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';
import { signToken } from '@/lib/auth/jwt';
import { COOKIE_OPTIONS } from '@/config/cookies';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  accountType: z.enum(['candidate', 'company'])
});

async function findUser(email: string, accountType: 'candidate' | 'company') {
  if (accountType === 'company') {
    const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);

    return company ?? null;
  }

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.email, email))
    .limit(1);

  return candidate ?? null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, password, accountType } = parsed.data;

    const user = await findUser(email, accountType);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'Email not verified' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: accountType
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, COOKIE_OPTIONS);

    return NextResponse.json(
      {
        message: 'Login successful',
        userId: user.id,
        email: user.email,
        accountType
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Login failed' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
