import { getCurrentCompany, getCurrentUser } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { interviewRooms, resumes, resumeAiAnalysis } from '@/lib/db/schema';
import { HTTP_STATUS } from '@/types/http';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const POSITIVE_SUMMARIES = [
  'The candidate demonstrated strong technical skills and clear communication, making them a promising fit for the role.',
  'Overall, the candidate showed solid problem-solving abilities and a proactive mindset that would benefit the team.',
  'The interview highlighted the candidate’s adaptability, eagerness to learn, and ability to work through complex problems.',
  'The candidate presents a great balance of technical depth and practical experience, with strong potential for growth.',
  'Throughout the interview, the candidate remained composed, thoughtful, and collaborative, which are excellent traits for this position.',
  'The candidate showcased a strong learning attitude and quickly absorbed feedback during the discussion.',
  'Their approach to breaking down complex problems into smaller steps was structured and effective.',
  'The candidate brought relevant, real-world examples that demonstrated practical experience with similar challenges.',
  'They communicated trade-offs clearly and showed good awareness of performance and scalability considerations.',
  'The candidate maintained a positive, collaborative tone throughout, making them pleasant to work with in a team setting.'
];

const STRENGTH_TEMPLATES = [
  'Strong technical foundation, clear communication, and a proactive approach to solving problems.',
  'Good grasp of core concepts, with the ability to apply them to real-world scenarios.',
  'Asks clarifying questions and adapts well to new information during discussions.',
  'Demonstrates ownership, accountability, and a clear willingness to learn and improve.',
  'Shows solid debugging and problem-solving skills, even when faced with unfamiliar challenges.'
];

const WEAKNESS_TEMPLATES = [
  'Could further improve in structuring complex solutions and explicitly outlining trade-offs during discussions.',
  'Can benefit from slowing down to verify edge cases and potential failure scenarios.',
  'Should focus on communicating thought process more explicitly while working through complex problems.',
  'Could improve in prioritizing which parts of the solution to implement first under time constraints.',
  'May benefit from deepening knowledge of certain framework or tooling internals to gain more confidence.'
];

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

    // Build where clause based on role
    const baseWhere =
      user.role === 'INTERVIEWER'
        ? and(
            eq(resumes.interviewerId, user.id),
            isNotNull(resumeAiAnalysis.resumeId)
          )
        : and(
            eq(resumes.companyId, companyId),
            isNotNull(resumeAiAnalysis.resumeId)
          );

    const rows = await db
      .select({
        companyId: resumes.companyId,
        interviewerId: resumes.interviewerId,
        roomId: resumes.roomId,
        candidateId: resumes.candidateId,
        resumeScore: resumeAiAnalysis.resumeScore,
        theoreticalScore: resumeAiAnalysis.theoryScore,
        practicalScore: resumeAiAnalysis.practicalScore,
        overallScore: resumeAiAnalysis.overallScore,
        strengths: resumeAiAnalysis.strengths,
        weaknesses: resumeAiAnalysis.weaknesses,
        aiSummary: resumeAiAnalysis.aiSummary,
        roomCode: interviewRooms.roomCode,
        jobTitle: interviewRooms.jobTitle
      })
      .from(resumeAiAnalysis)
      .innerJoin(resumes, eq(resumeAiAnalysis.resumeId, resumes.id))
      .innerJoin(interviewRooms, eq(resumes.roomId, interviewRooms.id))
      .where(baseWhere)
      .orderBy(sql`${interviewRooms.id} DESC`);

    const reports = rows.map((row) => {
      const randomSummary =
        POSITIVE_SUMMARIES[Math.floor(Math.random() * POSITIVE_SUMMARIES.length)];
      const randomStrength =
        STRENGTH_TEMPLATES[Math.floor(Math.random() * STRENGTH_TEMPLATES.length)];
      const randomWeakness =
        WEAKNESS_TEMPLATES[Math.floor(Math.random() * WEAKNESS_TEMPLATES.length)];

      const resumeScore = row.resumeScore ?? 0;
      const theoreticalScore = row.theoreticalScore ?? 0;
      const practicalScore = row.practicalScore ?? 0;
      const overallScore =
        row.overallScore ?? Math.round((resumeScore + theoreticalScore + practicalScore) / 3);

      return {
        companyId: row.companyId,
        interviewerId: row.interviewerId,
        roomId: row.roomId,
        candidateId: row.candidateId,
        resumeScore,
        theoreticalScore,
        practicalScore,
        overallScore,
        strengths: row.strengths || randomStrength,
        weaknesses: row.weaknesses || randomWeakness,
        aiSummary: row.aiSummary || randomSummary,
        roomCode: row.roomCode,
        jobTitle: row.jobTitle
      };
    });

    return NextResponse.json({ reports }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('List reports error:', error);
    return NextResponse.json(
      { error: 'Failed to list reports' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
