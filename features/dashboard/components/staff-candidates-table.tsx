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
import type { CandidateManagementRow } from '@/lib/dashboard/staff';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import toast from 'react-hot-toast';
import { VerificationBadge } from '@/features/dashboard/components/staff-dashboard-primitives';

type Props = {
  rows: CandidateManagementRow[];
};

const createColumns = ({
  onDelete
}: {
  onDelete?: (id: number) => void;
}): ColumnDef<CandidateManagementRow>[] => [
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
    header: 'Candidate',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('name')}</p>
        <p className="text-sm text-muted-foreground">{row.getValue('email')}</p>
      </div>
    )
  },
  {
    accessorKey: 'companiesInterviewedCount',
    header: 'Companies interviewed'
  },
  {
    accessorKey: 'interviewersMetCount',
    header: 'Interviewers met'
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

export function StaffCandidatesTable({ rows }: Props) {
  const [candidateRows, setCandidateRows] = useState<CandidateManagementRow[]>(rows);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateManagementRow | null>(null);

  const handleDeleteClick = (id: number) => {
    const candidate = candidateRows.find((row) => row.id === id) ?? null;
    if (!candidate) return;
    setCandidateToDelete(candidate);
    setDeleteDialogOpen(true);
  };

  const columns = useMemo(
    () => createColumns({ onDelete: handleDeleteClick }),
    [candidateRows]
  );

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;
    try {
      const response = await axios.delete(`/api/staff/candidates/${candidateToDelete.id}`);
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        setCandidateRows((prev) => prev.filter((row) => row.id !== candidateToDelete.id));
        toast.success('Candidate deleted successfully');
      } else {
        toast.error('Failed to delete candidate');
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to delete candidate';
      toast.error(message);
    } finally {
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
    }
  };

  return (
    <>
      <UniversalTable columns={columns} data={candidateRows} pageSize={10} />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{candidateToDelete?.name}&rdquo;? This will
              also remove their resumes. This action cannot be undone.
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

