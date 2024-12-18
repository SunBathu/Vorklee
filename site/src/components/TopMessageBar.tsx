// showMessage(data.globalSettings?.storagePat, {vanishTime: 0, blinkCount: 2, button: constants.MSG.BUTTON.OK, icon: 'alert',});'use client';

import React from 'react';
import { useMessage } from '@/context/MessageContext';
import * as constants from '@/utils/constants';

export default function TopMessageBar() {
  const { message, options, clearMessage } = useMessage();

  // Determine font size based on message length
  const getFontSize = () => {
    if (!message) return 'text-xl'; // Default font size
    if (message.length > 100) return 'text-sm'; // Smaller font for long messages
    if (message.length > 50) return 'text-base'; // Medium font for moderately long messages
    return 'text-xl'; // Default large font for short messages
  };

  return (
    <div className="h-12 bg-blue-600 text-white flex items-center px-4 shadow-md">
      <div className="flex items-center space-x-4">
        {/* Buttons */}
        {/* {options?.button === constants.MSG.BUTTON.NOBUTTON && (

        )} */}
        {options?.button === constants.MSG.BUTTON.OK && (
          <div className="flex space-x-2">
            <button
              onClick={clearMessage}
              className="px-6 py-1 bg-green-500 text-white rounded"
            >
              OK
            </button>            
          </div>
        )}
        {options?.button === constants.MSG.BUTTON.OKCANCEL && (
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
        
        {options?.button === constants.MSG.BUTTON.YESNO && (
          <div className="flex space-x-2">
            <button
              onClick={clearMessage}
              className="px-6 py-1 bg-green-500 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={clearMessage}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              No
            </button>
          </div>
        )}

        {/* Separator */}
        {options?.button && <div className="h-2 w-0 bg-blue-600"></div>}

        {/* Icon Display */}
        {options?.icon === 'alert' && <span className="mr-1">⚠️</span>}
        {options?.icon === 'important' && <span className="mr-1">❗</span>}
        {options?.icon === 'danger' && <span className="mr-1">🚨</span>}        
        {options?.icon === 'success' && <span className="mr-1" style={{ color: 'green' }}>✅</span>}

        {/* Message with Dynamic Font Size */}
        <span className={`text-white ${getFontSize()}`}>{message}</span>
      </div>
    </div>
  );
}
