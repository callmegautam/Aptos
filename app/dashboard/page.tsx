'use client';
import { getCurrentUser } from '@/lib/auth/auth';
import {
  DashboardStat,
  getStaffDashboardData,
  isStaffRole,
  StaffDashboardData
} from '@/lib/dashboard/staff';
import CompanyDashboardHome from '@/features/dashboard/components/company-dashboard-home';
import {
  DashboardTable,
  DateCell,
  PageIntro,
  RoleBadge,
  StaffStatsGrid,
  VerificationBadge
} from '@/features/dashboard/components/staff-dashboard-primitives';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';

const dashboardStatsData: DashboardStatsProps['data'] = [
  {
    name: 'Total candidates',
    stat: '3,450',
    change: '+12.1%',
    changeType: 'positive'
  },
  {
    name: 'Weekly sessions',
    stat: '1,342',
    change: '-9.8%',
    changeType: 'negative'
  },
  {
    name: 'Average duration',
    stat: '5.2min',
    change: '+7.7%',
    changeType: 'positive'
  },
  {
    name: 'Total interviews',
    stat: '100',
    change: '+100%',
    changeType: 'positive'
  }
];

const DashboardPage = () => {
  const user = useUserStore((state) => state.user);
  const [data, setData] = useState<StaffDashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/staff/dashboard');
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <CompanyDashboardHome />;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 ">
      <PageIntro
        title={user.role === 'SUPER_ADMIN' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
        description="Track platform-wide usage, compare company performance, and monitor interviewer and candidate activity from one place."
      />

      {/* <StaffStatsGrid stats={data.overviewStats} /> */}
      <div>
        <DashboardStats
          dashboardStatsData={data.overviewStats.map((stat) => ({
            name: stat.label,
            stat: stat.value.toString(),
            change: '',
            changeType: 'positive'
          }))}
        />
      </div>

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

interface DashboardStatsProps {
  data: {
    name: string;
    stat: string;
    change: string;
    changeType: 'positive' | 'negative';
  }[];
}

export function DashboardStats({
  dashboardStatsData
}: {
  dashboardStatsData: DashboardStatsProps['data'];
}) {
  return (
    <div className="px-10">
      <dl className="flex flex-wrap gap-6">
        {dashboardStatsData.map((item) => (
          <Card key={item.name} className="w-[220px] p-6 py-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">{item.name}</dt>

                {/* <Badge
                  variant="outline"
                  className={cn(
                    'font-medium inline-flex items-center px-1.5 ps-2.5 py-0.5 text-xs',
                    item.changeType === 'positive'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {item.changeType === 'positive' ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  {item.change}
                </Badge> */}
              </div>

              <dd className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
                {item.stat}
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
    </div>
  );
}
