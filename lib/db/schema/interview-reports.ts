import { bigserial, integer, pgTable, text, bigint } from 'drizzle-orm/pg-core';
import { interviewRooms } from './interview-rooms';
import { candidates } from './candidates';
import { hiringRecommendationEnum } from './enums';

export const interviewReports = pgTable('interview_reports', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  roomId: bigint('room_id', { mode: 'number' })
    .references(() => interviewRooms.id)
    .notNull(),

  candidateId: bigint('candidate_id', { mode: 'number' })
    .references(() => candidates.id, { onDelete: 'cascade' })
    .notNull(),

  resumeScore: integer('resume_score').notNull(),

  theoreticalScore: integer('theoretical_score').notNull(),

  practicalScore: integer('practical_score').notNull(),

  overallScore: integer('overall_score').notNull(),

  strengths: text('strengths').notNull(),

  weaknesses: text('weaknesses').notNull(),

  hiringRecommendation: hiringRecommendationEnum('hiring_recommendation').notNull(),

  aiSummary: text('ai_summary').notNull()
});
