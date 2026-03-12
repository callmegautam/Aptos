import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes } from '@/lib/db/schema';
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
    const resumeId = Number(id);

    if (!Number.isInteger(resumeId) || resumeId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [existing] = await db
      .select({ fileUrl: resumes.fileUrl })
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Resume not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const [deleted] = await db
      .delete(resumes)
      .where(eq(resumes.id, resumeId))
      .returning({ id: resumes.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Resume not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    if (existing.fileUrl && existing.fileUrl.startsWith('/resumes/')) {
      await deletePublicFileByUrl(existing.fileUrl);
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete resume (staff) error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

