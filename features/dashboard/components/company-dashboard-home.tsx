'use client';

import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/features/dashboard/components/dashboard-stats';
import { downloadCSV } from '@/utils/download-csv';
import { DownloadIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const CompanyDashboardHome = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadCSV()} aria-label="Download data">
            <DownloadIcon className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <DashboardStats data={data.stats} />
      <div className="flex justify-center" />
      <div className="flex justify-center" />
    </div>
  );
};

export default CompanyDashboardHome;
