import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewers, interviewRooms } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

const updateInterviewerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().max(20).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable()
});

function parseId(id: string): number | null {
  const n = parseInt(id, 10);
  return Number.isNaN(n) || n <= 0 ? null : n;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const cookieStore = await cookies();
    // const token = cookieStore.get('token')?.value ?? '';
    // const payload = await verifyToken(token);

    // if (!payload) {
    //   return NextResponse.json(
    //     { error: 'Invalid or expired token' },
    //     { status: HTTP_STATUS.BAD_REQUEST }
    //   );
    // }

    // const { id: companyId, role } = payload;

    // if (role !== 'company') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    // }

    const { id } = await params;
    const interviewerId = parseId(id);

    if (interviewerId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [interviewer] = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.id, interviewerId))
      .limit(1);

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const [row] = await db
      .select({ total: count() })
      .from(interviewRooms)
      .where(eq(interviewRooms.interviewerId, interviewerId));

    const { passwordHash: _, ...rest } = interviewer;
    return NextResponse.json(
      { ...rest, totalInterviews: row?.total ?? 0 },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Get interviewer error:', error);
    return NextResponse.json(
      { error: 'Failed to get interviewer' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value ?? '';
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { id: companyId, role } = payload;

    if (role !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    const interviewerId = parseId(id);

    if (interviewerId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const body = await req.json();
    const parsed = updateInterviewerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [existing] = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.id, interviewerId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const updates: Partial<typeof interviewers.$inferInsert> = {};

    if (parsed.data.name != null) updates.name = parsed.data.name;
    if (parsed.data.email != null) {
      const [duplicate] = await db
        .select()
        .from(interviewers)
        .where(eq(interviewers.email, parsed.data.email))
        .limit(1);
      if (duplicate && duplicate.id !== interviewerId) {
        return NextResponse.json(
          { error: 'An interviewer with this email already exists' },
          { status: HTTP_STATUS.CONFLICT }
        );
      }
      updates.email = parsed.data.email;
    }
    if (parsed.data.password != null) {
      updates.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    }
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
    if (parsed.data.avatarUrl !== undefined) updates.avatarUrl = parsed.data.avatarUrl;

    if (Object.keys(updates).length === 0) {
      const { passwordHash: _, ...rest } = existing;
      return NextResponse.json(rest, { status: HTTP_STATUS.OK });
    }

    const [updated] = await db
      .update(interviewers)
      .set(updates)
      .where(eq(interviewers.id, interviewerId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update interviewer' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const { passwordHash: _, ...rest } = updated;
    return NextResponse.json(rest, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Update interviewer error:', error);
    return NextResponse.json(
      { error: 'Failed to update interviewer' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value ?? '';
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { id: companyId, role } = payload;

    if (role !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    const interviewerId = parseId(id);

    if (interviewerId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [deleted] = await db
      .delete(interviewers)
      .where(eq(interviewers.id, interviewerId))
      .returning({ id: interviewers.id });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete interviewer error:', error);
    return NextResponse.json(
      { error: 'Failed to delete interviewer' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
