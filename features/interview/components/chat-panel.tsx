'use client';

import { useState } from 'react';

export default function ChatPanel({ messages, sendChat }: any) {
  const [input, setInput] = useState('');

  function send() {
    if (!input.trim()) return;

    sendChat(input);
    setInput('');
  }

  return (
    <div className="flex flex-col h-full">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((m: any, i: number) => (
          <div key={i} className="text-sm bg-zinc-800 rounded p-2">
            <b>{m.name ?? 'User'}:</b> {m.message}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="message..."
        />

        <button onClick={send} className="bg-black text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
