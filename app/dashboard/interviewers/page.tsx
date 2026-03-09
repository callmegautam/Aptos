'use client';
import { Button } from '@/components/ui/button';
// import InterviewTable from '@/features/dashboard/components/interview-table';
import { PlusIcon } from 'lucide-react';
import InterviewersTable, {
  type InterviewersTableItem
} from '@/features/interviewers/components/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateInterviewerDialog } from '@/features/interviewers/components/create-interviewer-dialog';
import toast from 'react-hot-toast';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import { Interviewer } from '@/types/interviewer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const InterviewersPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingInterviewer, setEditingInterviewer] = useState<Interviewer | null>(null);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewerToDelete, setInterviewerToDelete] = useState<Interviewer | null>(null);

  useEffect(() => {
    const fetchInterviewers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/interviewers');
        if (response.status === HTTP_STATUS.OK) {
          const data = response.data.interviewers;
          const list: Interviewer[] = Array.isArray(data) ? data : [data];
          setInterviewers(list);
        } else {
          toast.error(response.data?.error ?? 'Failed to load interviewers');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.error || 'Request failed';
          toast.error(message);
        } else {
          toast.error('Something went wrong while loading interviewers');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();
  }, []);

  const handleSubmit = useCallback(
    (interviewer: Interviewer, isEdit: boolean) => {
      if (isEdit && editingInterviewer) {
        setInterviewers((prev) => prev.map((i) => (i.id === interviewer.id ? interviewer : i)));
        setEditingInterviewer(null);
        setCreateOpen(false);
      } else {
        setInterviewers((prev) => [...prev, interviewer]);
        setCreateOpen(false);
      }
    },
    [editingInterviewer]
  );

  const handleEdit = useCallback(
    (id: number) => {
      const interviewer = interviewers.find((i) => i.id === id) ?? null;
      if (!interviewer) return;
      setEditingInterviewer(interviewer);
      setCreateOpen(true);
    },
    [interviewers]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const interviewer = interviewers.find((i) => i.id === id);
      if (!interviewer) return;

      setInterviewerToDelete(interviewer);
      setDeleteDialogOpen(true);
    },
    [interviewers]
  );

  const tableItems: InterviewersTableItem[] = useMemo(
    () =>
      interviewers.map((i) => ({
        id: i.id,
        avatar: (i as any).avatarUrl ?? null,
        name: i.name,
        email: i.email,
        phone: (i as any).phone ?? '',
        total_interviews: (i as any).totalInterviews ?? 0,
        status: 'active'
      })),
    [interviewers]
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Interviewers</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditingInterviewer(null);
              setCreateOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Interviewer
          </Button>
        </div>
      </div>
      <InterviewersTable items={tableItems} onEdit={handleEdit} onDelete={handleDelete} />
      <CreateInterviewerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        editingInterviewer={editingInterviewer}
        onSubmit={handleSubmit}
      />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Interviewer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{interviewerToDelete?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!interviewerToDelete) return;

                try {
                  const response = await axios.delete(
                    `/api/interviewers/${interviewerToDelete.id}`
                  );
                  if (response.status === HTTP_STATUS.NO_CONTENT) {
                    setInterviewers((prev) => prev.filter((i) => i.id !== interviewerToDelete.id));
                    if (editingInterviewer?.id === interviewerToDelete.id) {
                      setEditingInterviewer(null);
                      setCreateOpen(false);
                    }
                    toast.success('Interviewer deleted successfully');
                  } else {
                    toast.error('Failed to delete interviewer');
                  }
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || 'Request failed';
                    toast.error(message);
                  } else {
                    toast.error('Something went wrong while deleting interviewer');
                  }
                } finally {
                  setDeleteDialogOpen(false);
                  setInterviewerToDelete(null);
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center">{/* <InterviewTable /> */}</div>
      <div className="flex justify-center">{/* <DemoTable /> */}</div>
    </div>
  );
};

export default InterviewersPage;
