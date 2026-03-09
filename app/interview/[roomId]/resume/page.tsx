'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type JoinResponse =
  | {
      role: 'INTERVIEWER';
      viewerId: number;
      interviewRoom: { roomCode: string };
    }
  | {
      role: 'CANDIDATE';
      viewerId: number;
      interviewRoom: { roomCode: string; resumeUrl?: string | null };
      needsResumeUpload: boolean;
      redirectTo: string | null;
    };

export default function ResumeUploadPage() {
  const router = useRouter();
  const params = useParams();
  const code = (params.roomId as string) ?? '';

  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'ready' }
    | { kind: 'uploading' }
    | { kind: 'error'; message: string }
  >({ kind: 'loading' });

  const [file, setFile] = useState<File | null>(null);

  const joinUrl = useMemo(() => `/api/interview-rooms/join/${encodeURIComponent(code)}`, [code]);
  const uploadUrl = useMemo(
    () => `/api/interview-rooms/join/${encodeURIComponent(code)}/resume`,
    [code]
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch(joinUrl, { method: 'GET' });
        const data = (await res.json()) as JoinResponse | { error?: string };

        if (!res.ok) {
          if (cancelled) return;
          const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
              ? data.error
              : 'Access denied';
          setState({ kind: 'error', message });
          return;
        }

        const join = data as JoinResponse;

        if (join.role === 'INTERVIEWER') {
          router.replace(`/interview/${join.interviewRoom.roomCode}`);
          return;
        }

        if (!join.needsResumeUpload) {
          router.replace(`/interview/${join.interviewRoom.roomCode}`);
          return;
        }

        if (cancelled) return;
        setState({ kind: 'ready' });
      } catch {
        if (cancelled) return;
        setState({ kind: 'error', message: 'Failed to verify interview access' });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [joinUrl, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setState({ kind: 'uploading' });

    try {
      const formData = new FormData();
      formData.set('resume', file);

      const res = await fetch(uploadUrl, { method: 'POST', body: formData });
      const data = (await res.json()) as { redirectTo?: string; error?: string };

      if (!res.ok) {
        setState({ kind: 'error', message: data.error ?? 'Upload failed' });
        return;
      }

      router.replace(data.redirectTo ?? `/interview/${encodeURIComponent(code)}`);
    } catch {
      setState({ kind: 'error', message: 'Upload failed' });
    }
  }

  if (state.kind === 'loading') return <div className="p-6">Checking access…</div>;
  if (state.kind === 'error') return <div className="p-6 text-red-600">{state.message}</div>;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Upload your resume</h1>
      <p className="text-sm text-muted-foreground">
        You need to upload a resume before joining this interview.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          type="submit"
          disabled={!file || state.kind === 'uploading'}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {state.kind === 'uploading' ? 'Uploading…' : 'Upload and continue'}
        </button>
      </form>
    </div>
  );
}

