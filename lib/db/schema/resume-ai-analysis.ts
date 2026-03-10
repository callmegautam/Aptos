import { bigserial, pgTable, text, bigint, integer, jsonb } from 'drizzle-orm/pg-core';
import { interviewRooms } from './interview-rooms';
import { resumes } from './resumes';

export const resumeAiAnalysis = pgTable('resume_ai_analysis', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  roomId: bigint('room_id', { mode: 'number' })
    .references(() => interviewRooms.id, { onDelete: 'cascade' })
    .notNull(),

  resumeId: bigint('resume_id', { mode: 'number' })
    .references(() => resumes.id, { onDelete: 'cascade' })
    .notNull(),

  aiResult: jsonb('ai_result').$type<{
    theoryQuestions: string[];
    practicalQuestions: string[];
    resumeScore: number;
  }>(),

  matchScore: integer('match_score').notNull(),

  strengths: text('strengths').notNull(),

  weaknesses: text('weaknesses').notNull(),

  skillAlignment: text('skill_alignment').notNull()
});
