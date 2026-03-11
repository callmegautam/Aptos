import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isSuperAdminRole } from '@/lib/dashboard/staff';
import {
  DashboardTable,
  PageIntro,
  RoleBadge,
  StaffStatsGrid,
  VerificationBadge
} from '@/features/dashboard/components/staff-dashboard-primitives';

const AdminsPage = async () => {
  const user = await getCurrentUser();

  if (!isSuperAdminRole(user?.role)) {
    redirect('/dashboard');
  }

  const data = await getStaffDashboardData();
  const adminRows = data.adminRows;

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
      label: 'Verified staff',
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

      <DashboardTable
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
      />
    </div>
  );
};

export default AdminsPage;

