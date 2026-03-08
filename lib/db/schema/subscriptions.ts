import { bigserial, pgTable, text, bigint } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const subscriptions = pgTable('subscriptions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  companyId: bigint('company_id', { mode: 'number' })
    .references(() => companies.id, { onDelete: 'cascade' })
    .notNull(),

  tier: text('tier').notNull()
});
