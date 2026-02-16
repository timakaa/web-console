import { useState, useEffect } from "react";

function FirstPlayerWaiting({ socket, roomCode, onGameStart }) {
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    if (!socket) return;

    socket.on("player-count-updated", ({ totalControllers }) => {
      setPlayerCount(totalControllers);
    });

    socket.on("game-started", () => {
      onGameStart();
    });

    return () => {
      socket.off("player-count-updated");
      socket.off("game-started");
    };
  }, [socket, onGameStart]);

  const handleContinue = () => {
    if (socket) {
      socket.emit("start-game", { roomCode: roomCode.toUpperCase() });
    }
  };

  return (
    <div className='min-h-screen flex flex-col p-8'>
      <div className='text-center mb-8'>
        <h2 className='text-xl font-semibold text-green-400 mb-2'>
          Connected to Room
        </h2>
        <p className='text-4xl font-bold tracking-widest text-indigo-400'>
          {roomCode}
        </p>
        <p className='text-gray-400 mt-4'>
          {playerCount} player{playerCount !== 1 ? "s" : ""} connected
        </p>
      </div>

      <div className='flex-1 flex flex-col items-center justify-center gap-8'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>👑</div>
          <h3 className='text-2xl font-bold mb-2'>You're the First Player!</h3>
          <p className='text-gray-400 mb-8'>
            Wait for other players to join, then start the game
          </p>
        </div>

        <button
          onClick={handleContinue}
          className='px-8 py-4 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg transition-colors'
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default FirstPlayerWaiting;
