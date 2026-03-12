import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies, interviewers, interviewRooms, resumes } from '@/lib/db/schema';
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
    const companyId = Number(id);

    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    // Best-effort cleanup of related public files (avatars, resumes)
    const [company] = await db
      .select({ avatarUrl: companies.avatarUrl })
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    if (company.avatarUrl && company.avatarUrl.startsWith('/avatars/')) {
      await deletePublicFileByUrl(company.avatarUrl);
    }

    const interviewerAvatars = await db
      .select({ avatarUrl: interviewers.avatarUrl })
      .from(interviewers)
      .where(eq(interviewers.companyId, companyId));

    for (const row of interviewerAvatars) {
      if (row.avatarUrl && row.avatarUrl.startsWith('/avatars/')) {
        await deletePublicFileByUrl(row.avatarUrl);
      }
    }

    const resumeFiles = await db
      .select({ fileUrl: resumes.fileUrl })
      .from(resumes)
      .where(eq(resumes.companyId, companyId));

    for (const row of resumeFiles) {
      if (row.fileUrl && row.fileUrl.startsWith('/resumes/')) {
        await deletePublicFileByUrl(row.fileUrl);
      }
    }

    await db.delete(interviewRooms).where(eq(interviewRooms.companyId, companyId));
    await db.delete(interviewers).where(eq(interviewers.companyId, companyId));
    await db.delete(resumes).where(eq(resumes.companyId, companyId));
    const [deleted] = await db
      .delete(companies)
      .where(eq(companies.id, companyId))
      .returning({ id: companies.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Company not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    console.error('Delete company (staff) error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

