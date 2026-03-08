import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';

const statusEnum = z.enum(['created', 'started', 'completed']);

const updateRoomSchema = z.object({
  companyId: z.number().int().positive().optional(),
  interviewerId: z.number().int().positive().optional(),
  candidateId: z.number().int().positive().optional(),
  roomCode: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  jobDescription: z.string().min(1).optional(),
  requiredSkills: z.string().min(1).optional(),
  resumeUrl: z.string().url().optional().nullable(),
  status: statusEnum.optional(),
  scheduledAt: z.union([z.string(), z.coerce.date()]).optional(),
  durationSeconds: z.number().int().positive().optional()
});

function parseId(id: string): number | null {
  const n = parseInt(id, 10);
  return Number.isNaN(n) || n <= 0 ? null : n;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomId = parseId(id);

    if (roomId == null) {
      return NextResponse.json(
        { error: 'Invalid id' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [room] = await db
      .select()
      .from(interviewRooms)
      .where(eq(interviewRooms.id, roomId))
      .limit(1);

    if (!room) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(room, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Get interview room error:', error);
    return NextResponse.json(
      { error: 'Failed to get interview room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomId = parseId(id);

    if (roomId == null) {
      return NextResponse.json(
        { error: 'Invalid id' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const body = await req.json();
    const parsed = updateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [existing] = await db
      .select()
      .from(interviewRooms)
      .where(eq(interviewRooms.id, roomId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const updates: Partial<typeof interviewRooms.$inferInsert> = {};

    if (parsed.data.companyId != null) updates.companyId = parsed.data.companyId;
    if (parsed.data.interviewerId != null)
      updates.interviewerId = parsed.data.interviewerId;
    if (parsed.data.candidateId != null)
      updates.candidateId = parsed.data.candidateId;
    if (parsed.data.roomCode != null) updates.roomCode = parsed.data.roomCode;
    if (parsed.data.jobTitle != null) updates.jobTitle = parsed.data.jobTitle;
    if (parsed.data.jobDescription != null)
      updates.jobDescription = parsed.data.jobDescription;
    if (parsed.data.requiredSkills != null)
      updates.requiredSkills = parsed.data.requiredSkills;
    if (parsed.data.resumeUrl !== undefined)
      updates.resumeUrl = parsed.data.resumeUrl;
    if (parsed.data.status != null) updates.status = parsed.data.status;
    if (parsed.data.scheduledAt != null) {
      updates.scheduledAt =
        typeof parsed.data.scheduledAt === 'string'
          ? new Date(parsed.data.scheduledAt)
          : parsed.data.scheduledAt;
    }
    if (parsed.data.durationSeconds != null)
      updates.durationSeconds = parsed.data.durationSeconds;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing, { status: HTTP_STATUS.OK });
    }

    const [updated] = await db
      .update(interviewRooms)
      .set(updates)
      .where(eq(interviewRooms.id, roomId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update interview room' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(updated, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Update interview room error:', error);
    return NextResponse.json(
      { error: 'Failed to update interview room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomId = parseId(id);

    if (roomId == null) {
      return NextResponse.json(
        { error: 'Invalid id' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [deleted] = await db
      .delete(interviewRooms)
      .where(eq(interviewRooms.id, roomId))
      .returning({ id: interviewRooms.id });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete interview room error:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
