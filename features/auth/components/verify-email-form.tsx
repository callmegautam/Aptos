'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MailIcon, TruckElectricIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';

type VerifyEmailFormProps = {
  className?: string;
};

export function VerifyEmailForm({ className }: VerifyEmailFormProps) {
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const searchParams = useSearchParams();
  const [error, setError] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const redirectionLink = searchParams.get('redirect');
    const emailVerify = searchParams.get('email');

    if (!redirectionLink || !emailVerify) {
      // toast.error('Please provide email and redirect link');
      return;
    }
    setError(false);

    setEmail(emailVerify);
    setRedirect(redirectionLink);
  }, []);

  if (error) {
    return (
      <>
        <div className="flex justify-center items-center">
          <h1>Please provide email and redirection link</h1>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-email', { email, otp });

      if (response.status !== HTTP_STATUS.OK) {
        toast.error(response.data.error);
        return;
      }

      toast.success(response.data.message);
      router.push(redirect || '/dashboard');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
          {Array.from({ length: 4 }).map((_, index) => (
            <Input
              key={index}
              maxLength={1}
              className="h-14 w-14 text-center text-lg"
              value={otp[index]}
              onChange={(e) =>
                setOtp((prev) => prev.slice(0, index) + e.target.value + prev.slice(index + 1))
              }
            />
          ))}
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
          <Link href={redirect || '/login'} className="underline underline-offset-4">
            ← Back to log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
