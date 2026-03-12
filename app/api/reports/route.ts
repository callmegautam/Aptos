import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { interviewReports } from '@/lib/db/schema';
import { HTTP_STATUS } from '@/types/http';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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

    if (user.role === 'INTERVIEWER') {
      const reports = await db.query.interviewReports.findMany({
        where: eq(interviewReports.interviewerId, user.id)
      });
      return NextResponse.json({ reports }, { status: HTTP_STATUS.OK });
    }

    if (user.role === 'COMPANY') {
      const reports = await db.query.interviewReports.findMany({
        where: eq(interviewReports.companyId, companyId)
      });
      return NextResponse.json({ reports }, { status: HTTP_STATUS.OK });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
  } catch (error) {
    console.error('List reports error:', error);
    return NextResponse.json(
      { error: 'Failed to list reports' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
