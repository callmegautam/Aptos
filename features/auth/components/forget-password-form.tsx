'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import toast from 'react-hot-toast';

type ForgotPasswordFormProps = {
  className?: string;
};

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectBack = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/auth/reset-password', {
        params: {
          email
        }
      });

      if (response.status === HTTP_STATUS.OK) {
        router.push(`/verify-email?redirect=/reset-password?email=${email}&email=${email}`);
      }

      console.log(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      console.log(error);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6 w-full max-w-md', className)} onSubmit={handleSubmit}>
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot password?</h1>

          <p className="text-sm text-muted-foreground">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Field>

        {/* Button */}
        <Field>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </Field>

        {/* Back to login */}
        <FieldDescription className="text-center">
          Remember your password?{' '}
          <Link href={redirectBack || '/login'} className="underline underline-offset-4">
            Back to log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
