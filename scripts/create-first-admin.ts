/**
 * One-off script to create the first super admin.
 * Run: npx tsx scripts/create-first-admin.ts
 * Requires: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME env vars and DATABASE_URL.
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { admins } from '../lib/db/schema/admins';
import { hashAdminPassword } from '../lib/auth/admin';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Super Admin';

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD env vars');
    process.exit(1);
  }

  const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (existing.length > 0) {
    console.log('Admin already exists for', email);
    return;
  }

  const passwordHash = await hashAdminPassword(password);
  await db.insert(admins).values({
    name,
    email,
    passwordHash,
    role: 'super'
  });
  console.log('Super admin created for', email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
