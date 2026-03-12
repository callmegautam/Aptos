import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  interviewers,
  interviewRooms,
  questions,
  resumeAiAnalysis,
  resumes
} from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';
import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';
import { createRoomSchema, InterviewField, InterviewRoomStatus } from '@/types/interview-room';
import { generateRoomCode } from '@/utils/room-code';
import { savePublicFile } from '@/lib/storage/public-files';
import { extractTextFromBuffer } from '@/lib/pdf/pdf-parser';
import { compressResume, firstNWords, getResumeAnalysis } from '@/lib/ai/ai';
import { uploadedByEnum } from '@/lib/db/schema/enums';
import { storeResume } from '@/lib/ai/resume';

export async function GET(_req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const companyId = await getCurrentCompany(user);

    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const conditions: ReturnType<typeof eq>[] = [];

    if (user.role === 'INTERVIEWER') {
      conditions.push(eq(interviewRooms.interviewerId, user.id));
    }

    if (user.role === 'COMPANY') {
      conditions.push(eq(interviewRooms.companyId, companyId));
    }

    const rooms = await db.query.interviewRooms.findMany({
      where: conditions.length ? and(...conditions) : undefined,

      with: {
        interviewer: true,
        candidate: true
      },

      orderBy: (rooms, { desc }) => [desc(rooms.id)]
    });

    return NextResponse.json(
      {
        rooms,
        total: rooms.length
      },
      { status: HTTP_STATUS.OK }
    );
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
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const companyId = await getCurrentCompany(user);

    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const formData = await req.formData();

    const resumeValue = formData.get('resume');
    const resume = resumeValue instanceof File ? resumeValue : null;

    const parsed = createRoomSchema.safeParse({
      interviewerId: formData.get('interviewerId')
        ? Number(formData.get('interviewerId'))
        : undefined,
      candidateName: formData.get('candidateName'),
      jobTitle: formData.get('jobTitle'),
      jobDescription: formData.get('jobDescription'),
      status: formData.get('status') as InterviewRoomStatus,
      field: formData.get('field') as InterviewField,
      scheduledAt: formData.get('scheduledAt')
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    let resumePath: string | null = null;

    if (resume) {
      resumePath = await savePublicFile({ file: resume, publicSubdir: 'resumes' });
    }

    const roomCode = generateRoomCode();

    const [room] = await db
      .insert(interviewRooms)
      .values({
        companyId,
        interviewerId: parsed.data.interviewerId,
        candidateName: parsed.data.candidateName ?? '',
        roomCode,
        jobTitle: parsed.data.jobTitle,
        jobDescription: parsed.data.jobDescription ?? '',
        resumeUrl: resumePath ?? '',
        status: parsed.data.status,
        field: parsed.data.field,
        scheduledAt: parsed.data.scheduledAt as Date
      })
      .returning();

    if (resume) {
      await storeResume({
        resume,
        fileUrl: resumePath ?? '',
        companyId,
        interviewerId: parsed.data.interviewerId,
        roomId: room.id,
        uploadedBy: user.role as (typeof uploadedByEnum.enumValues)[number],
        parsedTextSize: 500
      });
    }

    const roomWithInterviewer = await db.query.interviewRooms.findFirst({
      where: eq(interviewRooms.id, room.id),
      with: {
        interviewer: true,
        candidate: true
      }
    });

    if (!roomWithInterviewer) {
      return NextResponse.json(
        { error: 'Failed to create interview room' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(
      {
        room: roomWithInterviewer
      },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error('Create interview room error:', error);
    return NextResponse.json(
      { error: 'Failed to create interview room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
