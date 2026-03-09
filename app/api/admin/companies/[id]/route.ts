import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema/companies';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid company id' }, { status: 400 });
  }

  const [company] = await db.select().from(companies).where(eq(companies.id, id)).limit(1);

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: company.id,
    name: company.name,
    email: company.email,
    avatarUrl: company.avatarUrl
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid company id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const updates: { name?: string; email?: string; avatarUrl?: string | null } = {};
  if (typeof body.name === 'string') updates.name = body.name;
  if (typeof body.email === 'string') updates.email = body.email;
  if (body.avatarUrl !== undefined) updates.avatarUrl = body.avatarUrl ?? null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const [updated] = await db
    .update(companies)
    .set(updates)
    .where(eq(companies.id, id))
    .returning({
      id: companies.id,
      name: companies.name,
      email: companies.email,
      avatarUrl: companies.avatarUrl
    });

  if (!updated) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
