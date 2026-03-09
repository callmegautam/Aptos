import { z } from 'zod';

export const candidateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().max(20).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional()
});

export const createCandidateSchema = candidateSchema.pick({
  name: true,
  email: true,
  phone: true,
  avatarUrl: true
});

export const updateCandidateSchema = candidateSchema.pick({
  name: true,
  email: true,
  phone: true,
  avatarUrl: true
});

export type Candidate = z.infer<typeof candidateSchema>;
export type CreateCandidate = z.infer<typeof createCandidateSchema>;
export type UpdateCandidate = z.infer<typeof updateCandidateSchema>;
