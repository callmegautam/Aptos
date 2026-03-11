import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import CompanyInterviewersPage from '@/features/interviewers/components/company-interviewers-page';
import {
  DashboardTable,
  DateCell,
  PageIntro,
  StaffStatsGrid,
  VerificationBadge
} from '@/features/dashboard/components/staff-dashboard-primitives';

const InterviewersPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!isStaffRole(user.role)) {
    return <CompanyInterviewersPage />;
  }

  const data = await getStaffDashboardData();
  const interviewerRows = data.interviewerRows;

  const stats = [
    {
      label: 'Interviewers',
      value: interviewerRows.length,
      description: 'Total interviewer accounts across all companies'
    },
    {
      label: 'Candidate interactions',
      value: interviewerRows.reduce((sum, row) => sum + row.candidatesInterviewedCount, 0),
      description: 'Candidate touches aggregated by interviewer'
    },
    {
      label: 'Completed interviews',
      value: interviewerRows.reduce((sum, row) => sum + row.completedInterviews, 0),
      description: 'Finished interviews handled by interviewer accounts'
    },
    {
      label: 'Verified interviewers',
      value: interviewerRows.filter((row) => row.emailVerified).length,
      description: 'Interviewer accounts with verified email status'
    }
  ];

  return (
    <div className="space-y-8">
      <PageIntro
        title="Interviewer Management"
        description="See interviewer performance, related companies, candidate coverage, and recent interview activity from the admin dashboard."
      />

      <StaffStatsGrid stats={stats} />

      <DashboardTable
        title="All interviewers"
        description="Platform-wide interviewer stats grouped with their assigned company."
        rows={interviewerRows}
        emptyLabel="No interviewers found."
        columns={[
          {
            key: 'name',
            header: 'Interviewer',
            cell: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.email}</p>
              </div>
            )
          },
          {
            key: 'companyName',
            header: 'Company',
            cell: (row) => row.companyName
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
            key: 'emailVerified',
            header: 'Verification',
            cell: (row) => <VerificationBadge verified={row.emailVerified} />
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

export default InterviewersPage;
