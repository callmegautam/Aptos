import { bigserial, pgTable, text, bigint, integer, jsonb } from 'drizzle-orm/pg-core';
import { interviewRooms } from './interview-rooms';
import { questionTypeEnum } from './enums';
import { difficultyEnum } from './enums';
import { resumes } from './resumes';

export const questions = pgTable('questions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  resumeId: bigint('resume_id', { mode: 'number' })
    .references(() => resumes.id, { onDelete: 'cascade' })
    .notNull(),

  aiResult: jsonb('ai_result').$type<{
    theoryQuestions: string[];
    practicalQuestions: string[];
  }>()
});
