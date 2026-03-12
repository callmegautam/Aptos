import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import CompanyInterviewersPage from '@/features/interviewers/components/company-interviewers-page';
import { PageIntro, StaffStatsGrid } from '@/features/dashboard/components/staff-dashboard-primitives';
import { StaffInterviewersTable } from '@/features/dashboard/components/staff-interviewers-table';

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

      <StaffInterviewersTable rows={interviewerRows} />
    </div>
  );
};

export default InterviewersPage;

