'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FieldGroup } from '@/components/ui/field';
import { Field } from '@/components/ui/field';
import { FieldLabel } from '@/components/ui/field';
import React from 'react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type Interviewer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  total_interviews: number;
  status: 'active' | 'inactive';
};

type InterviewerFormData = Omit<Interviewer, 'id' | 'createdAt'> & {
  createdAt?: Date;
};

type CreateInterviewerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInterviewer: Interviewer | null;
  onSubmit: (data: InterviewerFormData, isEdit: boolean) => void;
};

const defaultFormState = (): InterviewerFormData => ({
  name: '',
  email: '',
  phone: '',
  avatarUrl: '',
  total_interviews: 0,
  status: 'inactive'
});

export function CreateInterviewerDialog({
  open,
  onOpenChange,
  editingInterviewer,
  onSubmit
}: CreateInterviewerDialogProps) {
  const isEdit = !!editingInterviewer;
  const [form, setForm] = useState<InterviewerFormData>(defaultFormState());

  React.useEffect(() => {
    if (editingInterviewer) {
      setForm({
        name: editingInterviewer.name,
        email: editingInterviewer.email,
        phone: editingInterviewer.phone,
        avatarUrl: editingInterviewer.avatarUrl,
        total_interviews: editingInterviewer.total_interviews,
        status: editingInterviewer.status,
        createdAt: new Date()
      });
    } else {
      setForm(defaultFormState());
    }
  }, [editingInterviewer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload: InterviewerFormData = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      avatarUrl: form.avatarUrl.trim(),
      total_interviews: form.total_interviews,
      status: form.status
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle>{isEdit ? 'Edit interviewer' : 'Create interviewer'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update interviewer details. Changes are saved locally.'
              : 'Add a new interviewer to the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="overflow-y-auto px-6 py-4">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="interviewer-name">Interviewer name</FieldLabel>
                <Input
                  id="interviewer-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="interviewer-email">Interviewer email</FieldLabel>
                <Input
                  id="interviewer-email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. john.doe@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="interviewer-phone">Interviewer phone</FieldLabel>
                <Input
                  id="interviewer-phone"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. +1234567890"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="interviewer-avatar-url">Interviewer avatar URL</FieldLabel>
                <Input
                  id="interviewer-avatar-url"
                  value={form.avatarUrl}
                  onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                  placeholder="e.g. https://example.com/avatar.png"
                />
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim()}>
              {isEdit ? 'Save changes' : 'Create interviewer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
