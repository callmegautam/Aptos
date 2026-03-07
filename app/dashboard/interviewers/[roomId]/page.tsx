'use client';

import { useEffect, useState, use } from 'react';
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme
} from '@stream-io/video-react-sdk';

import { createVideoClient } from '@/lib/stream/video-client';
import { joinInterviewCall } from '@/lib/stream/create-call';

export default function InterviewRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);

  const [client, setClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const userId = 'candidate-' + Math.floor(Math.random() * 1000);

      const videoClient = await createVideoClient(userId);
      const callInstance = await joinInterviewCall(videoClient, roomId);

      setClient(videoClient);
      setCall(callInstance);
    }

    init();
  }, [roomId]);

  if (!client || !call) return <div>Connecting...</div>;

  return (
    <StreamTheme className="str-video__theme-dark h-screen w-full">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <div className="flex h-full flex-col">
            <div className="flex-1">
              <SpeakerLayout />
            </div>

            <div className="p-4  backdrop-blur">
              <CallControls />
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  );
}
