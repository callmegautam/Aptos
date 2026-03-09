'use client';

import { LoginForm } from '@/features/auth/components/login-form';

const AdminLoginPage = () => {
  return <LoginForm header="Login to admin account" user="ADMIN" />;
};

export default AdminLoginPage;
