import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewers } from '@/lib/db/schema';
import { HTTP_STATUS } from '@/types/http';
import { getCurrentUser } from '@/lib/auth/auth';
import { isStaffRole } from '@/lib/dashboard/staff';
import { eq } from 'drizzle-orm';
import { deletePublicFileByUrl } from '@/lib/storage/public-files';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !isStaffRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const { id } = await context.params;
    const interviewerId = Number(id);

    if (!Number.isInteger(interviewerId) || interviewerId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [existing] = await db
      .select({ avatarUrl: interviewers.avatarUrl })
      .from(interviewers)
      .where(eq(interviewers.id, interviewerId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const [deleted] = await db
      .delete(interviewers)
      .where(eq(interviewers.id, interviewerId))
      .returning({ id: interviewers.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    if (existing.avatarUrl && existing.avatarUrl.startsWith('/avatars/')) {
      await deletePublicFileByUrl(existing.avatarUrl);
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete interviewer (staff) error:', error);
    return NextResponse.json(
      { error: 'Failed to delete interviewer' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

