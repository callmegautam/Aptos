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
import type { CompanyManagementRow } from '@/lib/dashboard/staff';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import toast from 'react-hot-toast';

type Props = {
  rows: CompanyManagementRow[];
};

const createColumns = ({
  onDelete
}: {
  onDelete?: (id: number) => void;
}): ColumnDef<CompanyManagementRow>[] => [
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
    header: 'Company',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('name')}</p>
        <p className="text-sm text-muted-foreground">{row.getValue('email')}</p>
      </div>
    )
  },
  {
    accessorKey: 'interviewersCount',
    header: 'Interviewers'
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

export function StaffCompaniesTable({ rows }: Props) {
  const [companyRows, setCompanyRows] = useState<CompanyManagementRow[]>(rows);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyManagementRow | null>(null);

  const handleDeleteClick = (id: number) => {
    const company = companyRows.find((row) => row.id === id) ?? null;
    if (!company) return;
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const columns = useMemo(
    () => createColumns({ onDelete: handleDeleteClick }),
    [companyRows]
  );

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      const response = await axios.delete(`/api/staff/companies/${companyToDelete.id}`);
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        setCompanyRows((prev) => prev.filter((row) => row.id !== companyToDelete.id));
        toast.success('Company deleted successfully');
      } else {
        toast.error('Failed to delete company');
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to delete company';
      toast.error(message);
    } finally {
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  return (
    <>
      <UniversalTable columns={columns} data={companyRows} pageSize={10} />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{companyToDelete?.name}&rdquo;? This will also
              remove its related interviewers and resumes. This action cannot be undone.
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

