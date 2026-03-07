'use client';

import { useEffect, useState, use } from 'react';
import { StreamVideo, StreamCall, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';

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
    <div className="str-video__theme-dark">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <SpeakerLayout />
          <CallControls />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
