'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { InterviewRoomWithRelations } from '@/types/interview-room';
import { FileTextIcon } from 'lucide-react';

type ReportListProps = {
  reports: InterviewRoomWithRelations[];
};

export function ReportList({ reports }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileTextIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No interview reports yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Reports will appear here once you create interview rooms.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>;
}
