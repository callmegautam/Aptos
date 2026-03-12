import { bigserial, pgTable, text } from 'drizzle-orm/pg-core';

export const platformSettings = pgTable('platform_settings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  companyName: text('company_name').notNull(),
  logoUrl: text('logo_url').notNull()
});

