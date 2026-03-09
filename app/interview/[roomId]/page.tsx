'use client';

import { useEffect, useMemo, useState, use, Suspense } from 'react';
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme,
  ParticipantView,
  useCallStateHooks
} from '@stream-io/video-react-sdk';

import { createVideoClient } from '@/lib/stream/video-client';
import { joinInterviewCall } from '@/lib/stream/create-call';
import InterviewChat from '@/features/interview/components/interview-chat';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { RoomProvider } from '@liveblocks/react';
import CollabEditor from '@/features/interview/components/collab-editor';
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

function VideoLayout() {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const excludeLocalParticipant = participants.length > 1;

  return (
    <>
      <SpeakerLayout
        participantsBarPosition="bottom"
        excludeLocalParticipant={excludeLocalParticipant}
        mirrorLocalParticipantVideo
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
  const router = useRouter();

  const [videoClient, setVideoClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);

  const [chatClient, setChatClient] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);
  const [channel, setChannel] = useState<any>(null);
  const [excludeLocalParticipant, setExcludeLocalParticipant] = useState<boolean>(false);
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const [joinState, setJoinState] = useState<
    { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'ok'; join: JoinResponse }
  >({ kind: 'loading' });

  const joinUrl = useMemo(
    () => `/api/interview-rooms/join/${encodeURIComponent(roomId)}`,
    [roomId]
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
          setJoinState({ kind: 'error', message });
          return;
        }

        const join = data as JoinResponse;

        if (join.role === 'CANDIDATE' && join.needsResumeUpload && join.redirectTo) {
          router.replace(join.redirectTo);
          return;
        }

        if (cancelled) return;
        setJoinState({ kind: 'ok', join });
      } catch {
        if (cancelled) return;
        setJoinState({ kind: 'error', message: 'Failed to join interview' });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [joinUrl, router]);

  useEffect(() => {
    let cancelled = false;

    async function init(join: JoinResponse) {
      const streamUserId =
        join.role === 'INTERVIEWER' ? `interviewer-${join.viewerId}` : `candidate-${join.viewerId}`;

      const videoClient = await createVideoClient(
        streamUserId,
        join.role === 'INTERVIEWER' ? 'Interviewer' : 'Candidate'
      );
      const callInstance = await joinInterviewCall(videoClient, join.interviewRoom.roomCode);

      if (cancelled) return;
      setVideoClient(videoClient);
      setCall(callInstance);
    }

    if (joinState.kind === 'ok') {
      init(joinState.join);
    }

    return () => {
      cancelled = true;
    };
  }, [joinState]);

  if (joinState.kind === 'loading') return <div>Checking access...</div>;
  if (joinState.kind === 'error')
    return <div className="p-6 text-red-600">{joinState.message}</div>;
  if (!videoClient || !call) return <div>Connecting...</div>;
  // if (!videoClient || !call || !chatClient || !channel) {
  //   return <div>Connecting...</div>;
  // }

  return (
    <div className="flex flex-row w-full p-4 h-screen">
      <ResizablePanelGroup orientation="horizontal" className="w-full h-full rounded-lg border">
        <div className="w-1/2">
          <ResizablePanelGroup orientation="vertical" className="w-full h-full border">
            <ResizablePanel className="w-full h-full border">
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
            {/* <ResizableHandle withHandle /> */}
            <ResizablePanel className="w-full h-full" defaultSize="42%">
              Chat will be here
              {/* <InterviewChat client={chatClient} channel={channel} /> */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
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
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomProvider id={roomId}>
        <CollabEditor />
      </RoomProvider>
    </Suspense>
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
