'use client';

import { LoginForm } from '@/features/auth/components/login-form';

const CompanyLoginPage = () => {
  return <LoginForm header="Login to company account" user="company" />;
};

export default CompanyLoginPage;
