'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreateRoomDialog } from '@/features/rooms/components/create-room-dialog';
import { RoomsList } from '@/features/rooms/components/rooms-list';
import { PlusIcon, TableIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InterviewRoom } from '@/types/interview-room';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<InterviewRoom[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<InterviewRoom | null>(null);
  const [trigger, setTrigger] = useState(0);

  const router = useRouter();

  useEffect(() => {}, [trigger]);

  const handleSubmit = useCallback(() => {
    setTrigger(Math.random());
  }, [editingRoom]);

  const handleEdit = useCallback((room: InterviewRoom) => {
    setEditingRoom(room);
    setCreateOpen(true);
  }, []);

  const handleDelete = useCallback(
    (room: InterviewRoom) => {
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      if (editingRoom?.id === room.id) {
        setEditingRoom(null);
        setCreateOpen(false);
      }
    },
    [editingRoom]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Interview rooms</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/rooms/table')}>
            <TableIcon className="w-4 h-4" />
            View more
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditingRoom(null);
              setCreateOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Interview Room
          </Button>
        </div>
      </div>
      <RoomsList rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />
      <CreateRoomDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        editingRoom={editingRoom}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RoomsPage;
