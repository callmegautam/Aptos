import { boolean, pgTable, bigserial, text } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  avatarUrl: text('avatar_url'),

  emailVerified: boolean('email_verified').default(false)
});
