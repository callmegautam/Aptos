import { bigserial, pgTable, bigint, timestamp, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { candidates } from './candidates';

export const tokenTypes = ['email_verification', 'password_reset'] as const;
export type VerificationTokenType = (typeof tokenTypes)[number];

export const verificationTokens = pgTable('verification_tokens', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  companyId: bigint('company_id', { mode: 'number' }).references(() => companies.id, {
    onDelete: 'cascade'
  }),

  candidateId: bigint('candidate_id', { mode: 'number' }).references(() => candidates.id, {
    onDelete: 'cascade'
  }),

  token: varchar('token', { length: 255 }).notNull().unique(),

  type: varchar('type', { length: 32 }).notNull().default('email_verification'),

  expiresAt: timestamp('expires_at').notNull(),

  createdAt: timestamp('created_at').defaultNow()
});
