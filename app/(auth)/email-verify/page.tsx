'use client';
import { EmailVerifiedForm } from '@/features/auth/components/email-verify-form';
import { GalleryVerticalEndIcon } from 'lucide-react';
import Link from 'next/link';

export default function EmailVerifiedPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center px-6">
      {/* Logo */}
      <div className="absolute top-10 left-10">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Aptos Inc.
        </Link>
      </div>

      {/* Center Form */}
      <EmailVerifiedForm />
    </div>
  );
}
