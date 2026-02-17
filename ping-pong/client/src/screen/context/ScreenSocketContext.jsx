import { createContext, useContext } from "react";
import { useScreenSocket } from "../hooks/useScreenSocket";

const ScreenSocketContext = createContext(null);

export function ScreenSocketProvider({ children }) {
  const screenSocket = useScreenSocket();

  return (
    <ScreenSocketContext.Provider value={screenSocket}>
      {children}
    </ScreenSocketContext.Provider>
  );
}

export function useScreenSocketContext() {
  const context = useContext(ScreenSocketContext);
  if (!context) {
    throw new Error(
      "useScreenSocketContext must be used within ScreenSocketProvider",
    );
  }
  return context;
}
