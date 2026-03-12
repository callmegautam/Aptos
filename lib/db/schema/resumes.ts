import { bigserial, pgTable, text, bigint } from 'drizzle-orm/pg-core';
import { candidates } from './candidates';
import { uploadedByEnum } from './enums';
import { companies } from './companies';
import { interviewers } from './interviewers';
import { interviewRooms } from './interview-rooms';

export const resumes = pgTable('resumes', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  candidateId: bigint('candidate_id', { mode: 'number' }).references(() => candidates.id, {
    onDelete: 'cascade'
  }),

  companyId: bigint('company_id', { mode: 'number' }).references(() => companies.id, {
    onDelete: 'cascade'
  }),

  interviewerId: bigint('interviewer_id', { mode: 'number' }).references(() => interviewers.id, {
    onDelete: 'cascade'
  }),

  roomId: bigint('room_id', { mode: 'number' }).references(() => interviewRooms.id, {
    onDelete: 'cascade'
  }),

  fileUrl: text('file_url').notNull(),

  parsedText: text('parsed_text').notNull(),

  uploadedBy: uploadedByEnum('uploaded_by').notNull()
});
