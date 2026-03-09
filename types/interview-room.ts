import { z } from 'zod';
import { interviewerSchema } from './interviewer';
import { candidateSchema } from './candidate';

export const interviewStatusEnum = ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'] as const;
export const interviewFieldEnum = ['BACKEND', 'FRONTEND', 'FULLSTACK', 'APPLICATION'] as const;

export const interviewRoomSchema = z.object({
  id: z.number().int().positive(),
  companyId: z.number().int().positive(),
  interviewerId: z.number().int().positive(),
  candidateId: z.number().int().positive().nullable().optional(),
  candidateName: z.string().nullable().optional(),
  roomCode: z.string().min(1),
  jobTitle: z.string().min(1),
  jobDescription: z.string().nullable().optional(),
  resumeUrl: z.string().nullable().optional(),
  status: z.enum(interviewStatusEnum).default('SCHEDULED'),
  field: z.enum(interviewFieldEnum),
  scheduledAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable().optional(),
  durationSeconds: z.number().int().positive().nullable().optional()
});

export const interviewRoomWithRelationsSchema = interviewRoomSchema.extend({
  interviewer: interviewerSchema,
  candidate: candidateSchema
});

export const createRoomSchema = interviewRoomSchema.pick({
  interviewerId: true,
  candidateName: true,
  jobTitle: true,
  jobDescription: true,
  status: true,
  field: true,
  scheduledAt: true
});

export const updateInterviewRoomSchema = interviewRoomSchema.pick({
  interviewerId: true,
  candidateName: true,
  jobTitle: true,
  jobDescription: true,
  resumeUrl: true,
  status: true,
  field: true,
  scheduledAt: true
});
// .partial();

export type InterviewRoom = z.infer<typeof interviewRoomSchema>;
export type CreateInterviewRoom = z.infer<typeof createRoomSchema>;
export type UpdateInterviewRoom = z.infer<typeof updateInterviewRoomSchema>;
export type InterviewRoomStatus = (typeof interviewStatusEnum)[number];
export type InterviewField = (typeof interviewFieldEnum)[number];

export type InterviewRoomWithRelations = z.infer<typeof interviewRoomWithRelationsSchema>;
