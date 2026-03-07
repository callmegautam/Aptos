import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET!
);

export async function POST(req: Request) {
  const { users } = await req.json();

  await serverClient.upsertUsers(users);

  return NextResponse.json({ success: true });
}
