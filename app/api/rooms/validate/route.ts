import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewRooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HTTP_STATUS } from '@/types/http';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const roomCode = typeof body.roomCode === 'string' ? body.roomCode.trim() : '';

    if (!roomCode) {
      return NextResponse.json(
        { valid: false, error: 'roomCode is required' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [room] = await db
      .select({ id: interviewRooms.id })
      .from(interviewRooms)
      .where(eq(interviewRooms.roomCode, roomCode))
      .limit(1);

    if (!room) {
      return NextResponse.json({ valid: false }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({ valid: true }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Room validate error:', error);
    return NextResponse.json(
      { error: 'Failed to validate room' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
