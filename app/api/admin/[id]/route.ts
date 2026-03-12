import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { HTTP_STATUS } from '@/types/http';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getCurrentUser } from '@/lib/auth/auth';
import { isSuperAdminRole } from '@/lib/dashboard/staff';
import { eq } from 'drizzle-orm';

const updateAdminSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).optional()
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const { id } = await context.params;
    const adminId = Number(id);

    if (!Number.isInteger(adminId) || adminId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [admin] = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        emailVerified: admins.emailVerified
      })
      .from(admins)
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json(admin, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { error: 'Failed to get admin' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const { id } = await context.params;
    const adminId = Number(id);

    if (!Number.isInteger(adminId) || adminId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const body = await req.json();
    const parsed = updateAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const updates: Partial<typeof admins.$inferInsert> = {};

    if (parsed.data.name != null) updates.name = parsed.data.name;
    if (parsed.data.email != null) updates.email = parsed.data.email;
    if (parsed.data.role != null) updates.role = parsed.data.role;
    if (parsed.data.password != null) {
      updates.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    }

    if (Object.keys(updates).length === 0) {
      const [existing] = await db
        .select({
          id: admins.id,
          name: admins.name,
          email: admins.email,
          role: admins.role,
          emailVerified: admins.emailVerified
        })
        .from(admins)
        .where(eq(admins.id, adminId))
        .limit(1);

      if (!existing) {
        return NextResponse.json({ error: 'Admin not found' }, { status: HTTP_STATUS.NOT_FOUND });
      }

      return NextResponse.json(existing, { status: HTTP_STATUS.OK });
    }

    if (parsed.data.email != null) {
      const [duplicate] = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.email, parsed.data.email))
        .limit(1);

      if (duplicate && duplicate.id !== adminId) {
        return NextResponse.json(
          { error: 'An admin with this email already exists' },
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    const [updated] = await db
      .update(admins)
      .set(updates)
      .where(eq(admins.id, adminId))
      .returning({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        emailVerified: admins.emailVerified
      });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update admin' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(updated, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json(
      { error: 'Failed to update admin' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const { id } = await context.params;
    const adminId = Number(id);

    if (!Number.isInteger(adminId) || adminId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [deleted] = await db
      .delete(admins)
      .where(eq(admins.id, adminId))
      .returning({ id: admins.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Admin not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
