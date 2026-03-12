'use client';
import { ReportList } from '@/features/reports/components/report-list';
import { useUserStore } from '@/lib/store/user-store';
import { InterviewRoomWithRelations } from '@/types/interview-room';
import { HTTP_STATUS } from '@/types/http';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReportPage = () => {
  const [reports, setReports] = useState<InterviewRoomWithRelations[]>([]);
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/reports');
        if (response.status === HTTP_STATUS.OK) {
          setReports(response.data.reports);
        } else {
          toast.error(response.data?.error ?? 'Failed to load reports');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.error || 'Request failed';
          toast.error(message);
        } else {
          toast.error('Something went wrong while loading reports');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (!user) {
    return <div>Unauthorized</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex item-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      <ReportList reports={reports} />
    </div>
  );
};

export default ReportPage;
