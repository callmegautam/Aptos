'use client';

import RoomsTable from '@/features/rooms/components/rooms-table';

export default function RoomsPage() {
  return (
    <div className="min-h-svh p-10 bg-background">
      <h1 className="text-2xl font-bold mb-6">Rooms Management</h1>
      <RoomsTable />
    </div>
  );
}
