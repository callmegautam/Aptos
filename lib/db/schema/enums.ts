import { pgEnum } from 'drizzle-orm/pg-core';
import {
  interviewStatusEnum as interviewStatusEnumValues,
  interviewFieldEnum as interviewFieldEnumValues
} from '@/types/interview-room';

export const interviewStatusEnum = pgEnum('interview_status', interviewStatusEnumValues);

export const interviewFieldEnum = pgEnum('interview_field', interviewFieldEnumValues);

export const uploadedByEnum = pgEnum('uploaded_by', ['CANDIDATE', 'INTERVIEWER', 'COMPANY']);
