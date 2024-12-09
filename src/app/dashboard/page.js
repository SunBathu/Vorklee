import { useSession, signIn } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    signIn('google');
    return <p>Redirecting...</p>;
  }

  return <div>Welcome, {session.user.name}</div>;
}
