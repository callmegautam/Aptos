import { StreamChat } from 'stream-chat';

export async function createInterviewChannel(
  client: StreamChat,
  roomId: string,
  members: string[]
) {
  console.log('Creating interview channel for members:', members);

  await fetch('/api/stream-users', {
    method: 'POST',
    body: JSON.stringify({
      users: members.map((id) => ({
        id,
        name: id
      }))
    })
  });

  console.log('Upserted users:', members);

  const channel = client.channel('messaging', roomId, {
    members
  });

  await channel.watch();

  return channel;
}
