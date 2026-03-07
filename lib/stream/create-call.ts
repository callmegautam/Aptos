import { StreamVideoClient } from '@stream-io/video-react-sdk';

export async function joinInterviewCall(client: StreamVideoClient, roomId: string) {
  const call = client.call('default', roomId);

  await call.join({
    create: true
  });

  return call;
}
