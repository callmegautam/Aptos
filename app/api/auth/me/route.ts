import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth';
import { getUserTable } from '@/utils/db';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';

export async function GET(req: Request) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const table = getUserTable(payload.role);

    const [user] = await db.select().from(table).where(eq(table.id, payload.id)).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: payload.role,
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Me error:', error);

    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
