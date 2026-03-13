'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Video } from 'lucide-react';

export default function JoinRoomPage() {
  const router = useRouter();

  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleJoin() {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/rooms/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomCode })
      });

      const data = await res.json();

      if (!data.valid) {
        setError('Invalid room code');
        setLoading(false);
        return;
      }

      router.push(`/interview/${roomCode}`);
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Video className="h-8 w-8 text-primary" />
          </div>

          <CardTitle className="text-xl font-semibold">Join Interview Room</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="text-center text-lg tracking-widest"
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button className="w-full" onClick={handleJoin} disabled={loading}>
            {loading ? 'Joining...' : 'Join Room'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
