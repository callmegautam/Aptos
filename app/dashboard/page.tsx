import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole } from '@/lib/dashboard/staff';
import CompanyDashboardHome from '@/features/dashboard/components/company-dashboard-home';
import {
  DashboardTable,
  DateCell,
  PageIntro,
  RoleBadge,
  StaffStatsGrid,
  VerificationBadge
} from '@/features/dashboard/components/staff-dashboard-primitives';

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!isStaffRole(user?.role)) {
    return <CompanyDashboardHome />;
  }

  const data = await getStaffDashboardData();

  return (
    <div className="space-y-8">
      <PageIntro
        title={user.role === 'SUPER_ADMIN' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
        description="Track platform-wide usage, compare company performance, and monitor interviewer and candidate activity from one place."
      />

      <StaffStatsGrid stats={data.overviewStats} />

      <DashboardTable
        title="Company snapshot"
        description="The highest-activity companies on the platform right now."
        rows={data.companyRows.slice(0, 5)}
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
            key: 'lastInterviewAt',
            header: 'Latest activity',
            cell: (row) => <DateCell value={row.lastInterviewAt} />
          }
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardTable
          title="Top interviewers"
          description="Interviewers handling the most interview activity."
          rows={data.interviewerRows.slice(0, 5)}
          emptyLabel="No interviewers found."
          columns={[
            {
              key: 'name',
              header: 'Interviewer',
              cell: (row) => (
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-sm text-muted-foreground">{row.companyName}</p>
                </div>
              )
            },
            {
              key: 'candidatesInterviewedCount',
              header: 'Candidates',
              cell: (row) => row.candidatesInterviewedCount
            },
            {
              key: 'totalInterviews',
              header: 'Interviews',
              cell: (row) => row.totalInterviews
            },
            {
              key: 'emailVerified',
              header: 'Status',
              cell: (row) => <VerificationBadge verified={row.emailVerified} />
            }
          ]}
        />

        <DashboardTable
          title="Candidate activity"
          description="Candidates with the most recorded interview interactions."
          rows={data.candidateRows.slice(0, 5)}
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
              header: 'Companies',
              cell: (row) => row.companiesInterviewedCount
            },
            {
              key: 'interviewersMetCount',
              header: 'Interviewers',
              cell: (row) => row.interviewersMetCount
            },
            {
              key: 'totalInterviews',
              header: 'Interviews',
              cell: (row) => row.totalInterviews
            }
          ]}
        />
      </div>

      {user.role === 'SUPER_ADMIN' && (
        <DashboardTable
          title="Admin management preview"
          description="Platform staff with access to admin controls."
          rows={data.adminRows}
          emptyLabel="No admins found."
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
      )}
    </div>
  );
};

export default DashboardPage;
