import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewers, interviewRooms } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { HTTP_STATUS } from '@/types/http';
import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';
import { createInterviewerSchema } from '@/types/interviewer';
import { savePublicFile } from '@/lib/storage/public-files';

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function GET(_req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (user.role === 'INTERVIEWER') {
      const interviewer = await db.query.interviewers.findFirst({
        where: eq(interviewers.id, user.id)
      });
      if (!interviewer) {
        console.error('Interviewer not found');
        return NextResponse.json(
          { error: 'Interviewer not found' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }
      return NextResponse.json({ interviewers: [interviewer] }, { status: HTTP_STATUS.OK });
    }

    if (user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const list = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.companyId, companyId))
      .orderBy(desc(interviewers.id));

    const counts = await db
      .select({
        interviewerId: interviewRooms.interviewerId,
        total: count()
      })
      .from(interviewRooms)
      .where(eq(interviewRooms.companyId, companyId))
      .groupBy(interviewRooms.interviewerId);

    const countMap = new Map(counts.map((c) => [c.interviewerId, c.total]));

    const data = list.map((i) => {
      const { passwordHash, ...rest } = i;
      void passwordHash;
      return {
        ...rest,
        totalInterviews: countMap.get(i.id) ?? 0
      };
    });

    return NextResponse.json({ interviewers: data }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('List interviewers error:', error);
    return NextResponse.json(
      { error: 'Failed to list interviewers' },
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

    if (user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const contentType = req.headers.get('content-type') ?? '';

    const parseFromJson = async () => {
      const body = await req.json();
      return { parsed: createInterviewerSchema.safeParse(body), avatar: null as File | null };
    };

    const parseFromFormData = async () => {
      const formData = await req.formData();
      const phoneRaw = formData.get('phone');
      const avatarUrlRaw = formData.get('avatarUrl');

      const parsed = createInterviewerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: phoneRaw == null || phoneRaw === '' ? undefined : String(phoneRaw),
        avatarUrl: avatarUrlRaw == null || avatarUrlRaw === '' ? undefined : String(avatarUrlRaw)
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
    const { name, email, password, phone, avatarUrl } = parsed.data;

    const [existing] = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'An interviewer with this email already exists' },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    const passwordHash = await hashPassword(password);

    const storedAvatarUrl =
      avatar != null ? await savePublicFile({ file: avatar, publicSubdir: 'avatars' }) : null;

    const [interviewer] = await db
      .insert(interviewers)
      .values({
        name,
        email,
        passwordHash,
        companyId,
        phone: phone ?? null,
        emailVerified: true,
        avatarUrl: storedAvatarUrl ?? avatarUrl ?? null
      })
      .returning();

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Failed to create interviewer' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const { passwordHash: createdPasswordHash, ...rest } = interviewer;
    void createdPasswordHash;
    return NextResponse.json(rest, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Create interviewer error:', error);
    return NextResponse.json(
      { error: 'Failed to create interviewer' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
