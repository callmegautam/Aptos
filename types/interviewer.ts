import { z } from 'zod';

export const interviewerSchema = z.object({
  id: z.number().int().positive(),
  companyId: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().max(20).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional()
});

export const createInterviewerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().optional().nullable()
});

export const updateInterviewerSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    phone: z.string().max(20).optional().nullable(),
    avatarUrl: z.string().url().optional().nullable()
  })
  .partial();

export type Interviewer = z.infer<typeof interviewerSchema>;
export type CreateInterviewer = z.infer<typeof createInterviewerSchema>;
export type UpdateInterviewer = z.infer<typeof updateInterviewerSchema>;

