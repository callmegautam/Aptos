// 'use client';

// import { useEffect, useMemo, useState, use, Suspense } from 'react';
// import {
//   StreamVideo,
//   StreamCall,
//   SpeakerLayout,
//   CallControls,
//   StreamTheme,
//   ParticipantView,
//   useCallStateHooks
// } from '@stream-io/video-react-sdk';

// import { createVideoClient } from '@/lib/stream/video-client';
// import { joinInterviewCall } from '@/lib/stream/create-call';
// import InterviewChat from '@/features/interview/components/interview-chat';
// import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
// import { RoomProvider } from '@liveblocks/react';
// import CollabEditor from '@/features/interview/components/collab-editor';
// import { useParams, useRouter } from 'next/navigation';

// type JoinResponse =
//   | {
//       role: 'INTERVIEWER';
//       viewerId: number;
//       interviewRoom: { roomCode: string };
//     }
//   | {
//       role: 'CANDIDATE';
//       viewerId: number;
//       interviewRoom: { roomCode: string; resumeUrl?: string | null };
//       needsResumeUpload: boolean;
//       redirectTo: string | null;
//     };

// function VideoLayout() {
//   const { useParticipants } = useCallStateHooks();
//   const participants = useParticipants();

//   const excludeLocalParticipant = participants.length > 1;

//   return (
//     <>
//       <SpeakerLayout
//         participantsBarPosition="bottom"
//         excludeLocalParticipant={excludeLocalParticipant}
//         mirrorLocalParticipantVideo
//       />

//       {excludeLocalParticipant && <FloatingSelfView />}

//       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
//         <CallControls />
//       </div>
//     </>
//   );
// }

// export default function InterviewRoom({ params }: { params: Promise<{ roomId: string }> }) {
//   const { roomId } = use(params);
//   const router = useRouter();

//   const [videoClient, setVideoClient] = useState<any>(null);
//   const [call, setCall] = useState<any>(null);

//   const [chatClient, setChatClient] = useState<any>(null);
//   const [participants, setParticipants] = useState<any>([]);
//   const [channel, setChannel] = useState<any>(null);
//   const [excludeLocalParticipant, setExcludeLocalParticipant] = useState<boolean>(false);
//   const { useLocalParticipant } = useCallStateHooks();
//   const localParticipant = useLocalParticipant();

//   const [joinState, setJoinState] = useState<
//     { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'ok'; join: JoinResponse }
//   >({ kind: 'loading' });

//   const joinUrl = useMemo(
//     () => `/api/interview-rooms/join/${encodeURIComponent(roomId)}`,
//     [roomId]
//   );

//   useEffect(() => {
//     let cancelled = false;

//     async function run() {
//       try {
//         const res = await fetch(joinUrl, { method: 'GET' });
//         const data = (await res.json()) as JoinResponse | { error?: string };

//         if (!res.ok) {
//           if (cancelled) return;
//           const message =
//             data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
//               ? data.error
//               : 'Access denied';
//           setJoinState({ kind: 'error', message });
//           return;
//         }

//         const join = data as JoinResponse;

//         if (join.role === 'CANDIDATE' && join.needsResumeUpload && join.redirectTo) {
//           router.replace(join.redirectTo);
//           return;
//         }

//         if (cancelled) return;
//         setJoinState({ kind: 'ok', join });
//       } catch {
//         if (cancelled) return;
//         setJoinState({ kind: 'error', message: 'Failed to join interview' });
//       }
//     }

//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [joinUrl, router]);

//   useEffect(() => {
//     let cancelled = false;

//     async function init(join: JoinResponse) {
//       const streamUserId =
//         join.role === 'INTERVIEWER' ? `interviewer-${join.viewerId}` : `candidate-${join.viewerId}`;

//       const videoClient = await createVideoClient(
//         streamUserId,
//         join.role === 'INTERVIEWER' ? 'Interviewer' : 'Candidate'
//       );
//       const callInstance = await joinInterviewCall(videoClient, join.interviewRoom.roomCode);

//       if (cancelled) return;
//       setVideoClient(videoClient);
//       setCall(callInstance);
//     }

//     if (joinState.kind === 'ok') {
//       init(joinState.join);
//     }

//     return () => {
//       cancelled = true;
//     };
//   }, [joinState]);

//   if (joinState.kind === 'loading') return <div>Checking access...</div>;
//   if (joinState.kind === 'error')
//     return <div className="p-6 text-red-600">{joinState.message}</div>;
//   if (!videoClient || !call) return <div>Connecting...</div>;
//   // if (!videoClient || !call || !chatClient || !channel) {
//   //   return <div>Connecting...</div>;
//   // }

