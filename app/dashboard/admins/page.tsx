'use client';
import { AdminManagementRow, isSuperAdminRole } from '@/lib/dashboard/staff';
import {
  DashboardTable,
  PageIntro,
  RoleBadge,
  StaffStatsGrid,
  VerificationBadge
} from '@/features/dashboard/components/staff-dashboard-primitives';
import UniversalTable from '@/components/universal-table';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserStore } from '@/lib/store/user-store';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Actions from '@/components/ui/actions';

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

const onEdit = (id: number) => {};
const onDelete = (id: number) => {
  console.log('delete', id);
};

const AdminsPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [adminRows, setAdminRows] = useState<AdminManagementRow[]>([]);
  const columns = createColumns({ onEdit, onDelete });
  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }
    const fetchData = async () => {
      const { data } = await axios.get('/api/staff');
      setAdminRows(data.adminRows);
    };
    fetchData();
  }, []);

  const stats = [
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
  ];

  return (
    <div className="space-y-8">
      <PageIntro
        title="Admin Management"
        description="Super admins can review platform staff, distinguish access level, and monitor verification readiness for every admin account."
      />

      <StaffStatsGrid stats={stats} />

      <UniversalTable columns={columns} data={adminRows} pageSize={10} />

      {/* <DashboardTable
        title="Platform admins"
        description="This section is only visible to super admins."
        rows={adminRows}
        emptyLabel="No admin accounts found."
        columns={[
          {
            key: 'name',
            header: 'Admin',
            cell: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.email}</p>
              </div>
            )
          },
          {
            key: 'role',
            header: 'Role',
            cell: (row) => <RoleBadge role={row.role} />
          },
          {
            key: 'emailVerified',
            header: 'Verification',
            cell: (row) => <VerificationBadge verified={row.emailVerified} />
          }
        ]}
      /> */}
    </div>
  );
};

export default AdminsPage;
