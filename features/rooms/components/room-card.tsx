'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

import {
  MoreVertical,
  User,
  Users,
  Calendar,
  Clock,
  Copy,
  Link,
  Server,
  LayoutDashboard,
  Layers,
  Smartphone
} from 'lucide-react';

import type {
  InterviewField,
  InterviewRoomStatus,
  InterviewRoomWithRelations
} from '@/types/interview-room';
import { formatDateShort } from '@/utils/date';

const STATUS_CONFIG: Record<InterviewRoomStatus, { label: string; variant: any }> = {
  SCHEDULED: { label: 'Scheduled', variant: 'default' },
  LIVE: { label: 'Live', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'outline' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' }
};

const FIELD_CONFIG: Record<InterviewField, { label: string; icon: typeof Server; color: string }> =
  {
    BACKEND: {
      label: 'Backend',
      icon: Server,
      color: 'bg-amber-500/10 text-amber-600'
    },
    FRONTEND: {
      label: 'Frontend',
      icon: LayoutDashboard,
      color: 'bg-sky-500/10 text-sky-600'
    },
    FULLSTACK: {
      label: 'Fullstack',
      icon: Layers,
      color: 'bg-violet-500/10 text-violet-600'
    },
    APPLICATION: {
      label: 'App',
      icon: Smartphone,
      color: 'bg-emerald-500/10 text-emerald-600'
    }
  };

// function formatDateShort(date: Date) {
//   return new Intl.DateTimeFormat(undefined, {
//     month: 'short',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit'
//   }).format(date);
// }

function getInviteLink(roomId: number): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/join/${roomId}`;
  }
  return '';
}

type RoomCardProps = {
  room: InterviewRoomWithRelations;
  onEdit: (room: InterviewRoomWithRelations) => void;
  onDelete: (room: InterviewRoomWithRelations) => void;
};

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const [copied, setCopied] = useState(false);

  const statusConf = STATUS_CONFIG[room.status];
  const fieldConf = FIELD_CONFIG[room.field];
  const FieldIcon = fieldConf.icon;

  const inviteLink = getInviteLink(room.id);

  const copyInviteLink = useCallback(async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteLink]);

  return (
    <Card className="transition hover:shadow-md">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start gap-3">
          {/* Field Icon */}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${fieldConf.color}`}
          >
            <FieldIcon className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold">{room.jobTitle}</CardTitle>

            <div className="flex gap-2 mt-2">
              <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
              <Badge variant="outline">{fieldConf.label}</Badge>
            </div>
          </div>
        </div>

        {/* ACTION MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-4">
        {/* Candidate */}
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Candidate:</span>
          <span className="font-medium">{room.candidateName || 'Not assigned'}</span>
        </div>

        {/* Interviewer */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Interviewer:</span>
          <span className="font-medium">{room.interviewer?.name ?? 'Not assigned'}</span>
        </div>

        {/* Dates */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {room.scheduledAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateShort(room.scheduledAt)}
            </span>
          )}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={copyInviteLink}
        >
          {copied ? (
            <>
              <Copy className="h-4 w-4" />
              Link copied
            </>
          ) : (
            <>
              <Link className="h-4 w-4" />
              Copy invite link
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
