import {
  ScreenSocketProvider,
  useScreenSocketContext,
} from "./context/ScreenSocketContext";
import ErrorScreen from "./components/ErrorScreen";
import LoadingScreen from "./components/LoadingScreen";
import LobbyScreen from "./components/LobbyScreen";
import GameScreen from "./components/GameScreen";
import GameEndScreen from "./components/GameEndScreen";

function ScreenContent() {
  const { roomCode, isConnected, gameState, gameStarted, gameEnded } =
    useScreenSocketContext();

  // Error state - invalid URL
  if (!roomCode) {
    return <ErrorScreen />;
  }

  // Loading state - connecting or waiting for game state
  if (!isConnected || !gameState) {
    return <LoadingScreen />;
  }

  // Game ended - show victory/defeat
  if (gameEnded) {
    return <GameEndScreen />;
  }

  // Lobby - waiting to start
  if (!gameStarted) {
    return <LobbyScreen />;
  }

  // Active game
  return <GameScreen />;
}

function Screen() {
  return (
    <ScreenSocketProvider>
      <ScreenContent />
    </ScreenSocketProvider>
  );
}

export default Screen;
