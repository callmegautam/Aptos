import { candidates, companies, interviewers, admins } from '@/lib/db/schema';

const roleToTable = {
  COMPANY: companies,
  CANDIDATE: candidates,
  INTERVIEWER: interviewers,
  ADMIN: admins
} as const;
