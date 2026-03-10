export default function VideoPanel({ localVideoRef, remoteStreams }: any) {
  return (
    <div className="grid grid-cols-2 gap-2 h-full">
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
  );
}
