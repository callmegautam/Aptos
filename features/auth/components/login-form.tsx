'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { loginFormSchema, LoginFormSchema, UserRole } from '@/types/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HTTP_STATUS } from '@/types/http';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type LoginFormProps = {
  className?: string;
  header?: string;
  registerRedirection?: string;
  user: UserRole;
};

export function LoginForm({
  className,
  user = 'COMPANY',
  header = 'Login to your account',
  registerRedirection = '/register'
}: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormSchema>({
    email: '',
    password: ''
  });

  const [accountType, setAccountType] = useState('');

  useEffect(() => {
    setAccountType(user);
  }, [user]);

  // show extra options only for company and candidate
  const showExtraOptions = user === 'COMPANY' || user === 'CANDIDATE';

  let forgetPasswordRedirection = '/login';

  if (user === 'CANDIDATE') forgetPasswordRedirection = '/login/candidate';
  else if (user === 'INTERVIEWER') forgetPasswordRedirection = '/login/interviewer';
  else if (user === 'ADMIN') forgetPasswordRedirection = '/login/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading('Logging in...');
    setIsLoading(true);

    try {
      const { success, data } = loginFormSchema.safeParse(loginForm);

      if (!success) {
        toast.error('Invalid input', { id: loadingToast });
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/api/auth/login', {
        ...data,
        role: isSuperAdmin ? 'SUPER_ADMIN' : user
      });

      if (response.status !== HTTP_STATUS.OK) {
        toast.error(response.data.error, { id: loadingToast });
        return;
      }

      toast.success(response.data.message, { id: loadingToast });

      if (user === 'CANDIDATE') {
        router.push(`/candidate`);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Request failed';
        const status = error.response?.status;

        if (status === HTTP_STATUS.FORBIDDEN) {
          toast.error(message, { id: loadingToast });

          if (user === 'CANDIDATE') {
            router.push(`/verify-email?email=${loginForm.email}&redirect=/candidate`);
            return;
          }

          router.push(`/verify-email?email=${loginForm.email}&redirect=/dashboard`);

          return;
        }

        toast.error(message, { id: loadingToast });
      } else {
        toast.error('Something went wrong', { id: loadingToast });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{header}</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        {user === 'ADMIN' && (
          <Field>
            <FieldLabel htmlFor="role">Login as</FieldLabel>
            <Select
              value={isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN'}
              onValueChange={(v) => setIsSuperAdmin(v === 'SUPER_ADMIN')}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>

            {showExtraOptions && (
              <Link
                href={`/forget-password?redirect=${forgetPasswordRedirection}`}
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>

          <Input
            id="password"
            type="password"
            required
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Login'}
          </Button>
        </Field>

        {showExtraOptions && (
          <>
            <FieldSeparator>Or continue with</FieldSeparator>

            <Field>
              <Button variant="outline" type="button" onClick={() => signIn('google')}>
                Login with Google
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link href={registerRedirection} className="underline underline-offset-4">
                  Sign up
                </Link>
              </FieldDescription>
            </Field>
          </>
        )}
      </FieldGroup>
    </form>
  );
}
