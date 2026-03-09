import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';
import { getCurrentUser } from '@/lib/auth/auth';
import { savePublicFile } from '@/lib/storage/public-files';

export async function POST(req: Request, { params }: { params: { code: string } }) {
  try {
    const { code } = await params;
    const roomCode = (code ?? '').trim();
    if (!roomCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if (user.role !== 'CANDIDATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const [room] = await db
      .select()
      .from(interviewRooms)
      .where(eq(interviewRooms.roomCode, roomCode))
      .limit(1);

    if (!room) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Ensure candidate binding is correct (or bind if empty).
    if (room.candidateId != null && room.candidateId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const formData = await req.formData();
    const resumeValue = formData.get('resume');
    const resume = resumeValue instanceof File ? resumeValue : null;

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const resumeUrl = await savePublicFile({ file: resume, publicSubdir: 'resumes' });

    const whereCondition =
      room.candidateId == null
        ? and(eq(interviewRooms.id, room.id), isNull(interviewRooms.candidateId))
        : and(eq(interviewRooms.id, room.id), eq(interviewRooms.candidateId, user.id));

    const [updated] = await db
      .update(interviewRooms)
      .set({ candidateId: user.id, resumeUrl })
      .where(whereCondition)
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to upload resume' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(
      {
        interviewRoom: updated,
        resumeUrl,
        redirectTo: `/interview/${roomCode}`
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Upload resume error:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
