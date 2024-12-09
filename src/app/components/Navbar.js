import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar">
      {session && (
        <div>
          <img
            src={session.user.picture}
            alt="Profile"
            width={32}
            height={32}
            onClick={() => alert(session.user.email)}
            style={{ cursor: 'pointer', borderRadius: '50%' }}
          />
        </div>
      )}
    </div>
  );
}
