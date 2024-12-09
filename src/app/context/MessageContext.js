'use client';
import { createContext, useState, useContext } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  return (
    <MessageContext.Provider value={{ message, setMessage, error, setError }}>
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
