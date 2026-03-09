'use client';
import { Button } from '@/components/ui/button';
// import InterviewTable from '@/features/dashboard/components/interview-table';
import { PlusIcon } from 'lucide-react';
import InterviewersTable from '@/features/interviewers/components/table';
import { useCallback, useState } from 'react';
import { CreateInterviewerDialog } from '@/features/interviewers/components/create-interviewer-dialog';
import toast from 'react-hot-toast';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';

type Interviewer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  total_interviews: number;
  status: 'active' | 'inactive';
};

const InterviewersPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingInterviewer, setEditingInterviewer] = useState<Interviewer | null>(null);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);

  const createInterviewer = async (data: any) => {
    try {
      const response = await axios.post('/api/interviewers', data);
      if (response.status === HTTP_STATUS.CREATED) {
        toast.success(response.data.message || 'Interviewer created successfully');
        return response.data;
      } else {
        toast.error(response.data.error || 'Failed to create interviewer');
        return null;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to create interviewer');
      return null;
    }
  };

  const handleCreateInterviewer = useCallback((data: Omit<Interviewer, 'id' | 'createdAt'>) => {
    const interviewer: Interviewer = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatarUrl: data.avatarUrl ?? '',
      total_interviews: 0,
      status: 'active'
    };
    setInterviewers((prev) => [interviewer, ...prev]);
  }, []);

  const handleSubmit = async (
    data: Omit<Interviewer, 'id' | 'createdAt'> & { createdAt?: Date },
    isEdit: boolean
  ) => {
    if (isEdit && editingInterviewer) {
      setInterviewers((prev) =>
        prev.map((i) =>
          i.id === editingInterviewer.id
            ? {
                ...i,
                name: data.name,
                email: data.email,
                phone: data.phone,
                avatarUrl: data.avatarUrl ?? '',
                total_interviews: data.total_interviews,
                status: data.status
              }
            : i
        )
      );
      setEditingInterviewer(null);

      toast.success('Interviewer updated successfully');
    } else {
      const response = await createInterviewer(data);
      if (response) {
        handleCreateInterviewer(data);
      }
    }
  };

  const handleEdit = useCallback((interviewer: Interviewer) => {
    setEditingInterviewer(interviewer);
    setCreateOpen(true);
  }, []);

  const handleDelete = useCallback(
    (interviewer: Interviewer) => {
      setInterviewers((prev) => prev.filter((i) => i.id !== interviewer.id));
      if (editingInterviewer?.id === interviewer.id) {
        setEditingInterviewer(null);
        setCreateOpen(false);
      }
    },
    [editingInterviewer]
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
      <InterviewersTable />
      <CreateInterviewerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        editingInterviewer={editingInterviewer}
        onSubmit={handleSubmit}
      />
      <div className="flex justify-center">{/* <InterviewTable /> */}</div>
      <div className="flex justify-center">{/* <DemoTable /> */}</div>
    </div>
  );
};

export default InterviewersPage;
