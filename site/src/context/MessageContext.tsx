'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
  message: string | null;
  setMessage: (msg: string | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (
  options?: {
    vanishTime?: number;
    buttons?: 'okCancel' | 'yesNo';
    icon?: 'alert' | 'important' | 'danger';
    onClose?: () => void;
  },
) => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }

  const { setMessage } = context;

  const showMessage = (
    message: string,
    blinkCount: number = 0,
    options?: {
      vanishTime?: number;
      buttons?: 'okCancel' | 'yesNo';
      icon?: 'alert' | 'important' | 'danger';
      onClose?: () => void;
    },
  ) => {
    setMessage(message);
    if (options?.vanishTime === 0) {
      // show till user closed
    } else if (options?.vanishTime) {
      setTimeout(() => setMessage(null), options.vanishTime);
    }
    if (options?.onClose) {
      setTimeout(options.onClose, options.vanishTime);
    }
    if (blinkCount > 0) {
      const blinkTimeout = 200;
      let blinkCountdown = blinkCount;
      const blinkInterval = setInterval(() => {
        setMessage((prev) => (prev ? null : message));
        if (--blinkCountdown === 0) {
          clearInterval(blinkInterval);
          setMessage(message);
        }
      }, blinkTimeout);
    }
  };


  return {
    ...context,
    showMessage,
  };
};
