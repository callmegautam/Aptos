import { bigserial, boolean, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const adminRoleEnum = pgEnum('admin_role', ['ADMIN', 'SUPER_ADMIN']);

export const admins = pgTable('admins', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  role: adminRoleEnum('role').notNull().default('ADMIN'),

  emailVerified: boolean('email_verified').default(false)
});

