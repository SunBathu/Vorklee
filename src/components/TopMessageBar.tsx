// src/components/TopMessageBar.tsx

export default function TopMessageBar() {
  return (
    <div className="h-12 bg-blue-600 text-white flex items-center pl-72 fixed top-0 left-0 right-0 z-10">
      <span className="text-lg font-semibold">
        Welcome to Vorklee! Here you'll find helpful messages and updates.
      </span>
    </div>
  );
}
