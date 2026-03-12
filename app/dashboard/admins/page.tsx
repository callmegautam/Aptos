'use client';
import { AdminManagementRow } from '@/lib/dashboard/staff';
import { PageIntro, RoleBadge, StaffStatsGrid, VerificationBadge } from '@/features/dashboard/components/staff-dashboard-primitives';
import UniversalTable from '@/components/universal-table';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserStore } from '@/lib/store/user-store';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Actions from '@/components/ui/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { HTTP_STATUS } from '@/types/http';

type AdminFormState = {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
};

const createColumns = ({
  onEdit,
  onDelete
}: {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}): ColumnDef<AdminManagementRow>[] => [
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
    header: 'Admin',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('name')}</p>
        <p className="text-sm text-muted-foreground">{row.getValue('email')}</p>
      </div>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('email')}</span>
    )
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <RoleBadge role={row.getValue('role')} />
  },
  {
    accessorKey: 'emailVerified',
    header: 'Verification',
    cell: ({ row }) => <VerificationBadge verified={row.getValue('emailVerified')} />
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id;

      return <Actions id={id} onEdit={onEdit} onDelete={onDelete} />;
    }
  }
];

const AdminsPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [adminRows, setAdminRows] = useState<AdminManagementRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminManagementRow | null>(null);
  const [form, setForm] = useState<AdminFormState>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    const { data, status } = await axios.get('/api/staff');
    if (status === HTTP_STATUS.OK) {
      setAdminRows(data.adminRows);
    }
  }, []);

  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }
    void fetchAdmins();
  }, [user, router, fetchAdmins]);

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN'
    });
    setDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    const existing = adminRows.find((row) => row.id === id);
    if (!existing) return;
    setEditingAdmin(existing);
    setForm({
      name: existing.name,
      email: existing.email,
      password: '',
      role: existing.role
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const existing = adminRows.find((row) => row.id === id);
    if (!existing) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete admin "${existing.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await axios.delete(`/api/admin/${id}`);
      toast.success('Admin deleted successfully');
      await fetchAdmins();
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to delete admin';
      toast.error(message);
    }
  };

  const columns = useMemo(
    () => createColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  );

  const stats = useMemo(
    () => [
      {
        label: 'Total admins',
        value: adminRows.length,
        description: 'All staff accounts with dashboard administration access'
      },
      {
        label: 'Super admins',
        value: adminRows.filter((row) => row.role === 'SUPER_ADMIN').length,
        description: 'Accounts with full platform governance permissions'
      },
      {
        label: 'Admins',
        value: adminRows.filter((row) => row.role === 'ADMIN').length,
        description: 'Accounts with standard admin dashboard access'
      },
      {
        label: 'Verified admins',
        value: adminRows.filter((row) => row.emailVerified).length,
        description: 'Staff accounts with verified email status'
      }
    ],
    [adminRows]
  );

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || (!editingAdmin && !form.password.trim())) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setSubmitting(true);
      if (editingAdmin) {
        const payload: Partial<AdminFormState> = {
          name: form.name,
          email: form.email,
          role: form.role
        };
        if (form.password.trim()) {
          payload.password = form.password;
        }
        await axios.patch(`/api/admin/${editingAdmin.id}`, payload);
        toast.success('Admin updated successfully');
      } else {
        await axios.post('/api/admin', form);
        toast.success('Admin created successfully');
      }
      await fetchAdmins();
      setDialogOpen(false);
      setEditingAdmin(null);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN'
      });
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to save admin';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <PageIntro
          title="Admin Management"
          description="Super admins can review platform staff, distinguish access level, and manage admin accounts."
        />
        <Button onClick={handleOpenCreate}>Add admin</Button>
      </div>

      <div className="space-y-8">
        <StaffStatsGrid stats={stats} />
        <UniversalTable columns={columns} data={adminRows} pageSize={10} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdmin ? 'Edit admin' : 'Create admin'}</DialogTitle>
            <DialogDescription>
              {editingAdmin
                ? 'Update the admin details. Leave password empty to keep the current one.'
                : 'Create a new admin account with dashboard access.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password{editingAdmin ? ' (leave blank to keep current)' : ''}
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value: 'ADMIN' | 'SUPER_ADMIN') =>
                  setForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {editingAdmin ? 'Save changes' : 'Create admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminsPage;