//   return (
//     <div className="flex flex-row w-full p-4 h-screen">
//       <ResizablePanelGroup orientation="horizontal" className="w-full h-full rounded-lg border">
//         <div className="w-1/2">
//           <ResizablePanelGroup orientation="vertical" className="w-full h-full border">
//             <ResizablePanel className="w-full h-full border">
//               <StreamTheme className="str-video__theme-dark w-full flex flex-col relative">
//                 <StreamVideo client={videoClient}>
//                   <StreamCall call={call}>
//                     {/* <SpeakerLayout
//                       participantsBarPosition="bottom"
//                       excludeLocalParticipant={excludeLocalParticipant}
//                     />
//                     <FloatingSelfView />
//                     <div className="absolute bottom-[-5] left-1/2 -translate-x-1/2 z-10">
//                       <CallControls />
//                     </div> */}
//                     <VideoLayout />
//                   </StreamCall>
//                 </StreamVideo>
//               </StreamTheme>
//             </ResizablePanel>
//             {/* <ResizableHandle withHandle /> */}
//             <ResizablePanel className="w-full h-full" defaultSize="42%">
//               Chat will be here
//               {/* <InterviewChat client={chatClient} channel={channel} /> */}
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </div>
//         <ResizablePanel className="w-1/2">
//           <div className="w-full h-full">
//             <CodingEditor />
//           </div>
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   );
// }

// function CodingEditor() {
//   const params = useParams();
//   const roomId = params.roomId as string;

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <RoomProvider id={roomId}>
//         <CollabEditor />
//       </RoomProvider>
//     </Suspense>
//   );
// }
// function FloatingSelfView() {
//   const { useLocalParticipant } = useCallStateHooks();
//   const localParticipant = useLocalParticipant();

//   if (!localParticipant) return null;

//   return (
//     <div className="absolute bottom-2 right-2 w-40 h-28 rounded-xl overflow-hidden border shadow-xl">
//       <ParticipantView participant={localParticipant} />
//     </div>
//   );
// }

'use client';

import { use, useState } from 'react';
import { useInterviewRoom } from '@/features/interview/hooks/useInterviewRoom';
import VideoPanel from '@/features/interview/components/video-panel';
import ChatPanel from '@/features/interview/components/chat-panel';
import CodeEditor from '@/features/interview/components/code-editor';

type QuestionStatus = 'pending' | 'completed' | 'cancelled';

type TheoryQuestion = {
  id: number;
  text: string;
  marks: string;
  status: QuestionStatus;
};

type PracticalQuestion = {
  id: number;
  text: string;
  status: QuestionStatus;
};

const INTERVIEW_QUESTIONS: { id: number; text: string }[] = [
  { id: 1, text: 'Explain the difference between REST and GraphQL APIs.' },
  { id: 2, text: 'How would you structure a large React application?' },
  { id: 3, text: 'Describe how HTTP caching works in a web app.' },
  { id: 4, text: 'What is the purpose of unit tests and integration tests?' },
  { id: 5, text: 'How do you handle authentication and authorization in a web app?' },
  { id: 6, text: 'Explain the event loop in JavaScript.' },
  { id: 7, text: 'What are common performance bottlenecks in frontend apps?' },
  { id: 8, text: 'How would you design an error-handling strategy for APIs?' },
  { id: 9, text: 'Describe the differences between SQL and NoSQL databases.' },
  { id: 10, text: 'How do you approach debugging a production incident?' }
];

