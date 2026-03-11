import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins, companies, candidates, interviewers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { HTTP_STATUS } from '@/types/http';
import { setToken } from '@/lib/auth/jwt';
import { loginSchema, UserRole } from '@/types/auth';

async function findDbUser(email: string, role: UserRole) {
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

    const user = await findDbUser(parsed.data.email, parsed.data.role);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if ('emailVerified' in user && !user.emailVerified) {
      return NextResponse.json({ error: 'Email not verified' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const requestedRole = parsed.data.role;
    const isAdminLogin = requestedRole === 'ADMIN' || requestedRole === 'SUPER_ADMIN';
    const resolvedRole =
      isAdminLogin && 'role' in user ? (user.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN') : requestedRole;

    if (requestedRole === 'SUPER_ADMIN' && (!('role' in user) || user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Super admin access is not available for this account' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    await setToken({
      id: user.id,
      email: user.email,
      role: resolvedRole
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: resolvedRole
        }
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
