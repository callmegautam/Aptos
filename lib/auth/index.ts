import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '../db';
import { companies, candidates } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export type AccountType = 'candidate' | 'company';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string | null;
    accountType: AccountType;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accountType: AccountType;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',

      credentials: {
        email: {},
        password: {},
        accountType: {}
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const accountType = (credentials.accountType as AccountType) ?? 'company';

        if (accountType === 'company') {
          const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.email, credentials.email))
            .limit(1);

          if (!company) return null;

          const valid = await bcrypt.compare(credentials.password, company.passwordHash);
          if (!valid) return null;

          if (company.emailVerified === false) {
            throw new Error('Company email is not verified');
          }

          return {
            id: company.id.toString(),
            email: company.email,
            name: company.name,
            accountType: 'company' as const
          };
        }

        // accountType === 'candidate'
        const [candidate] = await db
          .select()
          .from(candidates)
          .where(eq(candidates.email, credentials.email))
          .limit(1);

        if (!candidate) return null;

        const valid = await bcrypt.compare(credentials.password, candidate.passwordHash);
        if (!valid) return null;

        if (candidate.emailVerified === false) {
          throw new Error('Candidate email is not verified');
        }

        return {
          id: candidate.id.toString(),
          email: candidate.email,
          name: candidate.name,
          accountType: 'candidate' as const
        };
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
      if (token && session.user) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
      }
      return session;
    }
  }
};

export const { handlers, auth } = NextAuth(authOptions);
