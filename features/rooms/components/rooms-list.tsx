'use client';

import { Card, CardContent } from '@/components/ui/card';
import { RoomCard } from '@/features/rooms/components/room-card';
import type { InterviewRoomWithRelations } from '@/types/interview-room';
import { Video } from 'lucide-react';

type RoomsListProps = {
  rooms: InterviewRoomWithRelations[];
  onEdit: (room: InterviewRoomWithRelations) => void;
  onDelete: (room: InterviewRoomWithRelations) => void;
};

export function RoomsList({ rooms, onEdit, onDelete }: RoomsListProps) {
  if (rooms.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No interview rooms yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Create your first room to start scheduling and conducting interviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
