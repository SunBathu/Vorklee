// src\app\page.tsx
import Sidebar from './components/Sidebar';
import TopMenu from './components/TopMenu';

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <TopMenu />
        <div className="p-4">
          <h1>Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
