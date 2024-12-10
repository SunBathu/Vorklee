import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.picture = token.picture;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && profile && (profile as { picture?: string }).picture) {
        token.picture = (profile as { picture: string }).picture;
      }

      return token;
    },
  },
});

export { handler as GET, handler as POST };
