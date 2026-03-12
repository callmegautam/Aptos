import { db } from '@/lib/db';
import { admins, candidates, companies, interviewers } from '@/lib/db/schema';
import type { UserRole } from '@/types/auth';
import { desc } from 'drizzle-orm';

export type StaffRole = 'ADMIN' | 'SUPER_ADMIN';

export type DashboardStat = {
  label: string;
  value: number;
  description: string;
};

export type CompanyManagementRow = {
  id: number;
  name: string;
  email: string;
  interviewersCount: number;
  candidatesInterviewedCount: number;
  totalInterviews: number;
  completedInterviews: number;
  activeInterviews: number;
  lastInterviewAt: Date | null;
};

export type InterviewerManagementRow = {
  id: number;
  name: string;
  email: string;
  companyName: string;
  candidatesInterviewedCount: number;
  totalInterviews: number;
  completedInterviews: number;
  activeInterviews: number;
  lastInterviewAt: Date | null;
  emailVerified: boolean | null;
};

export type CandidateManagementRow = {
  id: number;
  name: string;
  email: string;
  companiesInterviewedCount: number;
  interviewersMetCount: number;
  totalInterviews: number;
  completedInterviews: number;
  lastInterviewAt: Date | null;
  emailVerified: boolean | null;
};

export type AdminManagementRow = {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
  emailVerified: boolean | null;
};

export type SystemSettingSection = {
  title: string;
  description: string;
  items: Array<{
    label: string;
    value: string;
    status: 'configured' | 'missing' | 'info';
  }>;
};

export type StaffDashboardData = {
  overviewStats: DashboardStat[];
  companyRows: CompanyManagementRow[];
  interviewerRows: InterviewerManagementRow[];
  candidateRows: CandidateManagementRow[];
  adminRows: AdminManagementRow[];
  systemSettings: SystemSettingSection[];
};

