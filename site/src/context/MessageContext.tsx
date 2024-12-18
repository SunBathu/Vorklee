'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageOptions {
  vanishTime?: number;
  blinkCount?: number;
  button?: 'noButton' | 'ok' | 'okCancel' | 'yesNo';
  icon?: 'none' | 'alert' | 'important' | 'danger' | 'success';
  onClose?: () => void;
}

interface MessageContextType {
  message: string;
  options: MessageOptions | null;
  showMessage: (msg: string, options?: MessageOptions) => void;
  clearMessage: () => void;
}

const DEFAULT_MESSAGE = 'Keep an eye here for alerts.';

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const [options, setOptions] = useState<MessageOptions | null>(null);

  const showMessage = (msg: string, opts?: MessageOptions) => {
    // setMessage(msg);
    // setOptions(opts || null);
  const formattedMsg = msg.replace(/\n/g, '<br />'); // Replace newlines with <br />
  setMessage(formattedMsg);
  setOptions(opts || null);
  
// Handle vanish time
if (opts?.vanishTime && opts.vanishTime > 0) {
  setTimeout(() => {
    clearMessage();
  }, opts.vanishTime);
}


    // Handle blinking
    if (opts?.blinkCount && opts.blinkCount > 0) {
      let blinkCountdown = opts.blinkCount * 2; // Each blink has an on/off cycle
      const blinkInterval = setInterval(() => {
        setMessage((prev) => (prev ? '' : msg));
        blinkCountdown--;

        if (blinkCountdown === 0) {
          clearInterval(blinkInterval);
          setMessage(msg); // Ensure the message is shown at the end
        }
      }, 200);
    }
  };

  const clearMessage = () => {
    setMessage(DEFAULT_MESSAGE);
    setOptions(null);
    if (options?.onClose) options.onClose();
  };

  return (
    <MessageContext.Provider
      value={{ message, options, showMessage, clearMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};