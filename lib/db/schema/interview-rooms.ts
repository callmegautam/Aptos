import { bigserial, pgTable, text, bigint, timestamp, integer } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { interviewers } from './interviewers';
import { candidates } from './candidates';
import { interviewFieldEnum, interviewStatusEnum } from './enums';
import { sql } from 'drizzle-orm';

export const interviewRooms = pgTable('interview_rooms', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  companyId: bigint('company_id', { mode: 'number' })
    .references(() => companies.id, { onDelete: 'cascade' })
    .notNull(),

  interviewerId: bigint('interviewer_id', { mode: 'number' })
    .references(() => interviewers.id, { onDelete: 'cascade' })
    .notNull(),

  candidateId: bigint('candidate_id', { mode: 'number' }).references(() => candidates.id, {
    onDelete: 'cascade'
  }),

  candidateName: text('candidate_name'),

  roomCode: text('room_code').notNull(),

  jobTitle: text('job_title').notNull(),

  jobDescription: text('job_description'),

  resumeUrl: text('resume_url'),

  status: interviewStatusEnum('status').notNull().default('SCHEDULED'),

  field: interviewFieldEnum('field').notNull(),

  scheduledAt: timestamp('scheduled_at').notNull(),

  completedAt: timestamp('completed_at'),

  durationSeconds: integer('duration_seconds')
});
