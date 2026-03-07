'use client';

import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { InterviewRoom, RoomStatus } from '@/features/dashboard/types/room';
import {
  CopyIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
  ServerIcon,
  LayoutDashboardIcon,
  LayersIcon,
  SmartphoneIcon,
  LinkIcon,
  CalendarIcon,
  ClockIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<RoomStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-muted/80 text-muted-foreground border-transparent'
  },
  scheduled: {
    label: 'Scheduled',
    className:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  },
  live: {
    label: 'Live',
    className:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
  },
  completed: {
    label: 'Completed',
    className:
      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
  }
};

const FIELD_CONFIG = {
  backend: {
    label: 'Backend',
    icon: ServerIcon,
    accent: 'from-amber-500/20 to-orange-500/10',
    iconBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
  },
  frontend: {
    label: 'Frontend',
    icon: LayoutDashboardIcon,
    accent: 'from-sky-500/20 to-blue-500/10',
    iconBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-400'
  },
  fullstack: {
    label: 'Fullstack',
    icon: LayersIcon,
    accent: 'from-violet-500/20 to-purple-500/10',
    iconBg: 'bg-violet-500/15 text-violet-700 dark:text-violet-400'
  },
  app: {
    label: 'App',
    icon: SmartphoneIcon,
    accent: 'from-emerald-500/20 to-teal-500/10',
    iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
  }
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function getInviteLink(roomId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/join/${roomId}`;
  }
  return `${
    (typeof process !== 'undefined' &&
      (process as unknown as { env?: { NEXT_PUBLIC_APP_URL?: string } }).env
        ?.NEXT_PUBLIC_APP_URL) ??
    ''
  }/join/${roomId}`;
}

type RoomCardProps = {
  room: InterviewRoom;
  onEdit: (room: InterviewRoom) => void;
  onDelete: (room: InterviewRoom) => void;
};

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const [copied, setCopied] = useState(false);
  const statusConf = STATUS_CONFIG[room.status];
  const fieldConf = FIELD_CONFIG[room.field];
  const FieldIcon = fieldConf.icon;

  const inviteLink = getInviteLink(room.id);

  const copyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [inviteLink]);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
        'hover:border-primary/25 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30'
      )}
    >
      {/* Top accent bar by field */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80',
          fieldConf.accent
        )}
      />

      <CardContent className="p-0">
        {/* Main content area */}
        <div className="p-5">
          {/* Header row: field logo, title, status, menu */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-200 group-hover:shadow group-hover:scale-[1.02]',
                fieldConf.iconBg
              )}
            >
              <FieldIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold tracking-tight text-foreground truncate">
                  {room.name}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full opacity-60 transition-opacity hover:opacity-100 hover:bg-muted"
                      aria-label="Room actions"
                    >
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => onEdit(room)}>
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(room)}>
                      <Trash2Icon className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn('text-xs font-medium shrink-0', statusConf.className)}
                >
                  {statusConf.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{fieldConf.label}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          )}

          {/* People: candidate & interviewer */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Candidate
                </p>
                <p className="text-sm font-medium truncate">
                  {room.candidateName || 'Not assigned'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Interviewer
                </p>
                <p className="text-sm font-medium truncate">
                  {room.interviewerName || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {room.scheduledAt && (
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDateShort(room.scheduledAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              Created {formatDateShort(room.createdAt)}
            </span>
          </div>
        </div>

        {/* Copy invite link - full width bar */}
        <div className="border-t border-border bg-muted/30 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full gap-2 font-medium transition-all',
              copied
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            )}
            onClick={copyInviteLink}
          >
            {copied ? (
              <>
                <CopyIcon className="h-4 w-4" />
                Link copied!
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                Copy invite link
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
