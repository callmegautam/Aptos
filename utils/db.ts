import { candidates, companies, interviewers, admins } from '@/lib/db/schema';
import { UserRole } from '@/types/auth';

export const getUserTable = (role: UserRole) => {
  const roleTableMap = {
    COMPANY: companies,
    CANDIDATE: candidates,
    INTERVIEWER: interviewers,
    ADMIN: admins,
    SUPER_ADMIN: admins
  } as const;

  return roleTableMap[role];
};
