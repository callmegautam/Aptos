'use client';

import { useEffect, useState, use } from 'react';
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme,
  ParticipantView,
  DefaultParticipantViewUI,
  useCallStateHooks
} from '@stream-io/video-react-sdk';

import { createVideoClient } from '@/lib/stream/video-client';
import { joinInterviewCall } from '@/lib/stream/create-call';
import InterviewChat from '@/components/interview-chat';
import { createChatClient } from '@/lib/stream/chat-client';
import { createInterviewChannel } from '@/lib/stream/create-channel';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

function VideoLayout() {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const excludeLocalParticipant = participants.length > 1;

  return (
    <>
      <SpeakerLayout
        participantsBarPosition="bottom"
        excludeLocalParticipant={excludeLocalParticipant}
      />

      {excludeLocalParticipant && <FloatingSelfView />}

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
        <CallControls />
      </div>
    </>
  );
}

export default function InterviewRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);

  const [videoClient, setVideoClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);

  const [chatClient, setChatClient] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);
  const [channel, setChannel] = useState<any>(null);
  const [excludeLocalParticipant, setExcludeLocalParticipant] = useState<boolean>(false);
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  useEffect(() => {
    async function init() {
      // const userId = 'candidate-' + Math.floor(Math.random() * 1000);
      const userId = 'candidate-123';

      // const userId = 'interviewer-1';

      const videoClient = await createVideoClient(userId);
      const callInstance = await joinInterviewCall(videoClient, roomId);

      // const chatClient = await createChatClient(userId);
      // const channelInstance = await createInterviewChannel(chatClient, roomId, [
      //   'candidate-123',
      //   'interviewer-1'
      // ]);

      setVideoClient(videoClient);
      setCall(callInstance);
      // setChatClient(chatClient);
      // setChannel(channelInstance);
    }

    init();
  }, [roomId]);

  if (!videoClient || !call) return <div>Connecting...</div>;
  // if (!videoClient || !call || !chatClient || !channel) {
  //   return <div>Connecting...</div>;
  // }

  return (
    <div className="flex flex-row w-full p-4 h-screen">
      <ResizablePanelGroup orientation="horizontal" className="w-full h-full rounded-lg border">
        <ResizablePanel className="w-1/2">
          <ResizablePanelGroup orientation="vertical" className="w-full h-full">
            <ResizablePanel className="w-full h-full">
              <StreamTheme className="str-video__theme-dark w-full flex flex-col relative">
                <StreamVideo client={videoClient}>
                  <StreamCall call={call}>
                    {/* <SpeakerLayout
                      participantsBarPosition="bottom"
                      excludeLocalParticipant={excludeLocalParticipant}
                    />
                    <FloatingSelfView />
                    <div className="absolute bottom-[-5] left-1/2 -translate-x-1/2 z-10">
                      <CallControls />
                    </div> */}
                    <VideoLayout />
                  </StreamCall>
                </StreamVideo>
              </StreamTheme>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="w-full h-full">
              Chat will be here
              {/* <InterviewChat client={chatClient} channel={channel} /> */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="w-1/2">
          <div className="w-full h-full">
            <CodingEditor />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function CodingEditor() {
  return (
    <div className="w-full h-full">
      <h1>Coding Editor</h1>
    </div>
  );
}
function FloatingSelfView() {
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  if (!localParticipant) return null;

  return (
    <div className="absolute bottom-2 right-2 w-40 h-28 rounded-xl overflow-hidden border shadow-xl">
      <ParticipantView participant={localParticipant} />
    </div>
  );
}
