import { StreamChat } from 'stream-chat';

export async function createInterviewChannel(
  client: StreamChat,
  roomId: string,
  members: string[]
) {
  const channel = client.channel('messaging', roomId, {
    members
  });

  await channel.watch();

  return channel;
}
