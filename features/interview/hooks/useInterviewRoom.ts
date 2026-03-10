'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/realtime/socket';

export function useInterviewRoom(roomId: string) {
  const socket = getSocket();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);

  const [remoteStreams, setRemoteStreams] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket.emit('join-room', roomId);
    }

    init();

    function createPeer(userId: string) {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
      });

      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      pc.ontrack = (e) => {
        const stream = e.streams[0];

        setRemoteStreams((prev) => {
          if (prev.find((s) => s.id === userId)) return prev;
          return [...prev, { id: userId, stream }];
        });
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit('ice-candidate', {
            target: userId,
            candidate: e.candidate
          });
        }
      };

      peersRef.current.set(userId, pc);
      return pc;
    }

    socket.on('all-users', async (users: string[]) => {
      for (const userId of users) {
        const pc = createPeer(userId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('offer', { target: userId, sdp: offer });
      }
    });

    socket.on('offer', async ({ from, sdp }) => {
      const pc = createPeer(from);

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer', { target: from, sdp: answer });
    });

    socket.on('answer', async ({ from, sdp }) => {
      const pc = peersRef.current.get(from);
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on('ice-candidate', async ({ from, candidate }) => {
      const pc = peersRef.current.get(from);
      if (!pc) return;

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, { ...msg, fromSelf: false }]);
    });

    return () => {
      socket.off('all-users');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('chat-message');

      // Stop local media
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;

      // Stop screen share stream
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;

      // Stop recording if still running
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Close peer connections
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
    };
  }, [roomId, socket]);

  function sendChat(message: string) {
    if (!message.trim()) return;

    const localMsg = {
      from: 'local',
      name: 'You',
      message
    };

    // Show immediately in local UI
    setMessages((prev) => [...prev, { ...localMsg, fromSelf: true }]);

    // Send to others in the room
    socket.emit('chat-message', { roomId, message, name: 'User' });
  }

  function sendEditorChange(code: string) {
    socket.emit('code-change', { roomId, code });
  }

  function toggleMute() {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) return;

    const enabled = !audioTracks[0].enabled;
    audioTracks.forEach((t) => {
      t.enabled = enabled;
    });
    setIsAudioEnabled(enabled);
  }

  function toggleVideo() {
    const stream = localStreamRef.current;
    if (!stream) return;

    const videoTracks = stream.getVideoTracks();
    if (!videoTracks.length) return;

    const enabled = !videoTracks[0].enabled;
    videoTracks.forEach((t) => {
      t.enabled = enabled;
    });
    setIsVideoEnabled(enabled);
  }

  async function startScreenShare() {
    if (isScreenSharing) return;

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      screenStreamRef.current = displayStream;
      const screenTrack = displayStream.getVideoTracks()[0];

      // Replace outgoing video tracks in all peer connections
      peersRef.current.forEach((pc) => {
        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        if (sender && screenTrack) {
          sender.replaceTrack(screenTrack);
        }
      });

      // Show screen share locally
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = displayStream;
      }

      setIsScreenSharing(true);

      // When the user stops sharing via browser UI, revert back
      if (screenTrack) {
        screenTrack.onended = () => {
          stopScreenShare();
        };
      }
    } catch (e) {
      // User might have cancelled; ignore
      console.error('Screen share error', e);
    }
  }

  function stopScreenShare() {
    if (!isScreenSharing) return;

    const displayStream = screenStreamRef.current;
    const localStream = localStreamRef.current;

    const cameraTrack = localStream?.getVideoTracks()[0] ?? null;

    if (displayStream) {
      displayStream.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }

    // Switch peers back to camera video
    if (cameraTrack) {
      peersRef.current.forEach((pc) => {
        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(cameraTrack);
        }
      });
    }

    // Show camera locally again
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }

    setIsScreenSharing(false);
  }

  function startRecording() {
    if (isRecording || !localStreamRef.current) return;

    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(localStreamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Recording error', e);
    }
  }

  function stopRecording() {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  }

  return {
    localVideoRef,
    remoteStreams,
    messages,
    sendChat,
    sendEditorChange,
    socket,
    // media controls
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
  };
}
