import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

const ScreenSocketContext = createContext(null);

export const useScreenSocket = () => {
  const context = useContext(ScreenSocketContext);
  if (!context) {
    throw new Error("useScreenSocket must be used within ScreenSocketProvider");
  }
  return context;
};

export const ScreenSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const socketRef = useRef(null);

  useEffect(() => {
    // Only disconnect if we're navigating away from screen/game-repository pages
    const isScreenPage =
      location.pathname.includes("/screen") ||
      location.pathname.includes("/game-repository");

    if (!isScreenPage && socketRef.current) {
      console.log("Leaving screen pages, disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, [location.pathname]);

  const connect = () => {
    if (socketRef.current?.connected) {
      console.log("Screen socket already connected");
      return socketRef.current;
    }

    console.log("Creating new screen socket connection");
    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      console.log("Screen socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Screen socket disconnected");
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    return newSocket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      console.log("Manually disconnecting screen socket");
      socketRef.current.disconnect();
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  };

  return (
    <ScreenSocketContext.Provider
      value={{ socket, isConnected, connect, disconnect }}
    >
      {children}
    </ScreenSocketContext.Provider>
  );
};
