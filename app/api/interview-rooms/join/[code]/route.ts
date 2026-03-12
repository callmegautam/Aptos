import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms, resumeAiAnalysis, resumes } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';
import { getCurrentUser } from '@/lib/auth/auth';
import { getResumeAnalysis } from '@/lib/ai/ai';

function hasResume(resumeUrl: unknown): resumeUrl is string {
  return typeof resumeUrl === 'string' && resumeUrl.trim().length > 0;
}

export async function GET(_req: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    const roomCode = (code ?? '').trim();

    if (!roomCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const [room] = await db
      .select()
      .from(interviewRooms)
      .where(eq(interviewRooms.roomCode, roomCode))
      .limit(1);

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.roomId, room.id)
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Interview room not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if (user.role === 'INTERVIEWER') {
      if (room.interviewerId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
      }

      // if (resume) {
      //   const isAnalysisCompleted = await db.query.resumeAiAnalysis.findFirst({
      //     where: eq(resumeAiAnalysis.resumeId, resume!.id)
      //   });
      //   if (!isAnalysisCompleted) {
      //     const analysis = await getResumeAnalysis({
      //       resumeText: resume.parsedText,
      //       jobTitle: room.jobTitle,
      //       jobDescription: room.jobDescription ?? ''
      //     });

      //     await db.insert(resumeAiAnalysis).values({
      //       resumeId: resume.id,
      //       theoryScore: 0,
      //       practicalScore: 0,
      //       resumeScore: analysis.resumeScore,
      //       overallScore: 0
      //     });
      //   }
      // }

      return NextResponse.json(
        {
          role: 'INTERVIEWER' as const,
          viewerId: user.id,
          interviewRoom: room
        },
        { status: HTTP_STATUS.OK }
      );
    }

    if (user.role === 'CANDIDATE') {
      if (room.candidateId != null && room.candidateId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
      }

      const needsCandidateIdUpdate = room.candidateId == null;
      const roomAfterCandidateUpdate = needsCandidateIdUpdate
        ? ((
            await db
              .update(interviewRooms)
              .set({ candidateId: user.id })
              .where(and(eq(interviewRooms.id, room.id), isNull(interviewRooms.candidateId)))
              .returning()
          )[0] ?? room)
        : room;

      const resumePresent = hasResume(roomAfterCandidateUpdate.resumeUrl);

      // if (resumePresent) {
      //   const isAnalysisCompleted = await db.query.resumeAiAnalysis.findFirst({
      //     where: eq(resumeAiAnalysis.resumeId, resume!.id)
      //   });
      //   if (isAnalysisCompleted) {
      //     return NextResponse.json(
      //       {
      //         role: 'CANDIDATE' as const,
      //         viewerId: user.id,
      //         interviewRoom: roomAfterCandidateUpdate,
      //         needsResumeUpload: !resumePresent,
      //         redirectTo: resumePresent ? null : `/interview/${roomCode}/resume`
      //       },
      //       { status: HTTP_STATUS.OK }
      //     );
      //   }
      // }

      // if (resume) {
      //   const analysis = await getResumeAnalysis({
      //     resumeText: resume.parsedText,
      //     jobTitle: room.jobTitle,
      //     jobDescription: room.jobDescription ?? ''
      //   });

      //   await db.insert(resumeAiAnalysis).values({
      //     resumeId: resume.id,
      //     theoryScore: 0,
      //     practicalScore: 0,
      //     resumeScore: analysis.resumeScore,
      //     overallScore: 0
      //   });
      // }

      return NextResponse.json(
        {
          role: 'CANDIDATE' as const,
          viewerId: user.id,
          interviewRoom: roomAfterCandidateUpdate,
          needsResumeUpload: !resumePresent,
          redirectTo: resumePresent ? null : `/interview/${roomCode}/resume`
        },
        { status: HTTP_STATUS.OK }
      );
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
  } catch (error) {
    console.error('Join interview error:', error);
    return NextResponse.json(
      { error: 'Failed to join interview' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
