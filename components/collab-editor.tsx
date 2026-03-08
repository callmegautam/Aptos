'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom } from '@liveblocks/react';

export default function CollabEditor() {
  const room = useRoom();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const yDoc = new Y.Doc();

    const provider = new LiveblocksYjsProvider(room, yDoc);

    const yText = yDoc.getText('monaco');

    const MonacoBinding = require('y-monaco').MonacoBinding;

    if (editorRef.current) {
      const model = editorRef.current.getModel();

      new MonacoBinding(yText, model, new Set([editorRef.current]), provider.awareness);
    }

    return () => {
      provider.destroy();
      yDoc.destroy();
    };
  }, [room]);

  return (
    <Editor
      height="600px"
      defaultLanguage="javascript"
      theme="vs-dark"
      onMount={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
}
