import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { candidates } from '@/lib/db/schema/candidates';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid candidate id' }, { status: 400 });
  }

  const [candidate] = await db
    .select({
      id: candidates.id,
      name: candidates.name,
      email: candidates.email,
      avatarUrl: candidates.avatarUrl,
      phone: candidates.phone
    })
    .from(candidates)
    .where(eq(candidates.id, id))
    .limit(1);

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  }

  return NextResponse.json(candidate);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid candidate id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const updates: {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    phone?: string | null;
  } = {};
  if (typeof body.name === 'string') updates.name = body.name;
  if (typeof body.email === 'string') updates.email = body.email;
  if (body.avatarUrl !== undefined) updates.avatarUrl = body.avatarUrl ?? null;
  if (body.phone !== undefined) updates.phone = body.phone ?? null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const [updated] = await db
    .update(candidates)
    .set(updates)
    .where(eq(candidates.id, id))
    .returning({
      id: candidates.id,
      name: candidates.name,
      email: candidates.email,
      avatarUrl: candidates.avatarUrl,
      phone: candidates.phone
    });

  if (!updated) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
