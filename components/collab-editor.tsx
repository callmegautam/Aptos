'use client';

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom } from '@liveblocks/react';

export default function CollabEditor() {
  const room = useRoom();
  const editorRef = useRef<any>(null);

  const handleMount = (editor: any) => {
    editorRef.current = editor;

    const ydoc = new Y.Doc();
    const provider = new LiveblocksYjsProvider(room, ydoc);
    const yText = ydoc.getText('monaco');

    const model = editor.getModel();

    new MonacoBinding(yText, model, new Set([editor]), provider.awareness as any);
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// Start coding..."
      theme="vs-dark"
      onMount={handleMount}
    />
  );
}
