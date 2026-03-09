import { bigserial, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  role: text('role').notNull().default('support'), // 'super' | 'support'

  createdAt: timestamp('created_at').notNull().defaultNow()
});
