'use client';

import { useMessage } from '@/context/MessageContext';

export default function TopMessageBar() {
  const { message, setMessage } = useMessage();

  return (
    <div className="w-full bg-blue-600 text-white p-4 shadow-md h-14 flex items-center">
      <div className="flex items-center w-full max-w-4xl">
        {message ? (
          <>
            <button
              onClick={() => setMessage(null)}
              className="mr-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md transition-transform transform hover:scale-110"
            >
              &times;
            </button>
            <span className="text-lg">{message}</span>
          </>
        ) : (
          <span className="text-gray-400">No notifications</span>
        )}
      </div>
    </div>
  );
}
