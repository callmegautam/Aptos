'use client';

import { GalleryVerticalEnd, GalleryVerticalEndIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LoginPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let imageSrc = '/images/placeholder.svg';

  if (pathname === '/login') {
    imageSrc = '/images/placeholder.svg';
  } else if (pathname === '/login/candidate') {
    imageSrc = '/images/candidate.jpg';
  } else if (pathname === '/login/admin') {
    imageSrc = '/images/admin.jpg';
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Aptos Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={imageSrc}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
