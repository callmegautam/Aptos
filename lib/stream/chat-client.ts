import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export async function createChatClient(userId: string) {
  const res = await fetch('/api/stream-token', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });

  const { token } = await res.json();

  const client = StreamChat.getInstance(apiKey);

  await client.connectUser(
    {
      id: userId,
      name: userId
    },
    token
  );

  return client;
}
