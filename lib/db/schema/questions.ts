import { bigserial, pgTable, text, bigint, integer } from 'drizzle-orm/pg-core';
import { interviewRooms } from './interview-rooms';
import { questionTypeEnum } from './enums';
import { difficultyEnum } from './enums';

export const questions = pgTable('questions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  roomId: bigint('room_id', { mode: 'number' })
    .references(() => interviewRooms.id, { onDelete: 'cascade' })
    .notNull(),

  type: questionTypeEnum('type').notNull(),

  question: text('question').notNull(),

  difficulty: difficultyEnum('difficulty').notNull(),

  expectedAnswer: text('expected_answer').notNull(),

  marks: integer('marks').notNull()
});
