import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

interface OnlineUser {
  userId: string;
  user: any;
  socketId: string;
  connectedAt: Date;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (token && currentUser) {
      // Initialize socket connection
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      // Listen for online users updates
      newSocket.on('online_users', (users: OnlineUser[]) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Disconnect socket if no token or user
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [token, currentUser]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};


