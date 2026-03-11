import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import {
  DashboardTable,
  DateCell,
  PageIntro,
  StaffStatsGrid,
  VerificationBadge
} from '@/features/dashboard/components/staff-dashboard-primitives';

const CandidatesPage = async () => {
  const user = await getCurrentUser();

  if (!isStaffRole(user?.role)) {
    redirect('/dashboard');
  }

  const data = await getStaffDashboardData();
  const candidateRows = data.candidateRows;

  const stats = [
    {
      label: 'Candidates',
      value: candidateRows.length,
      description: 'Candidate accounts currently available in the system'
    },
    {
      label: 'Company touchpoints',
      value: candidateRows.reduce((sum, row) => sum + row.companiesInterviewedCount, 0),
      description: 'How many company relationships appear across candidate interviews'
    },
    {
      label: 'Interviewer touchpoints',
      value: candidateRows.reduce((sum, row) => sum + row.interviewersMetCount, 0),
      description: 'Distinct interviewer interactions attached to candidates'
    },
    {
      label: 'Completed interviews',
      value: candidateRows.reduce((sum, row) => sum + row.completedInterviews, 0),
      description: 'Completed candidate interview records'
    }
  ];

  return (
    <div className="space-y-8">
      <PageIntro
        title="Candidate Management"
        description="Review every candidate with interview counts, company exposure, interviewer coverage, and the latest recorded activity."
      />

      <StaffStatsGrid stats={stats} />

      <DashboardTable
        title="All candidates"
        description="Candidate interview activity across companies and interviewers."
        rows={candidateRows}
        emptyLabel="No candidates found."
        columns={[
          {
            key: 'name',
            header: 'Candidate',
            cell: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.email}</p>
              </div>
            )
          },
          {
            key: 'companiesInterviewedCount',
            header: 'Companies interviewed',
            cell: (row) => row.companiesInterviewedCount
          },
          {
            key: 'interviewersMetCount',
            header: 'Interviewers met',
            cell: (row) => row.interviewersMetCount
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

export default CandidatesPage;

