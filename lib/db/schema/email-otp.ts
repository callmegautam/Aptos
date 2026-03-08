import { pgTable, timestamp, serial, text } from 'drizzle-orm/pg-core';

export const emailOtps = pgTable('email_otps', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  otp: text('otp').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
