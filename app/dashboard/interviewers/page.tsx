import { Button } from '@/components/ui/button';
// import InterviewTable from '@/features/dashboard/components/interview-table';
import { PlusIcon } from 'lucide-react';
import InterviewersTable from '@/features/interviewers/components/table';

const InterviewersPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Interviewers</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4" />
            Add Interviewer
          </Button>
        </div>
      </div>
      <InterviewersTable />
    </div>
  );
};

export default InterviewersPage;
