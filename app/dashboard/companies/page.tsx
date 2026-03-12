import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import { PageIntro, StaffStatsGrid } from '@/features/dashboard/components/staff-dashboard-primitives';
import { StaffCompaniesTable } from '@/features/dashboard/components/staff-companies-table';

const CompaniesPage = async () => {
  const user = await getCurrentUser();

  if (!isStaffRole(user?.role)) {
    redirect('/dashboard');
  }

  const data = await getStaffDashboardData();
  const companyRows = data.companyRows;

  const stats = [
    {
      label: 'Companies',
      value: companyRows.length,
      description: 'Organizations currently visible to the admin panel'
    },
    {
      label: 'Interviewers assigned',
      value: companyRows.reduce((sum, row) => sum + row.interviewersCount, 0),
      description: 'Total interviewer seats linked to companies'
    },
    {
      label: 'Candidates interviewed',
      value: companyRows.reduce((sum, row) => sum + row.candidatesInterviewedCount, 0),
      description: 'Unique candidate touches counted per company'
    },
    {
      label: 'Completed interviews',
      value: companyRows.reduce((sum, row) => sum + row.completedInterviews, 0),
      description: 'Finished interview sessions across all companies'
    }
  ];

  return (
    <div className="space-y-8">
      <PageIntro
        title="Company Management"
        description="Review each company with its interview volume, assigned interviewers, candidate activity, and latest interview timeline."
      />

      <StaffStatsGrid stats={stats} />

      <StaffCompaniesTable rows={companyRows} />
    </div>
  );
};

export default CompaniesPage;

