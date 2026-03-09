import { NextResponse } from 'next/server';
import { count, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema/companies';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20', 10)));
    const offset = (page - 1) * limit;

    const [list, totalResult] = await Promise.all([
      db
        .select({
          id: companies.id,
          name: companies.name,
          email: companies.email,
          avatarUrl: companies.avatarUrl
        })
        .from(companies)
        .orderBy(desc(companies.id))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(companies)
    ]);

    const total = totalResult[0]?.value ?? 0;
    return NextResponse.json({
      data: list,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
