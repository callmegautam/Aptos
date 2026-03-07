'use client';

import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/features/dashboard/components/dashboard-stats';
// import InterviewTable from '@/features/dashboard/components/interview-table';
import { downloadCSV } from '@/utils/download-csv';
import { PlusIcon, DownloadIcon } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadCSV()} aria-label="Download data">
            <DownloadIcon className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button variant="outline">
            <PlusIcon className="w-4 h-4" />
            Add Interview
          </Button>
        </div>
      </div>
      <DashboardStats />
      <div className="flex justify-center">{/* <InterviewTable /> */}</div>
      <div className="flex justify-center">{/* <DemoTable /> */}</div>
    </div>
  );
};

export default DashboardPage;
