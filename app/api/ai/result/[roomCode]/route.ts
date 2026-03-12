import { getResult, getResumeAnalysis } from '@/lib/ai/ai';
import { db } from '@/lib/db';
import { interviewRooms, resumes, questions, resumeAiAnalysis } from '@/lib/db/schema';
import { HTTP_STATUS } from '@/types/http';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, context: { params: Promise<{ roomCode: string }> }) => {
  try {
    const { roomCode } = await context.params;

    const room = await db.query.interviewRooms.findFirst({
      where: eq(interviewRooms.roomCode, roomCode)
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.roomId, room.id)
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const question = await db.query.questions.findFirst({
      where: eq(questions.resumeId, resume.id)
    });

    if (!question) {
      return NextResponse.json({ error: 'Questions not found' }, { status: 404 });
    }

    const result = await getResult({
      practicalQuestions: question?.aiResult?.practicalQuestions ?? [],
      practicalAnswers: []
    });

    const resultDb = await db.query.resumeAiAnalysis.findFirst({
      where: eq(resumeAiAnalysis.resumeId, resume.id)
    });

    if (!resultDb) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const overallScore =
      (resultDb.theoryScore || 0) + (result || 0) + (resultDb.resumeScore || 0) / 3;

    await db
      .update(resumeAiAnalysis)
      .set({
        practicalScore: result,
        overallScore: overallScore
      })
      .where(eq(resumeAiAnalysis.resumeId, resume.id));

    return NextResponse.json({ message: 'Result saved' }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get questions' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};
