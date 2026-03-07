'use client';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';
import { GalleryVerticalEndIcon } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center px-6">
      {/* Logo */}
      <div className="absolute top-10 left-10">
        <a href="/" className="flex items-center gap-2 font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Aptos Inc.
        </a>
      </div>

      {/* Center Form */}
      <VerifyEmailForm />
    </div>
  );
}
