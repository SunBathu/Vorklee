// app\components\Sidebar.js
export default function Sidebar() {
    return (
      <div className="w-60 bg-gray-800 text-white h-screen p-4">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <ul>
          <li><a href="/" className="block py-2">Dashboard</a></li>
          <li><a href="/settings" className="block py-2">Settings</a></li>
        </ul>
      </div>
    );
  }
  