export default function InterviewRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);

  const room = useInterviewRoom(roomId);

  const [activeTab, setActiveTab] = useState<'theory' | 'practical'>('theory');
  const [theoryQuestions, setTheoryQuestions] = useState<TheoryQuestion[]>(
    () =>
      INTERVIEW_QUESTIONS.map((q) => ({
        ...q,
        marks: '',
        status: 'pending'
      })) satisfies TheoryQuestion[]
  );
  const [practicalQuestions, setPracticalQuestions] = useState<PracticalQuestion[]>(
    () =>
      INTERVIEW_QUESTIONS.map((q) => ({
        ...q,
        status: 'pending'
      })) satisfies PracticalQuestion[]
  );
  const [activePracticalId, setActivePracticalId] = useState<number | null>(null);

  function handleTheoryMarksChange(id: number, marks: string) {
    if (Number.isNaN(Number(marks)) || Number(marks) < 0 || Number(marks) > 10) {
      // Still allow editing, just clamp later on complete if needed
    }

    setTheoryQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, marks } : q))
    );
  }

  function handleTheoryStatusChange(id: number, status: QuestionStatus) {
    setTheoryQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  }

  function handleAskPractical(id: number) {
    const question = practicalQuestions.find((q) => q.id === id);
    if (!question) return;

    setActivePracticalId(id);

    // Mark as pending (or keep as-is) when we start asking
    setPracticalQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'pending' } : q))
    );

    const prompt = `// Practical Question ${id}: ${question.text}\n\n`;

    room.socket.emit('code-change', {
      roomId,
      code: prompt
    });
  }

  function handleCompleteFromEditor() {
    if (!activePracticalId) return;

    setPracticalQuestions((prev) =>
      prev.map((q) => (q.id === activePracticalId ? { ...q, status: 'completed' } : q))
    );

    setActivePracticalId(null);
  }

  return (
    <div className="flex h-screen w-full">
      {/* LEFT SIDE */}
      <div className="flex flex-col w-1/2 border-r">
        {/* VIDEO */}
        <div className="h-1/2 border-b p-3">
          <VideoPanel
            localVideoRef={room.localVideoRef as React.RefObject<HTMLVideoElement>}
            remoteStreams={room.remoteStreams}
            isAudioEnabled={room.isAudioEnabled}
            isVideoEnabled={room.isVideoEnabled}
            isScreenSharing={room.isScreenSharing}
            isRecording={room.isRecording}
            recordingUrl={room.recordingUrl}
            toggleMute={room.toggleMute}
            toggleVideo={room.toggleVideo}
            startScreenShare={room.startScreenShare}
            stopScreenShare={room.stopScreenShare}
            startRecording={room.startRecording}
            stopRecording={room.stopRecording}
          />
        </div>

        {/* CHAT */}
        <div className="h-1/2 p-3">
          <ChatPanel messages={room.messages} sendChat={room.sendChat} />
        </div>
      </div>

      {/* CODE EDITOR + QUESTIONS */}
      <div className="w-1/2 flex flex-col">
        <div className="h-1/2 flex flex-col border-b">
          <div className="flex-1">
            <CodeEditor socket={room.socket} roomId={roomId} />
          </div>
          <div className="border-t px-3 py-2 flex items-center justify-between text-xs bg-zinc-950">
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-200">Practical question in editor</span>
              {activePracticalId ? (
                <span className="text-[11px] text-zinc-400">
                  Question {activePracticalId}:{' '}
                  {
                    practicalQuestions.find((q) => q.id === activePracticalId)
                      ?.text
                  }
                </span>
              ) : (
                <span className="text-[11px] text-zinc-500">
                  No active practical question. Use "Ask" from the Practical tab.
                </span>
              )}
            </div>

            <button
              onClick={handleCompleteFromEditor}
              disabled={!activePracticalId}
              className="px-3 py-1 rounded border text-[11px] disabled:opacity-40 disabled:cursor-not-allowed border-emerald-600 text-emerald-100 bg-emerald-900 hover:bg-emerald-800 transition"
            >
              Complete from editor
            </button>
          </div>
        </div>

        <div className="h-1/2 flex flex-col">
          {/* Tabs header */}
          <div className="flex border-b text-sm">
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === 'theory'
                  ? 'bg-zinc-900 text-zinc-100 border-b-2 border-zinc-100'
                  : 'bg-zinc-950 text-zinc-400 border-b border-zinc-800'
              }`}
              onClick={() => setActiveTab('theory')}
            >
              Theory
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === 'practical'
                  ? 'bg-zinc-900 text-zinc-100 border-b-2 border-zinc-100'
                  : 'bg-zinc-950 text-zinc-400 border-b border-zinc-800'
              }`}
              onClick={() => setActiveTab('practical')}
            >
              Practical
            </button>
          </div>

          {/* Tabs content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-zinc-950">
            {activeTab === 'theory' &&
              theoryQuestions.map((q) => (
                <div
                  key={q.id}
                  className="border border-zinc-800 rounded-lg p-3 text-xs sm:text-sm bg-zinc-900/70 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium text-zinc-100">
                      {q.id}. {q.text}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                        q.status === 'completed'
                          ? 'bg-emerald-900 text-emerald-200'
                          : q.status === 'cancelled'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-zinc-300">
                      Marks (0–10):
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={q.marks}
                        onChange={(e) => handleTheoryMarksChange(q.id, e.target.value)}
                        className="ml-2 w-16 rounded border border-zinc-700 bg-zinc-950 px-1 py-0.5 text-[11px] text-zinc-50 outline-none focus:ring-1 focus:ring-zinc-500"
                      />
                    </label>

                    <div className="ml-auto flex gap-1">
                      <button
                        onClick={() => handleTheoryStatusChange(q.id, 'completed')}
                        className="px-2 py-0.5 rounded border border-emerald-700 bg-emerald-900 text-[11px] text-emerald-100 hover:bg-emerald-800 transition"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleTheoryStatusChange(q.id, 'cancelled')}
                        className="px-2 py-0.5 rounded border border-red-700 bg-red-900 text-[11px] text-red-100 hover:bg-red-800 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === 'practical' &&
              practicalQuestions.map((q) => (
                <div
                  key={q.id}
                  className="border border-zinc-800 rounded-lg p-3 text-xs sm:text-sm bg-zinc-900/70 flex items-center gap-3"
                >
                  <div className="flex-1">
                    <div className="font-medium text-zinc-100">
                      {q.id}. {q.text}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400">
                      Status:{' '}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                          q.status === 'completed'
                            ? 'bg-emerald-900 text-emerald-200'
                            : q.status === 'cancelled'
                              ? 'bg-red-900 text-red-200'
                              : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAskPractical(q.id)}
                    className="px-3 py-1 rounded border border-sky-700 bg-sky-900 text-[11px] text-sky-100 hover:bg-sky-800 transition"
                  >
                    Ask
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
