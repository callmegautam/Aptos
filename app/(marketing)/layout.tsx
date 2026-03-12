'use client';
import React from 'react';
// import { Footer, Navbar } from '@/components
import Navbar from '@/features/home/components/navbar';
import Footer from '@/features/home/components/footer';
import { useUserStore } from '@/lib/store/user-store';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  const user = useUserStore((state) => state.user);

  if (user && user?.role === 'CANDIDATE') {
    return redirect('/candidate');
  } else if (user && user?.role === 'COMPANY') {
    return redirect('/dashboard');
  } else if (user && user?.role === 'INTERVIEWER') {
    return redirect('/dashboard');
  } else if (user && user?.role === 'ADMIN') {
    return redirect('/dashboard');
  } else if (user && user?.role === 'SUPER_ADMIN') {
    return redirect('/dashboard');
  }

  return (
    <>
      <div className="bg-[#0A0A0A]">
        <div
          id="home"
          className="opacity-5 absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] h-full"
        />

        <Navbar />
        <main className="mt-20 mx-auto w-full z-0 relative ">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MarketingLayout;
