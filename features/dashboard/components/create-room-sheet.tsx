'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type {
  InterviewRoom,
  InterviewField,
  RoomStatus,
} from '@/features/dashboard/types/room';
import { INTERVIEW_FIELD, ROOM_STATUS } from '@/features/dashboard/types/room';

type RoomFormData = Omit<InterviewRoom, 'id' | 'createdAt'> & {
  createdAt?: Date;
};

type CreateRoomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRoom: InterviewRoom | null;
  onSubmit: (data: RoomFormData, isEdit: boolean) => void;
};

const defaultFormState = (): RoomFormData => ({
  name: '',
  description: '',
  status: 'draft',
  field: 'fullstack',
  candidateName: '',
  interviewerName: '',
  scheduledAt: undefined,
});

function toDatetimeLocal(d: Date | undefined): string {
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(s: string): Date | undefined {
  if (!s) return undefined;
  const date = new Date(s);
  return isNaN(date.getTime()) ? undefined : date;
}

export function CreateRoomSheet({
  open,
  onOpenChange,
  editingRoom,
  onSubmit,
}: CreateRoomSheetProps) {
  const isEdit = !!editingRoom;
  const [form, setForm] = React.useState<RoomFormData>(defaultFormState());

  React.useEffect(() => {
    if (editingRoom) {
      setForm({
        name: editingRoom.name,
        description: editingRoom.description ?? '',
        status: editingRoom.status,
        field: editingRoom.field,
        candidateName: editingRoom.candidateName ?? '',
        interviewerName: editingRoom.interviewerName ?? '',
        scheduledAt: editingRoom.scheduledAt,
        createdAt: editingRoom.createdAt,
      });
    } else {
      setForm(defaultFormState());
    }
  }, [editingRoom, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload: RoomFormData = {
      ...form,
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      candidateName: form.candidateName?.trim() || undefined,
      interviewerName: form.interviewerName?.trim() || undefined,
    };
    onSubmit(payload, isEdit);
    setForm(defaultFormState());
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(defaultFormState());
    onOpenChange(next);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>
              {isEdit ? 'Edit interview room' : 'Create interview room'}
            </SheetTitle>
            <SheetDescription>
              {isEdit
                ? 'Update room details. Changes are saved locally.'
                : 'Add a new room for conducting interviews. You can edit details later.'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 py-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="room-name">Room name</FieldLabel>
                <Input
                  id="room-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Room A, Main Hall"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="room-description">Description (optional)</FieldLabel>
                <Input
                  id="room-description"
                  value={form.description ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Brief description or purpose"
                />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as RoomStatus }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_STATUS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Field</FieldLabel>
                <Select
                  value={form.field}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, field: v as InterviewField }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_FIELD.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="candidate-name">Candidate name (optional)</FieldLabel>
                <Input
                  id="candidate-name"
                  value={form.candidateName ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, candidateName: e.target.value }))
                  }
                  placeholder="Candidate name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="interviewer-name">Interviewer name (optional)</FieldLabel>
                <Input
                  id="interviewer-name"
                  value={form.interviewerName ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, interviewerName: e.target.value }))
                  }
                  placeholder="Interviewer name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="scheduled-at">Scheduled date & time (optional)</FieldLabel>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={toDatetimeLocal(form.scheduledAt)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      scheduledAt: fromDatetimeLocal(e.target.value),
                    }))
                  }
                />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim()}>
              {isEdit ? 'Save changes' : 'Create room'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
