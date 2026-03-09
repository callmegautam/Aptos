import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';
import { parseId } from '@/utils/parse';
import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';
import { updateInterviewRoomSchema } from '@/types/interview-room';
import { deletePublicFileByUrl, savePublicFile } from '@/lib/storage/public-files';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const roomId = parseId(id);

    if (roomId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const whereCondition =
      user.role === 'COMPANY'
        ? and(eq(interviewRooms.id, roomId), eq(interviewRooms.companyId, companyId))
        : user.role === 'INTERVIEWER'
          ? and(eq(interviewRooms.id, roomId), eq(interviewRooms.interviewerId, user.id))
          : null;

    if (!whereCondition) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const room = await db.query.interviewRooms.findFirst({
      where: whereCondition,
      with: {
        interviewer: true,
        candidate: true
      }
    });

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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const roomId = parseId(id);

    if (roomId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const whereCondition =
      user.role === 'COMPANY'
        ? and(eq(interviewRooms.id, roomId), eq(interviewRooms.companyId, companyId))
        : user.role === 'INTERVIEWER'
          ? and(eq(interviewRooms.id, roomId), eq(interviewRooms.interviewerId, user.id))
          : null;

    if (!whereCondition) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const contentType = req.headers.get('content-type') ?? '';

    const parseFromJson = async () => {
      const body = await req.json();
      return updateInterviewRoomSchema.safeParse(body);
    };

    const parseFromFormData = async () => {
      const formData = await req.formData();

      const interviewerIdRaw = formData.get('interviewerId');
      const durationSecondsRaw = formData.get('durationSeconds');

      const parsed = updateInterviewRoomSchema.safeParse({
        interviewerId:
          interviewerIdRaw == null || interviewerIdRaw === ''
            ? undefined
            : Number(interviewerIdRaw),
        candidateName: (formData.get('candidateName') as string | null) ?? undefined,
        jobTitle: (formData.get('jobTitle') as string | null) ?? undefined,
        jobDescription: (formData.get('jobDescription') as string | null) ?? undefined,
        resumeUrl: (formData.get('resumeUrl') as string | null) ?? undefined,
        status: (formData.get('status') as string | null) ?? undefined,
        field: (formData.get('field') as string | null) ?? undefined,
        scheduledAt: (formData.get('scheduledAt') as string | null) ?? undefined,
        completedAt: (formData.get('completedAt') as string | null) ?? undefined,
        durationSeconds:
          durationSecondsRaw == null || durationSecondsRaw === ''
            ? undefined
            : Number(durationSecondsRaw)
      });

      const resumeValue = formData.get('resume');
      const resume = resumeValue instanceof File ? resumeValue : null;

      return { parsed, resume };
    };

    const isJson = contentType.includes('application/json');

    const jsonParsed = isJson ? await parseFromJson() : null;
    const { parsed, resume } = isJson
      ? { parsed: jsonParsed!, resume: null as File | null }
      : await parseFromFormData();

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [existing] = await db.select().from(interviewRooms).where(whereCondition).limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const updates: Partial<typeof interviewRooms.$inferInsert> = {};

    if (parsed.data.interviewerId != null) updates.interviewerId = parsed.data.interviewerId;
    if (parsed.data.candidateName != null) updates.candidateName = parsed.data.candidateName;
    if (parsed.data.jobTitle != null) updates.jobTitle = parsed.data.jobTitle;
    if (parsed.data.jobDescription != null) updates.jobDescription = parsed.data.jobDescription;
    if (parsed.data.field != null) updates.field = parsed.data.field;
    if (parsed.data.resumeUrl !== undefined) updates.resumeUrl = parsed.data.resumeUrl;
    if (parsed.data.status != null) updates.status = parsed.data.status;
    if (parsed.data.scheduledAt != null) {
      updates.scheduledAt =
        typeof parsed.data.scheduledAt === 'string'
          ? new Date(parsed.data.scheduledAt)
          : parsed.data.scheduledAt;
    }
    // if (parsed.data.completedAt != null) {
    //   updates.completedAt =
    //     typeof parsed.data.completedAt === 'string'
    //       ? new Date(parsed.data.completedAt)
    //       : parsed.data.completedAt;
    // }
    // if (parsed.data.durationSeconds != null) updates.durationSeconds = parsed.data.durationSeconds;

    if (resume) {
      updates.resumeUrl = await savePublicFile({ file: resume, publicSubdir: 'resumes' });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing, { status: HTTP_STATUS.OK });
    }

    const [updated] = await db
      .update(interviewRooms)
      .set(updates)
      .where(whereCondition)
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update interview room' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const room = await db.query.interviewRooms.findFirst({
      where: whereCondition,
      with: {
        interviewer: true,
        candidate: true
      }
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Failed to update interview room' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(room, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Update interview room error:', error);
    return NextResponse.json(
      { error: 'Failed to update interview room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const roomId = parseId(id);

    if (roomId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const whereCondition =
      user.role === 'COMPANY'
        ? and(eq(interviewRooms.id, roomId), eq(interviewRooms.companyId, companyId))
        : user.role === 'INTERVIEWER'
          ? and(eq(interviewRooms.id, roomId), eq(interviewRooms.interviewerId, user.id))
          : null;

    if (!whereCondition) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const [existing] = await db
      .select({ resumeUrl: interviewRooms.resumeUrl })
      .from(interviewRooms)
      .where(whereCondition)
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const [deleted] = await db
      .delete(interviewRooms)
      .where(whereCondition)
      .returning({ id: interviewRooms.id });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const resumeUrl = existing.resumeUrl;
    if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.startsWith('/resumes/')) {
      await deletePublicFileByUrl(resumeUrl);
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
