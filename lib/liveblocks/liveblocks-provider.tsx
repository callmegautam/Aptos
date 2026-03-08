'use client';

import { LiveblocksProvider } from '@liveblocks/react';
import { liveblocks } from '@/lib/liveblocks/client';

export function LiveblocksRoot({ children }: { children: React.ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
      {children}
    </LiveblocksProvider>
  );
}
