import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isSuperAdminRole } from '@/lib/dashboard/staff';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await getStaffDashboardData();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Staff dashboard API error:', error);

    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
