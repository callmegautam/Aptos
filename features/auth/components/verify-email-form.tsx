'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MailIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type VerifyEmailFormProps = {
  className?: string;
  email?: string;
};

export function VerifyEmailForm({
  className,
  email = 'olivia@untitledui.com'
}: VerifyEmailFormProps) {
  const searchParams = useSearchParams();

  const redirectBack = searchParams.get('redirect');
  return (
    <form className={cn('flex flex-col gap-6 w-full max-w-md', className)}>
      <FieldGroup>
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl border bg-muted">
            <MailIcon className="size-5" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>

          <p className="text-sm text-muted-foreground">
            We sent a verification link to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4">
          <Input maxLength={1} className="h-14 w-14 text-center text-lg" />
          <Input maxLength={1} className="h-14 w-14 text-center text-lg" />
          <Input maxLength={1} className="h-14 w-14 text-center text-lg" />
          <Input maxLength={1} className="h-14 w-14 text-center text-lg" />
        </div>

        {/* Button */}
        <Button type="submit" className="w-full">
          Verify email
        </Button>

        {/* Resend */}
        <FieldDescription className="text-center">
          Didn’t receive the email?{' '}
          <button type="button" className="underline underline-offset-4">
            Click to resend
          </button>
        </FieldDescription>

        {/* Back */}
        <FieldDescription className="text-center">
          <Link href={redirectBack || '/login'} className="underline underline-offset-4">
            ← Back to log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
