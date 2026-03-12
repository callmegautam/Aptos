import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { HTTP_STATUS } from '@/types/http';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getCurrentUser } from '@/lib/auth/auth';
import { isSuperAdminRole } from '@/lib/dashboard/staff';
import { eq } from 'drizzle-orm';

const createAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).default('ADMIN')
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const list = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        emailVerified: admins.emailVerified
      })
      .from(admins)
      .orderBy(admins.id);

    return NextResponse.json(list, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('List admins error:', error);
    return NextResponse.json(
      { error: 'Failed to list admins' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const body = await req.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { name, email, password, role } = parsed.data;

    const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    if (existing) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(admins)
      .values({
        name,
        email,
        passwordHash,
        role,
        emailVerified: false
      })
      .returning({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        emailVerified: admins.emailVerified
      });

    if (!created) {
      return NextResponse.json(
        { error: 'Failed to create admin' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(created, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

