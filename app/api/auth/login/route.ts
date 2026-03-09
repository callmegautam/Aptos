import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins, companies, candidates, interviewers } from '@/lib/db/schema';
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
  role: z.enum(['CANDIDATE', 'COMPANY', 'INTERVIEWER', 'ADMIN', 'SUPER_ADMIN'])
});

type DbLoginRole = 'CANDIDATE' | 'COMPANY' | 'INTERVIEWER' | 'ADMIN' | 'SUPER_ADMIN';

async function findDbUser(email: string, role: DbLoginRole) {
  if (role === 'COMPANY') {
    const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);
    return company ?? null;
  }

  if (role === 'CANDIDATE') {
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);

    return candidate ?? null;
  }

  if (role === 'INTERVIEWER') {
    const [interviewer] = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.email, email))
      .limit(1);

    return interviewer ?? null;
  }

  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  return admin ?? null;
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

    const { email, password, role } = parsed.data;

    const user = await findDbUser(email, role);

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

    if ('emailVerified' in user && !user.emailVerified) {
      return NextResponse.json(
        { error: 'Email not verified' },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, COOKIE_OPTIONS);

    return NextResponse.json(
      {
        message: 'Login successful',
        userId: user.id,
        email: user.email,
          role
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
