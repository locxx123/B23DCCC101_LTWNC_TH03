import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { USERS } from '@/data/users';
import type { Role } from '@/types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize(credentials) {
        const user = USERS.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password,
        );
        return user
          ? { id: user.id, name: user.name, email: user.email, role: user.role }
          : null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role as Role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as Role;
      return session;
    },
  },
});
