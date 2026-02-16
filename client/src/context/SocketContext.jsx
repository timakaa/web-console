import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const socketRef = useRef(null);

  useEffect(() => {
    // Only disconnect if navigating to home page
    const isHomePage = location.pathname === "/";

    if (isHomePage && socketRef.current) {
      console.log("Navigating to home, disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, [location.pathname]);

  const connect = () => {
    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return socketRef.current;
    }

    console.log("Creating new socket connection");
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    return newSocket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      console.log("Manually disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connect, disconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
};
