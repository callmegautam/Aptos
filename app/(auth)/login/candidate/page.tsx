'use client';
import { LoginForm } from '@/features/auth/components/login-form';

const CandidateLoginPage = () => {
  return <LoginForm registerRedirection="/register/candidate" user="CANDIDATE" />;
};

export default CandidateLoginPage;
