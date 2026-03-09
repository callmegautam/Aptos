import { NextResponse } from 'next/server';
import { count, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema/companies';
import { candidates } from '@/lib/db/schema/candidates';
import { interviewers } from '@/lib/db/schema/interviewers';
import { interviewRooms } from '@/lib/db/schema/interview-rooms';
import { interviewReports } from '@/lib/db/schema/interview-reports';
import { subscriptions } from '@/lib/db/schema/subscriptions';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const [
      companiesCount,
      candidatesCount,
      interviewersCount,
      interviewsCount,
      reportsCount,
      subscriptionsCount
    ] = await Promise.all([
      db.select({ value: count() }).from(companies),
      db.select({ value: count() }).from(candidates),
      db.select({ value: count() }).from(interviewers),
      db.select({ value: count() }).from(interviewRooms),
      db.select({ value: count() }).from(interviewReports),
      db.select({ value: count() }).from(subscriptions)
    ]);

    const recentInterviews = await db
      .select()
      .from(interviewRooms)
      .orderBy(desc(interviewRooms.scheduledAt))
      .limit(10);

    const statusBreakdown = await db
      .select({
        status: interviewRooms.status,
        count: count()
      })
      .from(interviewRooms)
      .groupBy(interviewRooms.status);

    return NextResponse.json({
      counts: {
        companies: companiesCount[0]?.value ?? 0,
        candidates: candidatesCount[0]?.value ?? 0,
        interviewers: interviewersCount[0]?.value ?? 0,
        interviews: interviewsCount[0]?.value ?? 0,
        reports: reportsCount[0]?.value ?? 0,
        subscriptions: subscriptionsCount[0]?.value ?? 0
      },
      recentInterviews,
      interviewsByStatus: statusBreakdown.map((r) => ({ status: r.status, count: r.count }))
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
