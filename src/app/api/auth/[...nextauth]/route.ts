import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Create the NextAuth handler
const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (
        account &&
        profile &&
        typeof profile === 'object' &&
        'picture' in profile
      ) {
        token.picture = (profile as { picture?: string }).picture;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
  },
});

// Named exports for each HTTP method
export const GET = authHandler;
export const POST = authHandler;
