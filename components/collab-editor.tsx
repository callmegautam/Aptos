'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom } from '@liveblocks/react';

export default function CollabEditor() {
  const room = useRoom();

  const editorRef = useRef<any>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<any>(null);

  useEffect(() => {
    if (!room) return;

    const ydoc = new Y.Doc();
    const provider = new LiveblocksYjsProvider(room, ydoc);

    ydocRef.current = ydoc;
    providerRef.current = provider;

    provider.on('status', (e: any) => {
      console.log('Liveblocks:', e.status);
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [room]);

  const handleMount = async (editor: any) => {
    editorRef.current = editor;

    const { MonacoBinding } = await import('y-monaco');

    const ydoc = ydocRef.current;
    const provider = providerRef.current;

    if (!ydoc || !provider) return;

    const yText = ydoc.getText('monaco');

    if (yText.length === 0) {
      yText.insert(0, '// Start coding...\n');
    }

    const model = editor.getModel() ?? editor.createModel('', 'javascript');

    new MonacoBinding(yText, model, new Set([editor]), provider.awareness as any);
  };

  return (
    <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" onMount={handleMount} />
  );
}
