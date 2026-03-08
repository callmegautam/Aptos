import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { db } from '../db';
import { companies, candidates } from '../db/schema';
import { eq } from 'drizzle-orm';

export type AccountType = 'candidate' | 'company';

type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  accountType: AccountType;
};

declare module 'next-auth' {
  interface User extends AuthUser {}
  interface Session {
    user: AuthUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accountType: AccountType;
  }
}

async function validatePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

async function getCompanyByEmail(email: string) {
  const [company] = await db.select().from(companies).where(eq(companies.email, email)).limit(1);

  return company ?? null;
}

async function getCandidateByEmail(email: string) {
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.email, email))
    .limit(1);

  return candidate ?? null;
}

async function authorizeUser(
  email: string,
  password: string,
  accountType: AccountType
): Promise<AuthUser | null> {
  if (accountType === 'company') {
    const company = await getCompanyByEmail(email);
    if (!company) return null;

    const valid = await validatePassword(password, company.passwordHash);
    if (!valid) return null;

    if (!company.emailVerified) {
      throw new Error('Company email is not verified');
    }

    return {
      id: company.id.toString(),
      email: company.email,
      name: company.name,
      accountType: 'company'
    };
  }

  const candidate = await getCandidateByEmail(email);
  if (!candidate) return null;

  const valid = await validatePassword(password, candidate.passwordHash);
  if (!valid) return null;

  if (!candidate.emailVerified) {
    throw new Error('Candidate email is not verified');
  }

  return {
    id: candidate.id.toString(),
    email: candidate.email,
    name: candidate.name,
    accountType: 'candidate'
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        accountType: { label: 'Account Type', type: 'text' }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const accountType: AccountType = (credentials.accountType as AccountType) ?? 'company';

        return authorizeUser(credentials.email, credentials.password, accountType);
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accountType = user.accountType;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
      }
      return session;
    }
  }
};

export const { handlers, auth } = NextAuth(authOptions);