export function isStaffRole(role: UserRole | string | undefined | null): role is StaffRole {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function isSuperAdminRole(
  role: UserRole | string | undefined | null
): role is 'SUPER_ADMIN' {
  return role === 'SUPER_ADMIN';
}

function getLatestDate(current: Date | null, next: Date | null | undefined) {
  if (!next) return current;
  if (!current) return next;
  return next.getTime() > current.getTime() ? next : current;
}

function getInterviewMoment(room: { completedAt: Date | null; scheduledAt: Date }) {
  return room.completedAt ?? room.scheduledAt;
}

function getCandidateKey(room: { candidateId: number | null; candidateName: string | null }) {
  if (room.candidateId) return `candidate:${room.candidateId}`;
  if (room.candidateName?.trim()) return `name:${room.candidateName.trim().toLowerCase()}`;
  return null;
}

export async function getStaffDashboardData(): Promise<StaffDashboardData> {
  const [companyList, interviewerList, candidateList, adminList, rooms] = await Promise.all([
    db
      .select({
        id: companies.id,
        name: companies.name,
        email: companies.email
      })
      .from(companies)
      .orderBy(desc(companies.id)),
    db
      .select({
        id: interviewers.id,
        name: interviewers.name,
        email: interviewers.email,
        companyId: interviewers.companyId,
        emailVerified: interviewers.emailVerified
      })
      .from(interviewers)
      .orderBy(desc(interviewers.id)),
    db
      .select({
        id: candidates.id,
        name: candidates.name,
        email: candidates.email,
        emailVerified: candidates.emailVerified
      })
      .from(candidates)
      .orderBy(desc(candidates.id)),
    db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        emailVerified: admins.emailVerified
      })
      .from(admins)
      .orderBy(desc(admins.id)),
    db.query.interviewRooms.findMany({
      with: {
        company: true,
        interviewer: true,
        candidate: true
      },
      orderBy: (table, operators) => [operators.desc(table.scheduledAt)]
    })
  ]);

  const companiesById = new Map(companyList.map((company) => [company.id, company]));
  const candidatesById = new Map(candidateList.map((candidate) => [candidate.id, candidate]));

  const companyStats = new Map<
    number,
    {
      interviewers: Set<number>;
      candidates: Set<string>;
      totalInterviews: number;
      completedInterviews: number;
      activeInterviews: number;
      lastInterviewAt: Date | null;
    }
  >();

  const interviewerStats = new Map<
    number,
    {
      candidates: Set<string>;
      totalInterviews: number;
      completedInterviews: number;
      activeInterviews: number;
      lastInterviewAt: Date | null;
    }
  >();

  const candidateStats = new Map<
    number,
    {
      companies: Set<number>;
      interviewers: Set<number>;
      totalInterviews: number;
      completedInterviews: number;
      lastInterviewAt: Date | null;
    }
  >();

  for (const room of rooms) {
    const interviewMoment = getInterviewMoment(room);
    const candidateKey = getCandidateKey(room);

    if (room.companyId) {
      const current = companyStats.get(room.companyId) ?? {
        interviewers: new Set<number>(),
        candidates: new Set<string>(),
        totalInterviews: 0,
        completedInterviews: 0,
        activeInterviews: 0,
        lastInterviewAt: null
      };

      current.totalInterviews += 1;
      if (room.status === 'COMPLETED') current.completedInterviews += 1;
      if (room.status === 'SCHEDULED' || room.status === 'LIVE') current.activeInterviews += 1;
      current.interviewers.add(room.interviewerId);
      if (candidateKey) current.candidates.add(candidateKey);
      current.lastInterviewAt = getLatestDate(current.lastInterviewAt, interviewMoment);

      companyStats.set(room.companyId, current);
    }

    if (room.interviewerId) {
      const current = interviewerStats.get(room.interviewerId) ?? {
        candidates: new Set<string>(),
        totalInterviews: 0,
        completedInterviews: 0,
        activeInterviews: 0,
        lastInterviewAt: null
      };

      current.totalInterviews += 1;
      if (room.status === 'COMPLETED') current.completedInterviews += 1;
      if (room.status === 'SCHEDULED' || room.status === 'LIVE') current.activeInterviews += 1;
      if (candidateKey) current.candidates.add(candidateKey);
      current.lastInterviewAt = getLatestDate(current.lastInterviewAt, interviewMoment);

      interviewerStats.set(room.interviewerId, current);
    }

    if (room.candidateId && candidatesById.has(room.candidateId)) {
      const current = candidateStats.get(room.candidateId) ?? {
        companies: new Set<number>(),
        interviewers: new Set<number>(),
        totalInterviews: 0,
        completedInterviews: 0,
        lastInterviewAt: null
      };

      current.totalInterviews += 1;
      if (room.status === 'COMPLETED') current.completedInterviews += 1;
      current.companies.add(room.companyId);
      current.interviewers.add(room.interviewerId);
      current.lastInterviewAt = getLatestDate(current.lastInterviewAt, interviewMoment);

      candidateStats.set(room.candidateId, current);
    }
  }

  const companyRows = companyList
    .map((company) => {
      const stats = companyStats.get(company.id);

      return {
        id: company.id,
        name: company.name,
        email: company.email,
        interviewersCount: stats?.interviewers.size ?? 0,
        candidatesInterviewedCount: stats?.candidates.size ?? 0,
        totalInterviews: stats?.totalInterviews ?? 0,
        completedInterviews: stats?.completedInterviews ?? 0,
        activeInterviews: stats?.activeInterviews ?? 0,
        lastInterviewAt: stats?.lastInterviewAt ?? null
      };
    })
    .sort((a, b) => b.totalInterviews - a.totalInterviews || a.name.localeCompare(b.name));

  const interviewerRows = interviewerList
    .map((interviewer) => {
      const stats = interviewerStats.get(interviewer.id);
      const company = companiesById.get(interviewer.companyId);

      return {
        id: interviewer.id,
        name: interviewer.name,
        email: interviewer.email,
        companyName: company?.name ?? 'Unknown company',
        candidatesInterviewedCount: stats?.candidates.size ?? 0,
        totalInterviews: stats?.totalInterviews ?? 0,
        completedInterviews: stats?.completedInterviews ?? 0,
        activeInterviews: stats?.activeInterviews ?? 0,
        lastInterviewAt: stats?.lastInterviewAt ?? null,
        emailVerified: interviewer.emailVerified ?? null
      };
    })
    .sort((a, b) => b.totalInterviews - a.totalInterviews || a.name.localeCompare(b.name));

  const candidateRows = candidateList
    .map((candidate) => {
      const stats = candidateStats.get(candidate.id);

      return {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        companiesInterviewedCount: stats?.companies.size ?? 0,
        interviewersMetCount: stats?.interviewers.size ?? 0,
        totalInterviews: stats?.totalInterviews ?? 0,
        completedInterviews: stats?.completedInterviews ?? 0,
        lastInterviewAt: stats?.lastInterviewAt ?? null,
        emailVerified: candidate.emailVerified ?? null
      };
    })
    .sort((a, b) => b.totalInterviews - a.totalInterviews || a.name.localeCompare(b.name));

  const adminRows = adminList.sort((a, b) => {
    if (a.role !== b.role) {
      return a.role === 'SUPER_ADMIN' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  const overviewStats: DashboardStat[] = [
    {
      label: 'Total companies',
      value: companyList.length,
      description: 'Registered organizations on the platform'
    },
    {
      label: 'Total interviewers',
      value: interviewerList.length,
      description: 'Interviewers linked to company teams'
    },
    {
      label: 'Total candidates',
      value: candidateList.length,
      description: 'Candidate accounts tracked by the system'
    },
    {
      label: 'Total interviews',
      value: rooms.length,
      description: 'All interview rooms created across companies'
    },
    {
      label: 'Completed interviews',
      value: rooms.filter((room) => room.status === 'COMPLETED').length,
      description: 'Interviews with finished sessions'
    },
    {
      label: 'Active interviews',
      value: rooms.filter((room) => room.status === 'SCHEDULED' || room.status === 'LIVE').length,
      description: 'Scheduled or currently live interview sessions'
    }
  ];

  const systemSettings: SystemSettingSection[] = [
    {
      title: 'Core infrastructure',
      description: 'High-level project services that the platform depends on.',
      items: [
        {
          label: 'Database',
          value: process.env.DATABASE_URL ? 'Configured' : 'Missing DATABASE_URL',
          status: process.env.DATABASE_URL ? 'configured' : 'missing'
        },
        {
          label: 'JWT authentication',
          value: process.env.JWT_SECRET ? 'Configured' : 'Missing JWT_SECRET',
          status: process.env.JWT_SECRET ? 'configured' : 'missing'
        },
        {
          label: 'Realtime video provider',
          value: process.env.NEXT_PUBLIC_STREAM_API_KEY ? 'Configured' : 'Provider key not found',
          status: process.env.NEXT_PUBLIC_STREAM_API_KEY ? 'configured' : 'missing'
        }
      ]
    },
    {
      title: 'Automation and messaging',
      description: 'Background services involved in AI analysis and user notifications.',
      items: [
        {
          label: 'AI resume/interview analysis',
          value: process.env.OPENAI_API_KEY ? 'Configured' : 'Missing OPENAI_API_KEY',
          status: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
        },
        {
          label: 'Email delivery',
          value:
            process.env.RESEND_API_KEY || process.env.MAILTRAP_TOKEN
              ? 'Configured'
              : 'No email provider token found',
          status:
            process.env.RESEND_API_KEY || process.env.MAILTRAP_TOKEN ? 'configured' : 'missing'
        },
        {
          label: 'File uploads',
          value: 'Stored in the public assets directory',
          status: 'info'
        }
      ]
    },
    {
      title: 'Platform governance',
      description: 'Current platform-wide role and account distribution.',
      items: [
        {
          label: 'Super admins',
          value: String(adminRows.filter((admin) => admin.role === 'SUPER_ADMIN').length),
          status: 'info'
        },
        {
          label: 'Admins',
          value: String(adminRows.filter((admin) => admin.role === 'ADMIN').length),
          status: 'info'
        },
        {
          label: 'Verified staff accounts',
          value: String(adminRows.filter((admin) => admin.emailVerified).length),
          status: 'info'
        }
      ]
    }
  ];

  return {
    overviewStats,
    companyRows,
    interviewerRows,
    candidateRows,
    adminRows,
    systemSettings
  };
}
