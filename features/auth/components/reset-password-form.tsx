'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CheckIcon, LockIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type ResetPasswordFormProps = {
  className?: string;
};

export function ResetPasswordForm({ className }: ResetPasswordFormProps) {
  const searchParams = useSearchParams();

  const redirectBack = searchParams.get('redirect');
  return (
    <form className={cn('flex flex-col gap-6', className)}>
      <FieldGroup>
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl border bg-muted">
            <LockIcon className="size-5" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set new password</h1>

          <p className="text-sm text-muted-foreground">
            Your new password must be different to previously used passwords.
          </p>
        </div>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input id="password" type="password" required />
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>

          <Input id="confirm-password" type="password" required />
        </Field>

        {/* Password Rules */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckIcon className="size-4 text-green-500" />
            Must be at least 8 characters
          </div>

          <div className="flex items-center gap-2">
            <CheckIcon className="size-4 text-green-500" />
            Must contain one special character
          </div>
        </div>

        {/* Button */}
        <Field>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </Field>

        {/* Back to login */}
        <FieldDescription className="text-center">
          <Link href={redirectBack || '/login'} className="underline underline-offset-4">
            ← Back to log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
