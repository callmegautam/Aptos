import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/auth';
import { isSuperAdminRole } from '@/lib/dashboard/staff';
import PlatformSettingsPage from '@/features/dashboard/components/platform-settings-page';

const SettingsPage = async () => {
  const user = await getCurrentUser();

  if (!isSuperAdminRole(user?.role)) {
    redirect('/dashboard');
  }

  return <PlatformSettingsPage />;
};

export default SettingsPage;
