import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isSuperAdminRole } from '@/lib/dashboard/staff';
import {
  PageIntro,
  StaffStatsGrid,
  SystemSettingsOverview
} from '@/features/dashboard/components/staff-dashboard-primitives';

const SettingsPage = async () => {
  const user = await getCurrentUser();

  if (!isSuperAdminRole(user?.role)) {
    redirect('/dashboard');
  }

  const data = await getStaffDashboardData();

  const stats = [
    {
      label: 'Configured services',
      value: data.systemSettings
        .flatMap((section) => section.items)
        .filter((item) => item.status === 'configured').length,
      description: 'Environment-backed services currently configured'
    },
    {
      label: 'Missing services',
      value: data.systemSettings
        .flatMap((section) => section.items)
        .filter((item) => item.status === 'missing').length,
      description: 'Important integrations that still need configuration'
    },
    {
      label: 'Informational settings',
      value: data.systemSettings
        .flatMap((section) => section.items)
        .filter((item) => item.status === 'info').length,
      description: 'Read-only platform configuration insights'
    }
  ];

  return (
    <div className="space-y-8">
      <PageIntro
        title="System Settings"
        description="Super admins can review project-wide service readiness and platform governance settings from this page."
      />

      <StaffStatsGrid stats={stats} />
      <SystemSettingsOverview sections={data.systemSettings} />
    </div>
  );
};

export default SettingsPage;
