import { bigserial, pgTable, text, bigint, integer, jsonb } from 'drizzle-orm/pg-core';
import { interviewRooms } from './interview-rooms';
import { resumes } from './resumes';

export const resumeAiAnalysis = pgTable('resume_ai_analysis', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  resumeId: bigint('resume_id', { mode: 'number' })
    .references(() => resumes.id, { onDelete: 'cascade' })
    .notNull(),

  theoryScore: integer('theory_score'),
  practicalScore: integer('practical_score'),
  resumeScore: integer('resume_score'),
  overallScore: integer('overall_score'),

  strengths: text('strengths'),

  weaknesses: text('weaknesses'),

  aiSummary: text('ai_summary')
});
