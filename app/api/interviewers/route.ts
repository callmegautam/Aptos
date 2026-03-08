import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewers, interviewRooms } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { HTTP_STATUS } from '@/types/http';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';

const createInterviewerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().optional().nullable()
});

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function GET(req: Request) {
  try {
    // const { searchParams } = new URL(req.url);
    // const companyIdParam = searchParams.get('companyId');

    // const companyId = companyIdParam ? parseInt(companyIdParam, 10) : undefined;

    // if (companyIdParam && (Number.isNaN(companyId) || companyId <= 0)) {
    //   return NextResponse.json({ error: 'Invalid companyId' }, { status: HTTP_STATUS.BAD_REQUEST });
    // }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value ?? '';
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { id, role } = payload;

    if (role !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const list = await db
      .select()
      .from(interviewers)
      .where(eq(interviewers.companyId, id as number))
      .orderBy(desc(interviewers.id));

    const counts = await db
      .select({
        interviewerId: interviewRooms.interviewerId,
        total: count()
      })
      .from(interviewRooms)
      .groupBy(interviewRooms.interviewerId);

    const countMap = new Map(counts.map((c) => [c.interviewerId, c.total]));

    const data = list.map((i) => {
      const { passwordHash: _, ...rest } = i;
      return {
        ...rest,
        totalInterviews: countMap.get(i.id) ?? 0
      };
    });

    return NextResponse.json(data, { status: HTTP_STATUS.OK });
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
    const body = await req.json();
    const parsed = createInterviewerSchema.safeParse(body);

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

    const [interviewer] = await db
      .insert(interviewers)
      .values({
        name,
        email,
        passwordHash,
        companyId: companyId as number,
        phone: phone ?? null,
        avatarUrl: avatarUrl ?? null
      })
      .returning();

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Failed to create interviewer' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const { passwordHash: _, ...rest } = interviewer;
    return NextResponse.json(rest, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Create interviewer error:', error);
    return NextResponse.json(
      { error: 'Failed to create interviewer' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
