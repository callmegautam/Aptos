'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type ForgotPasswordFormProps = {
  className?: string;
};

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const searchParams = useSearchParams();

  const redirectBack = searchParams.get('redirect');

  return (
    <form className={cn('flex flex-col gap-6 w-full max-w-md', className)}>
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

          <Input id="email" type="email" placeholder="m@example.com" required />
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
