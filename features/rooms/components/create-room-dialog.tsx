'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CreateInterviewRoom,
  InterviewField,
  interviewFieldEnum,
  InterviewRoomStatus,
  interviewStatusEnum
} from '@/types/interview-room';
import toast from 'react-hot-toast';
import { FileText, Trash2Icon, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
const interviewers = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Sarah' },
  { id: 3, name: 'Alex' }
];

type RoomFormData = CreateInterviewRoom;

type CreateRoomDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRoom: CreateInterviewRoom | null;
  onSubmit: (data: RoomFormData, isEdit: boolean) => void;
};

const defaultFormState = (): RoomFormData => ({
  jobTitle: '',
  jobDescription: undefined,
  status: 'SCHEDULED',
  field: 'FULLSTACK',
  candidateName: '',
  interviewerId: 0,
  scheduledAt: new Date()
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

export function CreateRoomDialog({
  open,
  onOpenChange,
  editingRoom,
  onSubmit
}: CreateRoomDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>({});
  const isEdit = !!editingRoom;
  const [form, setForm] = React.useState<RoomFormData>(defaultFormState());
  const [resume, setResume] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (editingRoom) {
      setForm({
        jobTitle: editingRoom.jobTitle,
        jobDescription: editingRoom.jobDescription ?? '',
        status: editingRoom.status,
        field: editingRoom.field,
        candidateName: editingRoom.candidateName ?? '',
        interviewerId: editingRoom.interviewerId,
        scheduledAt: editingRoom.scheduledAt
      });
    } else {
      setForm(defaultFormState());
    }
  }, [editingRoom, open]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error('File must be under 4MB');
      return;
    }

    setResume(file);
    setUploadedFiles([file]);

    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      setFileProgresses({
        [file.name]: progress
      });
    }, 200);
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));

    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });

    setResume(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle.trim()) return;
    const payload: RoomFormData = {
      ...form,
      jobTitle: form.jobTitle.trim(),
      jobDescription: form.jobDescription?.trim() || undefined,
      candidateName: form.candidateName?.trim() || undefined,
      interviewerId: form.interviewerId,
      scheduledAt: form.scheduledAt
    };
    onSubmit(payload, isEdit);
    setForm(defaultFormState());
    setUploadedFiles([]);
    setFileProgresses({});
    setResume(null);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(defaultFormState());
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle>{isEdit ? 'Edit interview room' : 'Create interview room'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update room details. Changes are saved locally.'
              : 'Add a new room for conducting interviews.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="overflow-y-auto px-6 py-4">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="room-name">Job Title</FieldLabel>
                <Input
                  id="room-name"
                  value={form.jobTitle}
                  onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
                  placeholder="Job title"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="room-description">Job Description (optional)</FieldLabel>
                <Input
                  id="room-description"
                  value={form.jobDescription ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, jobDescription: e.target.value }))}
                  placeholder="Job description"
                />
              </Field>
              <div className={`grid gap-4 ${isEdit ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {isEdit && (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={form.status}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, status: v as InterviewRoomStatus }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {interviewStatusEnum.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                <Field>
                  <FieldLabel>Field</FieldLabel>
                  <Select
                    value={form.field}
                    onValueChange={(v) => setForm((p) => ({ ...p, field: v as InterviewField }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewFieldEnum.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="candidate-name">Candidate name (optional)</FieldLabel>
                <Input
                  id="candidate-name"
                  value={form.candidateName ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, candidateName: e.target.value }))}
                  placeholder="Candidate name"
                />
              </Field>
              <Field>
                <FieldLabel>Resume (optional)</FieldLabel>
                {/* <FileUpload01 /> */}
                <div className="px-6">
                  <div
                    className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                    onClick={handleBoxClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="mb-2 bg-muted rounded-full p-3">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-pretty text-sm font-medium text-foreground">
                      Upload candidate resume
                    </p>
                    <p className="text-pretty text-sm text-muted-foreground mt-1">
                      or,{' '}
                      <label
                        htmlFor="fileUpload"
                        className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        click to browse
                      </label>{' '}
                      (4MB max)
                    </p>
                    <input
                      type="file"
                      id="fileUpload"
                      ref={fileInputRef}
                      className="hidden"
                      accept="application/pdf"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                </div>

                <div className={cn('px-6 pb-5 space-y-3', uploadedFiles.length > 0 ? 'mt-4' : '')}>
                  {uploadedFiles.map((file, index) => {
                    return (
                      <div
                        className="border border-border rounded-lg p-2 flex flex-col"
                        key={file.name + index}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>

                          <div className="flex-1 pr-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground truncate max-w-[250px]">
                                  {file.name}
                                </span>
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {Math.round(file.size / 1024)} KB
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="bg-transparent! hover:text-red-500"
                                onClick={() => removeFile(file.name)}
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${fileProgresses[file.name] || 0}%`
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {Math.round(fileProgresses[file.name] || 0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="interviewer-name">Interviewer name</FieldLabel>
                <Select
                  value={form.interviewerId ? String(form.interviewerId) : ''}
                  onValueChange={(v) => setForm((p) => ({ ...p, interviewerId: Number(v) }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Interviewer name" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewers.map((i) => (
                      <SelectItem key={i.id} value={i.id.toString()}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      scheduledAt: fromDatetimeLocal(e.target.value)
                    }))
                  }
                />
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.jobTitle.trim()}>
              {isEdit ? 'Save changes' : 'Create room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
