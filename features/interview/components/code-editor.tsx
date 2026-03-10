'use client';

import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export default function CodeEditor({ socket, roomId }: any) {
  const editorRef = useRef<any>(null);

  function handleMount(editor: any) {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();

      socket.emit('code-change', {
        roomId,
        code
      });
    });
  }

  useEffect(() => {
    socket.on('code-change', ({ code }: any) => {
      if (!editorRef.current) return;

      const current = editorRef.current.getValue();

      if (current !== code) {
        editorRef.current.setValue(code);
      }
    });
  }, [socket]);

  return (
    <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" onMount={handleMount} />
  );
}
