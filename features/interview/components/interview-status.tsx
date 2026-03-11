'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type InterviewStatusProps =
  | { type: 'loading'; message?: string }
  | { type: 'error'; message: string };

export default function InterviewStatus(props: InterviewStatusProps) {
  const isLoading = props.type === 'loading';

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <Card className="w-[420px] border-zinc-800 bg-zinc-900 text-zinc-100 shadow-xl">
        <CardHeader className="flex flex-col items-center text-center gap-3">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-red-400" />
          )}

          <CardTitle className="text-lg">
            {isLoading ? 'Joining Interview' : 'Unable to Join Interview'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center text-sm text-zinc-400">
          {isLoading
            ? (props.message ?? 'Checking access and preparing your interview room...')
            : props.message}
        </CardContent>
      </Card>
    </div>
  );
}
