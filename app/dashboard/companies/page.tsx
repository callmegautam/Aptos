import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import {
  DashboardTable,
  DateCell,
  PageIntro,
  StaffStatsGrid
} from '@/features/dashboard/components/staff-dashboard-primitives';

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

      <DashboardTable
        title="All companies"
        description="Company-level stats for interview operations across the platform."
        rows={companyRows}
        emptyLabel="No companies found."
        columns={[
          {
            key: 'name',
            header: 'Company',
            cell: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.email}</p>
              </div>
            )
          },
          {
            key: 'interviewersCount',
            header: 'Interviewers',
            cell: (row) => row.interviewersCount
          },
          {
            key: 'candidatesInterviewedCount',
            header: 'Candidates interviewed',
            cell: (row) => row.candidatesInterviewedCount
          },
          {
            key: 'totalInterviews',
            header: 'Total interviews',
            cell: (row) => row.totalInterviews
          },
          {
            key: 'completedInterviews',
            header: 'Completed',
            cell: (row) => row.completedInterviews
          },
          {
            key: 'activeInterviews',
            header: 'Active',
            cell: (row) => row.activeInterviews
          },
          {
            key: 'lastInterviewAt',
            header: 'Last interview',
            cell: (row) => <DateCell value={row.lastInterviewAt} />
          }
        ]}
      />
    </div>
  );
};

export default CompaniesPage;

