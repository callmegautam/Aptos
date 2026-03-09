'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CreateRoomDialog } from '@/features/rooms/components/create-room-dialog';
import { RoomsList } from '@/features/rooms/components/rooms-list';
import { PlusIcon, TableIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InterviewRoomWithRelations } from '@/types/interview-room';
import toast from 'react-hot-toast';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<InterviewRoomWithRelations[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<InterviewRoomWithRelations | null>(null);
  const [loading, setLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<InterviewRoomWithRelations | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const toastId = toast.loading('Loading interview rooms...');
      try {
        const response = await axios.get('/api/interview-rooms');
        if (response.status === HTTP_STATUS.OK) {
          // setRooms(response.data.rooms as InterviewRoomWithRelations[]);
          setRooms(
            response.data.rooms.map((room: any) => ({
              ...room,
              scheduledAt: new Date(room.scheduledAt)
            }))
          );
        } else {
          toast.error(response.data?.error ?? 'Failed to load rooms', { id: toastId });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.error || 'Request failed';
          toast.error(message, { id: toastId });
        } else {
          toast.error('Something went wrong while loading rooms', { id: toastId });
        }
      } finally {
        toast.dismiss(toastId);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = useCallback(
    (room: InterviewRoomWithRelations, isEdit: boolean) => {
      if (isEdit && editingRoom) {
        setRooms((prev) => prev.map((r) => (r.id === room.id ? room : r)));
        setEditingRoom(null);
        setCreateOpen(false);
      } else {
        setRooms((prev) => [...prev, room]);
        setCreateOpen(false);
      }
    },
    [editingRoom]
  );

  const handleEdit = useCallback((room: InterviewRoomWithRelations) => {
    setEditingRoom(room);
    setCreateOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (room: InterviewRoomWithRelations) => {
      try {
        const response = await axios.delete(`/api/interview-rooms/${room.id}`);
        if (response.status === HTTP_STATUS.NO_CONTENT) {
          setRooms((prev) => prev.filter((r) => r.id !== room.id));
          if (editingRoom?.id === room.id) {
            setEditingRoom(null);
            setCreateOpen(false);
          }
          toast.success('Interview room deleted successfully');
        } else {
          toast.error('Failed to delete interview room');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.error || 'Request failed';
          toast.error(message);
        } else {
          toast.error('Something went wrong while deleting room');
        }
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

      <RoomsList
        rooms={rooms}
        onEdit={handleEdit}
        onDelete={(room) => {
          setRoomToDelete(room);
          setDeleteDialogOpen(true);
        }}
      />
      <CreateRoomDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        editingRoom={editingRoom}
        onSubmit={handleSubmit}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure</DialogTitle>
            <DialogDescription>
              Do you really want to delete this room "{roomToDelete?.jobTitle}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!roomToDelete) return;
                await handleDelete(roomToDelete);
                setDeleteDialogOpen(false);
                setRoomToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsPage;
