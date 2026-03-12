import { bigserial, integer, pgTable, text, bigint } from 'drizzle-orm/pg-core';
import { interviewRooms } from './interview-rooms';
import { candidates } from './candidates';
import { companies } from './companies';
import { interviewers } from './interviewers';

export const interviewReports = pgTable('interview_reports', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  companyId: bigint('company_id', { mode: 'number' })
    .references(() => companies.id, { onDelete: 'cascade' })
    .notNull(),

  interviewerId: bigint('interviewer_id', { mode: 'number' })
    .references(() => interviewers.id, { onDelete: 'cascade' })
    .notNull(),

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

  aiSummary: text('ai_summary').notNull()
});
