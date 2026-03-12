import { HTTP_STATUS } from '@/types/http';
import { StreamClient } from '@stream-io/node-sdk';
import { NextResponse } from 'next/server';

const client = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET!
);

export async function POST(req: Request) {
  const { userId, name } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: HTTP_STATUS.BAD_REQUEST });
  }

  await client.upsertUsers([
    {
      id: userId,
      name: name
    }
  ]);

  const token = client.createToken(userId);

  return NextResponse.json({ token }, { status: HTTP_STATUS.OK });
}
