import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['CANDIDATE', 'COMPANY'])
});

export const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CANDIDATE', 'COMPANY', 'INTERVIEWER', 'ADMIN', 'SUPER_ADMIN'])
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string()
});

export const userRoleEnum = [
  'COMPANY',
  'INTERVIEWER',
  'CANDIDATE',
  'ADMIN',
  'SUPER_ADMIN'
] as const;

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type VerifySchema = z.infer<typeof verifySchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type UserRole = (typeof userRoleEnum)[number];
