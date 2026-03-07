import { StreamVideoClient } from '@stream-io/video-react-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export async function createVideoClient(userId: string) {
  const res = await fetch('/api/stream-token', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });

  const { token } = await res.json();

  const client = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: 'Interviewer'
    },
    token
  });

  return client;
}
