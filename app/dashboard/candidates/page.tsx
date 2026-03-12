import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import { PageIntro, StaffStatsGrid } from '@/features/dashboard/components/staff-dashboard-primitives';
import { StaffCandidatesTable } from '@/features/dashboard/components/staff-candidates-table';

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

      <StaffCandidatesTable rows={candidateRows} />
    </div>
  );
};

export default CandidatesPage;


