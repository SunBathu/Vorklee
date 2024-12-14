'use client';

import React from 'react';
import { useMessage } from '@/context/MessageContext';

export default function TopMessageBar() {
  const { message, options, clearMessage } = useMessage();

  return (
    <div className="h-12 bg-blue-600 text-white flex items-center px-4 shadow-md">
      <div className="flex items-center space-x-4">
        {/* Buttons */}
        {options?.buttons === 'okCancel' && (
          <div className="flex space-x-2">
            <button
              onClick={clearMessage}
              className="px-6 py-1 bg-green-500 text-white rounded"
            >
              OK
            </button>
            <button
              onClick={clearMessage}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Separator */}
        {options?.buttons && <div className="h-2 w-0 bg-blue-600"></div>}

        {/* Icon Display */}
        {options?.icon === 'alert' && <span className="mr-1">⚠️</span>}
        {options?.icon === 'important' && <span className="mr-1">❗</span>}
        {options?.icon === 'danger' && <span className="mr-1">🚨</span>}

        {/* Message */}
        <span className="text-white text-xl">{message}</span>
      </div>
    </div>
  );
}
