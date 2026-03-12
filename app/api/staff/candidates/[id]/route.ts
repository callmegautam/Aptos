import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { candidates, resumes } from '@/lib/db/schema';
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
    const candidateId = Number(id);

    if (!Number.isInteger(candidateId) || candidateId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [existing] = await db
      .select({ avatarUrl: candidates.avatarUrl })
      .from(candidates)
      .where(eq(candidates.id, candidateId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const resumeFiles = await db
      .select({ fileUrl: resumes.fileUrl })
      .from(resumes)
      .where(eq(resumes.candidateId, candidateId));

    for (const row of resumeFiles) {
      if (row.fileUrl && row.fileUrl.startsWith('/resumes/')) {
        await deletePublicFileByUrl(row.fileUrl);
      }
    }

    await db.delete(resumes).where(eq(resumes.candidateId, candidateId));

    const [deleted] = await db
      .delete(candidates)
      .where(eq(candidates.id, candidateId))
      .returning({ id: candidates.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    if (existing.avatarUrl && existing.avatarUrl.startsWith('/avatars/')) {
      await deletePublicFileByUrl(existing.avatarUrl);
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete candidate (staff) error:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

