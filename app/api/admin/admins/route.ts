import { NextResponse } from 'next/server';
import { count, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema/admins';
import { requireAdmin } from '@/lib/auth/admin';
import { hashAdminPassword } from '@/lib/auth/admin';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20', 10)));
    const offset = (page - 1) * limit;

    const [list, totalResult] = await Promise.all([
      db
        .select({
          id: admins.id,
          name: admins.name,
          email: admins.email,
          role: admins.role,
          createdAt: admins.createdAt
        })
        .from(admins)
        .orderBy(desc(admins.id))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(admins)
    ]);

    const total = totalResult[0]?.value ?? 0;
    return NextResponse.json({
      data: list,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  if (auth.payload.role !== 'super') {
    return NextResponse.json({ error: 'Only super admin can create admins' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password, role } = body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'name, email and password required' }, { status: 400 });
    }

    const adminRole = role === 'super' ? 'super' : 'support';

    const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    if (existing) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashAdminPassword(password);

    const [created] = await db
      .insert(admins)
      .values({
        name,
        email,
        passwordHash,
        role: adminRole
      })
      .returning({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        createdAt: admins.createdAt
      });

    if (!created) {
      return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }

    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
