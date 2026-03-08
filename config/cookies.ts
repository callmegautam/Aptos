export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: process.env.NODE_ENV === 'production',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
};

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
  path: string;
};
