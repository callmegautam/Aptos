'use client';

import RegisterForm from '@/features/auth/components/register-form';

const CandidateRegistrationPage = () => {
  return <RegisterForm name="Full name" LoginRedirection="/login/candidate" />;
};

export default CandidateRegistrationPage;
