import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema/admins';
import { requireAdmin } from '@/lib/auth/admin';
import { hashAdminPassword } from '@/lib/auth/admin';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid admin id' }, { status: 400 });
  }

  const [admin] = await db
    .select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
      createdAt: admins.createdAt
    })
    .from(admins)
    .where(eq(admins.id, id))
    .limit(1);

  if (!admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  return NextResponse.json(admin);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid admin id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const updates: { name?: string; email?: string; role?: string; passwordHash?: string } = {};
  if (typeof body.name === 'string') updates.name = body.name;
  if (typeof body.email === 'string') updates.email = body.email;
  if (body.role === 'super' || body.role === 'support') updates.role = body.role;
  if (typeof body.password === 'string' && body.password.length >= 8) {
    updates.passwordHash = await hashAdminPassword(body.password);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  if (updates.role === 'super' && auth.payload.role !== 'super') {
    return NextResponse.json({ error: 'Only super admin can assign super role' }, { status: 403 });
  }

  const [updated] = await db
    .update(admins)
    .set(updates)
    .where(eq(admins.id, id))
    .returning({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
      createdAt: admins.createdAt
    });

  if (!updated) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  if (auth.payload.role !== 'super') {
    return NextResponse.json({ error: 'Only super admin can delete admins' }, { status: 403 });
  }

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid admin id' }, { status: 400 });
  }

  if (id === auth.payload.adminId) {
    return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
  }

  const [deleted] = await db
    .delete(admins)
    .where(eq(admins.id, id))
    .returning({ id: admins.id });

  if (!deleted) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
