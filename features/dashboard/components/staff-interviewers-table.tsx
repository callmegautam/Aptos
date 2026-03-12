'use client';

import UniversalTable from '@/components/universal-table';
import Actions from '@/components/ui/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import type { InterviewerManagementRow } from '@/lib/dashboard/staff';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import toast from 'react-hot-toast';
import { VerificationBadge } from '@/features/dashboard/components/staff-dashboard-primitives';

type Props = {
  rows: InterviewerManagementRow[];
};

const createColumns = ({
  onDelete
}: {
  onDelete?: (id: number) => void;
}): ColumnDef<InterviewerManagementRow>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Interviewer',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('name')}</p>
        <p className="text-sm text-muted-foreground">{row.getValue('email')}</p>
      </div>
    )
  },
  {
    accessorKey: 'companyName',
    header: 'Company'
  },
  {
    accessorKey: 'candidatesInterviewedCount',
    header: 'Candidates interviewed'
  },
  {
    accessorKey: 'totalInterviews',
    header: 'Total interviews'
  },
  {
    accessorKey: 'completedInterviews',
    header: 'Completed'
  },
  {
    accessorKey: 'activeInterviews',
    header: 'Active'
  },
  {
    accessorKey: 'emailVerified',
    header: 'Verification',
    cell: ({ row }) => <VerificationBadge verified={row.getValue('emailVerified')} />
  },
  {
    accessorKey: 'lastInterviewAt',
    header: 'Last interview'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id;
      return <Actions id={id} onDelete={onDelete} />;
    }
  }
];

export function StaffInterviewersTable({ rows }: Props) {
  const [interviewerRows, setInterviewerRows] = useState<InterviewerManagementRow[]>(rows);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewerToDelete, setInterviewerToDelete] =
    useState<InterviewerManagementRow | null>(null);

  const handleDeleteClick = (id: number) => {
    const interviewer = interviewerRows.find((row) => row.id === id) ?? null;
    if (!interviewer) return;
    setInterviewerToDelete(interviewer);
    setDeleteDialogOpen(true);
  };

  const columns = useMemo(
    () => createColumns({ onDelete: handleDeleteClick }),
    [interviewerRows]
  );

  const handleConfirmDelete = async () => {
    if (!interviewerToDelete) return;
    try {
      const response = await axios.delete(`/api/staff/interviewers/${interviewerToDelete.id}`);
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        setInterviewerRows((prev) => prev.filter((row) => row.id !== interviewerToDelete.id));
        toast.success('Interviewer deleted successfully');
      } else {
        toast.error('Failed to delete interviewer');
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to delete interviewer';
      toast.error(message);
    } finally {
      setDeleteDialogOpen(false);
      setInterviewerToDelete(null);
    }
  };

  return (
    <>
      <UniversalTable columns={columns} data={interviewerRows} pageSize={10} />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete interviewer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{interviewerToDelete?.name}&rdquo;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

