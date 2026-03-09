import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewers, interviewRooms } from '@/lib/db/schema';
import { eq, count, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { HTTP_STATUS } from '@/types/http';
import { parseId } from '@/utils/parse';
import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';
import { updateInterviewerSchema } from '@/types/interviewer';
import { deletePublicFileByUrl, savePublicFile } from '@/lib/storage/public-files';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if (user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    const interviewerId = parseId(id);

    if (interviewerId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [interviewer] = await db
      .select()
      .from(interviewers)
      .where(and(eq(interviewers.id, interviewerId), eq(interviewers.companyId, companyId)))
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
      .where(
        and(eq(interviewRooms.interviewerId, interviewerId), eq(interviewRooms.companyId, companyId))
      );

    const { passwordHash, ...rest } = interviewer;
    void passwordHash;
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    const interviewerId = parseId(id);

    if (interviewerId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const contentType = req.headers.get('content-type') ?? '';

    const parseFromJson = async () => {
      const body = await req.json();
      return { parsed: updateInterviewerSchema.safeParse(body), avatar: null as File | null };
    };

    const parseFromFormData = async () => {
      const formData = await req.formData();
      const phoneRaw = formData.get('phone');
      const avatarUrlRaw = formData.get('avatarUrl');

      const parsed = updateInterviewerSchema.safeParse({
        name: (formData.get('name') as string | null) ?? undefined,
        email: (formData.get('email') as string | null) ?? undefined,
        password: (formData.get('password') as string | null) ?? undefined,
        phone: phoneRaw == null || phoneRaw === '' ? undefined : String(phoneRaw),
        avatarUrl:
          avatarUrlRaw == null || avatarUrlRaw === ''
            ? undefined
            : String(avatarUrlRaw)
      });

      const avatarValue = formData.get('avatar');
      const avatar = avatarValue instanceof File ? avatarValue : null;
      return { parsed, avatar };
    };

    const { parsed, avatar } = contentType.includes('application/json')
      ? await parseFromJson()
      : await parseFromFormData();

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [existing] = await db
      .select()
      .from(interviewers)
      .where(and(eq(interviewers.id, interviewerId), eq(interviewers.companyId, companyId)))
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

    if (avatar) {
      updates.avatarUrl = await savePublicFile({ file: avatar, publicSubdir: 'avatars' });
    }

    if (Object.keys(updates).length === 0) {
      const { passwordHash, ...rest } = existing;
      void passwordHash;
      return NextResponse.json(rest, { status: HTTP_STATUS.OK });
    }

    const [updated] = await db
      .update(interviewers)
      .set(updates)
      .where(and(eq(interviewers.id, interviewerId), eq(interviewers.companyId, companyId)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update interviewer' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const { passwordHash, ...rest } = updated;
    void passwordHash;
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    const interviewerId = parseId(id);

    if (interviewerId == null) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [existing] = await db
      .select({ avatarUrl: interviewers.avatarUrl })
      .from(interviewers)
      .where(and(eq(interviewers.id, interviewerId), eq(interviewers.companyId, companyId)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const [deleted] = await db
      .delete(interviewers)
      .where(and(eq(interviewers.id, interviewerId), eq(interviewers.companyId, companyId)))
      .returning({ id: interviewers.id });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const avatarUrl = existing.avatarUrl;
    if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.startsWith('/avatars/')) {
      await deletePublicFileByUrl(avatarUrl);
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
