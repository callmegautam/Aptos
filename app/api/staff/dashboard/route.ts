import { getCurrentUser } from '@/lib/auth/auth';
import { getStaffDashboardData, isStaffRole, isSuperAdminRole } from '@/lib/dashboard/staff';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaffRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const data = await getStaffDashboardData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Staff dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
