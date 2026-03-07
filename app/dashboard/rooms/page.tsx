'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CreateRoomDialog } from '@/features/dashboard/components/create-room-dialog';
import { RoomsList } from '@/features/dashboard/components/rooms-list';
import type { InterviewRoom } from '@/features/dashboard/types/room';
import { PlusIcon } from 'lucide-react';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<InterviewRoom[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<InterviewRoom | null>(null);

  const handleCreateRoom = useCallback(
    (data: Omit<InterviewRoom, 'id' | 'createdAt'>) => {
      const room: InterviewRoom = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        status: data.status,
        field: data.field,
        candidateName: data.candidateName,
        interviewerName: data.interviewerName,
        scheduledAt: data.scheduledAt,
        createdAt: new Date(),
      };
      setRooms((prev) => [room, ...prev]);
    },
    []
  );

  const handleSubmit = useCallback(
    (data: Omit<InterviewRoom, 'id' | 'createdAt'> & { createdAt?: Date }, isEdit: boolean) => {
      if (isEdit && editingRoom) {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === editingRoom.id
              ? {
                  ...r,
                  name: data.name,
                  description: data.description,
                  status: data.status,
                  field: data.field,
                  candidateName: data.candidateName,
                  interviewerName: data.interviewerName,
                  scheduledAt: data.scheduledAt,
                }
              : r
          )
        );
        setEditingRoom(null);
      } else {
        handleCreateRoom(data);
      }
    },
    [editingRoom, handleCreateRoom]
  );

  const handleEdit = useCallback((room: InterviewRoom) => {
    setEditingRoom(room);
    setCreateOpen(true);
  }, []);

  const handleDelete = useCallback((room: InterviewRoom) => {
    setRooms((prev) => prev.filter((r) => r.id !== room.id));
    if (editingRoom?.id === room.id) {
      setEditingRoom(null);
      setCreateOpen(false);
    }
  }, [editingRoom]);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Interview rooms</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditingRoom(null);
              setCreateOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Create interview room
          </Button>
        </div>
      </div>
      <RoomsList
        rooms={rooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
