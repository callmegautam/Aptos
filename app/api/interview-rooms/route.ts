import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';

const statusEnum = z.enum(['created', 'started', 'completed']);

const createRoomSchema = z.object({
  companyId: z.number().int().positive(),
  interviewerId: z.number().int().positive(),
  candidateId: z.number().int().positive(),
  roomCode: z.string().min(1).optional(),
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
  requiredSkills: z.string().min(1),
  resumeUrl: z.string().url().optional().nullable(),
  status: statusEnum.default('created'),
  scheduledAt: z.union([z.string(), z.coerce.date()]),
  durationSeconds: z.number().int().positive()
});

function generateRoomCode(): string {
  const part = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);
  return `ROOM-${part}`;
}

function parseOptionalInt(value: string | null): number | undefined {
  if (value == null || value === '') return undefined;
  const n = parseInt(value, 10);
  return Number.isNaN(n) || n <= 0 ? undefined : n;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = parseOptionalInt(searchParams.get('companyId'));
    const interviewerId = parseOptionalInt(searchParams.get('interviewerId'));
    const candidateId = parseOptionalInt(searchParams.get('candidateId'));
    const statusParam = searchParams.get('status');

    const status = statusParam && statusEnum.safeParse(statusParam).success
      ? (statusParam as 'created' | 'started' | 'completed')
      : undefined;

    const conditions = [
      companyId != null && eq(interviewRooms.companyId, companyId),
      interviewerId != null && eq(interviewRooms.interviewerId, interviewerId),
      candidateId != null && eq(interviewRooms.candidateId, candidateId),
      status != null && eq(interviewRooms.status, status)
    ].filter(Boolean) as ReturnType<typeof eq>[];

    let query = db.select().from(interviewRooms);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    const list = await query.orderBy(desc(interviewRooms.id));

    return NextResponse.json(list, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('List interview rooms error:', error);
    return NextResponse.json(
      { error: 'Failed to list interview rooms' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const {
      companyId,
      interviewerId,
      candidateId,
      jobTitle,
      jobDescription,
      requiredSkills,
      status,
      scheduledAt,
      durationSeconds
    } = parsed.data;

    const roomCode = parsed.data.roomCode ?? generateRoomCode();
    const resumeUrl = parsed.data.resumeUrl ?? null;
    const scheduledAtDate =
      typeof scheduledAt === 'string' ? new Date(scheduledAt) : scheduledAt;

    const [room] = await db
      .insert(interviewRooms)
      .values({
        companyId,
        interviewerId,
        candidateId,
        roomCode,
        jobTitle,
        jobDescription,
        requiredSkills,
        resumeUrl,
        status,
        scheduledAt: scheduledAtDate,
        durationSeconds
      })
      .returning();

    if (!room) {
      return NextResponse.json(
        { error: 'Failed to create interview room' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(room, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Create interview room error:', error);
    return NextResponse.json(
      { error: 'Failed to create interview room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
