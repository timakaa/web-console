import {
  GameSocketProvider,
  useGameSocketContext,
} from "./context/GameSocketContext";
import AnimatedBackground from "./components/AnimatedBackground";
import ControllerHeader from "./components/ControllerHeader";
import ErrorScreen from "./components/ErrorScreen";
import GameEndScreen from "./components/GameEndScreen";
import LobbyControls from "./components/LobbyControls";
import GameControls from "./components/GameControls";

function ControllerContent() {
  const { roomCode, playerId, gameStarted, gameEnded } = useGameSocketContext();

  // Error state - invalid URL
  if (!roomCode || !playerId) {
    return <ErrorScreen />;
  }

  // Game ended - show victory/defeat
  if (gameEnded) {
    return <GameEndScreen />;
  }

  // Main controller UI
  return (
    <div className='h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white overflow-hidden fixed inset-0'>
      <AnimatedBackground />

      <div className='relative z-10 flex flex-col h-full'>
        <ControllerHeader />

        <div className='flex-1'></div>

        {!gameStarted ? <LobbyControls /> : <GameControls />}
      </div>
    </div>
  );
}

function Controller() {
  return (
    <GameSocketProvider>
      <ControllerContent />
    </GameSocketProvider>
  );
}

export default Controller;
