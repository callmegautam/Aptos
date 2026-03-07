import { bigserial, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const candidates = pgTable('candidates', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  avatarUrl: text('avatar_url'),

  phone: varchar('phone', { length: 20 })
});
