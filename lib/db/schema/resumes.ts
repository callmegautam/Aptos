import { bigserial, pgTable, text, bigint } from 'drizzle-orm/pg-core';
import { candidates } from './candidates';
import { uploadedByEnum } from './enums';

export const resumes = pgTable('resumes', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  candidateId: bigint('candidate_id', { mode: 'number' })
    .references(() => candidates.id, { onDelete: 'cascade' })
    .notNull(),

  fileUrl: text('file_url').notNull(),

  parsedText: text('parsed_text').notNull(),

  uploadedBy: uploadedByEnum('uploaded_by').notNull()
});
