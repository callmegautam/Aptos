'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldDescription } from '@/components/ui/field';
import { CheckCircleIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type EmailVerifiedFormProps = {
  className?: string;
};

export function EmailVerifiedForm({ className }: EmailVerifiedFormProps) {
  const searchParams = useSearchParams();

  const redirectBack = searchParams.get('redirect');
  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-md', className)}>
      <FieldGroup>
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl border bg-muted">
            <CheckCircleIcon className="size-6" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Email verified</h1>

          <p className="text-sm text-muted-foreground">
            Your email has been successfully verified.
            <br />
            Click below to log in magically.
          </p>
        </div>

        {/* Continue Button */}
        <Button className="w-full">Continue</Button>

        {/* Resend */}
        <FieldDescription className="text-center">
          Didn’t receive the email?{' '}
          <button type="button" className="underline underline-offset-4">
            Click to resend
          </button>
        </FieldDescription>

        {/* Back to login */}
        <FieldDescription className="text-center">
          <Link href={redirectBack || '/login'} className="underline underline-offset-4">
            ← Back to log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </div>
  );
}
