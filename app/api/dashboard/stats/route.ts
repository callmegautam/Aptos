import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';
import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';

type DashboardStat = {
  label: string;
  value: number;
};

type UpcomingInterview = {
  id: number;
  roomCode: string;
  jobTitle: string;
  candidateName: string | null;
  scheduledAt: string;
  field: string;
  interviewer?: { id: number; name: string; email: string };
};

function getCandidateKey(room: { candidateId: number | null; candidateName: string | null }) {
  if (room.candidateId) return `id:${room.candidateId}`;
  if (room.candidateName?.trim()) return `name:${room.candidateName.trim().toLowerCase()}`;
  return null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if (user.role !== 'COMPANY' && user.role !== 'INTERVIEWER') {
      return NextResponse.json(
        { error: 'Only company or interviewer can access this dashboard' },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    const companyId = await getCurrentCompany(user);
    if (!companyId && user.role === 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const now = new Date();

    if (user.role === 'COMPANY') {
      const rooms = await db.query.interviewRooms.findMany({
        where: eq(interviewRooms.companyId, user.id),
        with: { interviewer: true, candidate: true },
        orderBy: (r, { desc }) => [desc(r.scheduledAt)]
      });

      const uniqueCandidates = new Set<string>();
      const uniqueInterviewers = new Set<number>();
      let totalCompleted = 0;
      let totalScheduled = 0;

      for (const room of rooms) {
        const key = getCandidateKey(room);
        if (key) uniqueCandidates.add(key);
        uniqueInterviewers.add(room.interviewerId);
        if (room.status === 'COMPLETED') totalCompleted += 1;
        if (room.status === 'SCHEDULED') totalScheduled += 1;
      }

      const stats: DashboardStat[] = [
        { label: 'Total candidates', value: uniqueCandidates.size },
        { label: 'Total interviewers', value: uniqueInterviewers.size },
        { label: 'Total interviews', value: rooms.length },
        { label: 'Pending interviews', value: totalScheduled }
      ];

      const upcomingRooms = rooms.filter(
        (r) => r.status === 'SCHEDULED' && new Date(r.scheduledAt) >= now
      );
      upcomingRooms.sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );

      const upcomingInterviews: UpcomingInterview[] = upcomingRooms.map((r) => ({
        id: r.id,
        roomCode: r.roomCode,
        jobTitle: r.jobTitle,
        candidateName: r.candidateName ?? r.candidate?.name ?? null,
        scheduledAt: new Date(r.scheduledAt).toISOString(),
        field: r.field,
        interviewer: r.interviewer
          ? { id: r.interviewer.id, name: r.interviewer.name, email: r.interviewer.email }
          : undefined
      }));

      return NextResponse.json({ stats, upcomingInterviews }, { status: HTTP_STATUS.OK });
    }

    // INTERVIEWER
    const rooms = await db.query.interviewRooms.findMany({
      where: eq(interviewRooms.interviewerId, user.id),
      with: { interviewer: true, candidate: true },
      orderBy: (r, { desc }) => [desc(r.scheduledAt)]
    });

    const uniqueCandidates = new Set<string>();
    let totalCompleted = 0;
    let totalScheduled = 0;

    for (const room of rooms) {
      const key = getCandidateKey(room);
      if (key) uniqueCandidates.add(key);
      if (room.status === 'COMPLETED') totalCompleted += 1;
      if (room.status === 'SCHEDULED') totalScheduled += 1;
    }

    const stats: DashboardStat[] = [
      { label: 'Total candidates', value: uniqueCandidates.size },
      { label: 'Total interviews', value: rooms.length },
      { label: 'Completed interviews', value: totalCompleted },
      { label: 'Scheduled interviews', value: totalScheduled }
    ];

    const upcomingRooms = rooms.filter(
      (r) => r.status === 'SCHEDULED' && new Date(r.scheduledAt) >= now
    );
    upcomingRooms.sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

    const upcomingInterviews: UpcomingInterview[] = upcomingRooms.map((r) => ({
      id: r.id,
      roomCode: r.roomCode,
      jobTitle: r.jobTitle,
      candidateName: r.candidateName ?? r.candidate?.name ?? null,
      scheduledAt: new Date(r.scheduledAt).toISOString(),
      field: r.field
    }));

    return NextResponse.json({ stats, upcomingInterviews }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Dashboard company API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
