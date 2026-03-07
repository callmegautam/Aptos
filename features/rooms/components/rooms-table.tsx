'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

import { MoreVertical, Calendar, Clock, Copy, Link } from 'lucide-react';

import { useState } from 'react';

import type { InterviewRoom, RoomStatus } from '@/features/rooms/types/room';

const STATUS_CONFIG: Record<RoomStatus, { label: string; variant: any }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'default' },
  live: { label: 'Live', variant: 'default' },
  completed: { label: 'Completed', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' }
};

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function getInviteLink(roomId: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/join/${roomId}`;
  }
  return '';
}

type RoomsTableProps = {
  rooms: InterviewRoom[];
  onEdit: (room: InterviewRoom) => void;
  onDelete: (room: InterviewRoom) => void;
};

export function RoomsTable({ rooms, onEdit, onDelete }: RoomsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyInviteLink = async (roomId: string) => {
    const link = getInviteLink(roomId);

    await navigator.clipboard.writeText(link);

    setCopiedId(roomId);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Interviewer</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Invite</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => {
            const status = STATUS_CONFIG[room.status];

            return (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>

                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>

                <TableCell>{room.field}</TableCell>

                <TableCell>{room.candidateName || 'Not assigned'}</TableCell>

                <TableCell>{room.interviewerName || 'Not assigned'}</TableCell>

                <TableCell>
                  {room.scheduledAt ? (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDateShort(room.scheduledAt)}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDateShort(room.createdAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyInviteLink(room.id)}
                    className="gap-1"
                  >
                    {copiedId === room.id ? (
                      <>
                        <Copy className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4" />
                        Link
                      </>
                    )}
                  </Button>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(room)}>Edit</DropdownMenuItem>

                      <DropdownMenuItem className="text-red-500" onClick={() => onDelete(room)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
