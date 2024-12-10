import NextAuth, { DefaultSession, DefaultUser, JWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultUser & {
      picture?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    picture?: string;
  }
}
