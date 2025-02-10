'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { apiBaseURL } from '@/constants/api';

interface SocketContextData {
  socket: SocketIOClient.Socket | null
}

const SocketContext = createContext<SocketContextData | null>(null);

export const SocketContextProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const singleton = io(apiBaseURL, { transports: ['websocket'] });

    setSocket(singleton)
    
    return () => {
      singleton.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider
      value={{
        socket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within a SocketContextProvider');
  return context;
};