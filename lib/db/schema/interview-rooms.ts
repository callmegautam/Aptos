import { bigserial, pgTable, text, bigint, timestamp, integer } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { interviewers } from './interviewers';
import { candidates } from './candidates';
import { interviewStatusEnum } from './enums';

export const interviewRooms = pgTable('interview_rooms', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  companyId: bigint('company_id', { mode: 'number' })
    .references(() => companies.id, { onDelete: 'cascade' })
    .notNull(),

  interviewerId: bigint('interviewer_id', { mode: 'number' })
    .references(() => interviewers.id, { onDelete: 'cascade' })
    .notNull(),

  candidateId: bigint('candidate_id', { mode: 'number' })
    .references(() => candidates.id, { onDelete: 'cascade' })
    .notNull(),

  roomCode: text('room_code').notNull(),

  jobTitle: text('job_title').notNull(),

  jobDescription: text('job_description').notNull(),

  requiredSkills: text('required_skills').notNull(),

  resumeUrl: text('resume_url'),

  status: interviewStatusEnum('status').notNull(),

  scheduledAt: timestamp('scheduled_at').notNull(),

  durationSeconds: integer('duration_seconds').notNull()
});
