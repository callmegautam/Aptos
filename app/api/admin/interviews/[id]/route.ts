import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema/interview-rooms';
import { requireAdmin } from '@/lib/auth/admin';

const ALLOWED_STATUSES = ['created', 'started', 'completed'] as const;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid interview id' }, { status: 400 });
  }

  const [room] = await db
    .select()
    .from(interviewRooms)
    .where(eq(interviewRooms.id, id))
    .limit(1);

  if (!room) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid interview id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const updates: { status?: 'created' | 'started' | 'completed' } = {};
  if (typeof body.status === 'string' && ALLOWED_STATUSES.includes(body.status)) {
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const [updated] = await db
    .update(interviewRooms)
    .set(updates)
    .where(eq(interviewRooms.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
