import { bigserial, pgTable, text, varchar, bigint } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const interviewers = pgTable('interviewers', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  avatarUrl: text('avatar_url'),

  phone: varchar('phone', { length: 20 }),

  companyId: bigint('company_id', { mode: 'number' })
    .references(() => companies.id)
    .notNull()
});
