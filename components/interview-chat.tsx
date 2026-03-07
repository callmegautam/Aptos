'use client';

import { Chat, Channel, MessageList, MessageInput, Window } from 'stream-chat-react';

export default function InterviewChat({ client, channel }: any) {
  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
