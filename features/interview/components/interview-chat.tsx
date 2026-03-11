'use client';

import { Chat, Channel, MessageList, MessageInput, Window } from 'stream-chat-react';

export default function InterviewChat({ client, channel }: any) {
  if (!client || !channel) return null;

  return (
    <Chat client={client} theme="str-chat__theme-dark">
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
