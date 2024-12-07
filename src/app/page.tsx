import Link from "next/link";

export default function Home() {
    return (
        <div>
            <h1>Welcome to SysFile Admin Dashboard</h1>
            <ul>
                <li><Link href="/settings">Global Settings</Link></li>
                <li><Link href="/about">About</Link></li>
                {/* Add more links here */}
            </ul>
        </div>
    );
}
