import { ReportList } from '@/features/reports/report-list';

const ReportPage = () => {
  return (
    <div>
      <div className="flex item-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      <ReportList reports={[]} />
    </div>
  );
};

export default ReportPage;
