import { getResumeAnalysis } from '@/lib/ai/ai';
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
      console.error('Room not found', roomCode);
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.roomId, room.id)
    });

    if (!resume) {
      console.error('Resume not found', roomCode);
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const [isQuestionGenerated] = await db
      .select()
      .from(questions)
      .where(eq(questions.resumeId, resume.id))
      .limit(1);
    if (!isQuestionGenerated) {
      const analysis = await getResumeAnalysis({
        resumeText: resume.parsedText,
        jobTitle: room.jobTitle,
        jobDescription: room.jobDescription ?? ''
      });

      const [question] = await db
        .insert(questions)
        .values({
          resumeId: resume.id,
          aiResult: {
            theoryQuestions: analysis.theoryQuestions,
            practicalQuestions: analysis.practicalQuestions
          }
        })
        .returning();

      await db.insert(resumeAiAnalysis).values({
        resumeId: resume.id,
        theoryScore: 0,
        practicalScore: 0,
        resumeScore: analysis.resumeScore,
        overallScore: 0
      });

      return NextResponse.json(question.aiResult, { status: HTTP_STATUS.OK });
    }

    return NextResponse.json(isQuestionGenerated.aiResult, { status: HTTP_STATUS.OK });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get questions' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};

export const POST = async (req: Request, context: { params: Promise<{ roomCode: string }> }) => {
  try {
    const { roomCode } = await context.params;

    const room = await db.query.interviewRooms.findFirst({
      where: eq(interviewRooms.roomCode, roomCode)
    });

    if (!room) {
      console.error('Room not found', roomCode);
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.roomId, room.id)
    });

    if (!resume) {
      console.error('Resume not found', roomCode);
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const body = await req.json();

    const marks = Number(body.marks);

    const [result] = await db
      .select()
      .from(resumeAiAnalysis)
      .where(eq(resumeAiAnalysis.resumeId, resume.id))
      .limit(1);

    if (!result) {
      console.error('Result not found', roomCode);
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    await db
      .update(resumeAiAnalysis)
      .set({
        theoryScore: (result.theoryScore || 0) + marks
      })
      .where(eq(resumeAiAnalysis.resumeId, resume.id));

    return NextResponse.json({ message: 'Result saved' }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Failed to save result:', error);
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};
