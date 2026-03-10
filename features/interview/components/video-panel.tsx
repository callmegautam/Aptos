type VideoPanelProps = {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteStreams: any[];
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  recordingUrl: string | null;
  toggleMute: () => void;
  toggleVideo: () => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  startRecording: () => void;
  stopRecording: () => void;
};

export default function VideoPanel({
  localVideoRef,
  remoteStreams,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isRecording,
  recordingUrl,
  toggleMute,
  toggleVideo,
  startScreenShare,
  stopScreenShare,
  startRecording,
  stopRecording
}: VideoPanelProps) {
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="grid grid-cols-2 gap-2 flex-1">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full bg-black rounded"
        />

        {remoteStreams.map((s: any) => (
          <video
            key={s.id}
            ref={(ref) => {
              if (ref) ref.srcObject = s.stream;
            }}
            autoPlay
            playsInline
            className="w-full h-full bg-black rounded"
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            className="px-3 py-1 rounded bg-zinc-900 text-white border border-zinc-700"
          >
            {isAudioEnabled ? 'Mute' : 'Unmute'}
          </button>

          <button
            onClick={toggleVideo}
            className="px-3 py-1 rounded bg-zinc-900 text-white border border-zinc-700"
          >
            {isVideoEnabled ? 'Stop Video' : 'Start Video'}
          </button>

          {!isScreenSharing ? (
            <button
              onClick={startScreenShare}
              className="px-3 py-1 rounded bg-zinc-900 text-white border border-zinc-700"
            >
              Share Screen
            </button>
          ) : (
            <button
              onClick={stopScreenShare}
              className="px-3 py-1 rounded bg-zinc-900 text-white border border-zinc-700"
            >
              Stop Share
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-3 py-1 rounded bg-red-600 text-white border border-red-800"
            >
              Record
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-3 py-1 rounded bg-red-900 text-white border border-red-800"
            >
              Stop Recording
            </button>
          )}

          {recordingUrl && (
            <a
              href={recordingUrl}
              download="interview-recording.webm"
              className="px-3 py-1 rounded bg-zinc-800 text-white border border-zinc-700"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
