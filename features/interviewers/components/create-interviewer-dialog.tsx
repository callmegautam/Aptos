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
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  createInterviewerSchema,
  updateInterviewerSchema,
  type Interviewer
} from '@/types/interviewer';
import toast from 'react-hot-toast';
import { HTTP_STATUS } from '@/types/http';
import axios from 'axios';

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type CreateInterviewerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInterviewer: Interviewer | null;
  onSubmit: (data: Interviewer, isEdit: boolean) => void;
};

const defaultFormState = (): FormState => ({
  name: '',
  email: '',
  phone: '',
  password: ''
});

export function CreateInterviewerDialog({
  open,
  onOpenChange,
  editingInterviewer,
  onSubmit
}: CreateInterviewerDialogProps) {
  const isEdit = !!editingInterviewer;
  const [form, setForm] = useState<FormState>(defaultFormState());

  useEffect(() => {
    if (editingInterviewer) {
      setForm({
        name: editingInterviewer.name,
        email: editingInterviewer.email,
        phone: (editingInterviewer as any).phone ?? '',
        password: ''
      });
    } else {
      setForm(defaultFormState());
    }
  }, [editingInterviewer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading(`${isEdit ? 'Editing' : 'Creating'} interviewer...`);

    try {
      let response;

      if (isEdit && editingInterviewer) {
        const payload: Partial<FormState> = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim()
        };
        if (form.password.trim()) {
          payload.password = form.password.trim();
        }

        const parsed = updateInterviewerSchema.safeParse(payload);
        if (!parsed.success) {
          toast.error('Invalid form data', { id: loadingToast });
          return;
        }

        response = await axios.patch(`/api/interviewers/${editingInterviewer.id}`, parsed.data);

        if (response.status === HTTP_STATUS.OK) {
          toast.success('Interviewer updated', { id: loadingToast });
          onSubmit(response.data as Interviewer, true);
        } else {
          toast.error(response.data.error ?? 'Failed to update interviewer', {
            id: loadingToast
          });
          return;
        }
      } else {
        const parsed = createInterviewerSchema.safeParse({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password.trim()
        });
        if (!parsed.success) {
          toast.error('Invalid form data', { id: loadingToast });
          return;
        }

        response = await axios.post('/api/interviewers', parsed.data);
        if (response.status === HTTP_STATUS.CREATED) {
          toast.success('Interviewer created', { id: loadingToast });
          onSubmit(response.data as Interviewer, false);
        } else {
          toast.error(response.data.error ?? 'Failed to create interviewer', {
            id: loadingToast
          });
          return;
        }
      }

      setForm(defaultFormState());
      onOpenChange(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Request failed';
        toast.error(message, { id: loadingToast });
      } else {
        toast.error('Something went wrong', { id: loadingToast });
      }

      setForm(defaultFormState());
      onOpenChange(false);
    }
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
                <FieldLabel htmlFor="interviewer-password">Interviewer password</FieldLabel>
                <Input
                  id="interviewer-password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="e.g. password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="interviewer-phone">Interviewer phone</FieldLabel>
                <Input
                  id="interviewer-phone"
                  value={form.phone ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. +1234567890"
                  required
                />
              </Field>
              {/* <Field>
                <FieldLabel htmlFor="interviewer-avatar-url">Interviewer avatar URL</FieldLabel>
                <Input
                  id="interviewer-avatar-url"
                  value={form.avatarUrl}
                  onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                  placeholder="e.g. https://example.com/avatar.png"
                />
              </Field> */}
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
