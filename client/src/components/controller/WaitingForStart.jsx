import { useState, useEffect } from "react";

function WaitingForStart({ socket, roomCode, onGameStart }) {
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
          <div className='text-6xl mb-4 animate-pulse'>⏳</div>
          <h3 className='text-2xl font-bold mb-2'>Waiting for Game to Start</h3>
          <p className='text-gray-400'>
            The first player will start the game when everyone is ready
          </p>
        </div>
      </div>
    </div>
  );
}

export default WaitingForStart;
