import { createContext, useContext } from "react";
import { useGameSocket } from "../hooks/useGameSocket";

const GameSocketContext = createContext(null);

export function GameSocketProvider({ children }) {
  const gameSocket = useGameSocket();

  return (
    <GameSocketContext.Provider value={gameSocket}>
      {children}
    </GameSocketContext.Provider>
  );
}

export function useGameSocketContext() {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error(
      "useGameSocketContext must be used within GameSocketProvider",
    );
  }
  return context;
}
