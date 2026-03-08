import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  accountType: z.enum(['candidate', 'company'])
});

export const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
  //   accountType: z.enum(['candidate', 'company'])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  accountType: z.enum(['candidate', 'company'])
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const forgetPasswordSchema = z.object({
  email: z.string().email(),
  accountType: z.enum(['candidate', 'company'])
});
const forgetPasswordFormSchema = z.object({
  email: z.string().email()
});
const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4)
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export type ForgetPasswordFormSchema = z.infer<typeof forgetPasswordFormSchema>;
export type VerifySchema = z.infer<typeof verifySchema>;
