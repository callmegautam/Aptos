'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/realtime/socket';

export function useInterviewRoom(roomId: string) {
  const socket = getSocket();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  const [remoteStreams, setRemoteStreams] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

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
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('all-users');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('chat-message');
    };
  }, [roomId]);

  function sendChat(message: string) {
    socket.emit('chat-message', { roomId, message });
  }

  function sendEditorChange(code: string) {
    socket.emit('code-change', { roomId, code });
  }

  return {
    localVideoRef,
    remoteStreams,
    messages,
    sendChat,
    sendEditorChange,
    socket
  };
}
