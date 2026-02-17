import { useScreenSocketContext } from "../context/ScreenSocketContext";

function GameScreen() {
  const { roomCode, gameState } = useScreenSocketContext();

  if (!gameState) return null;

  const { controllers, ball } = gameState;
  const player1 = controllers[0];
  const player2 = controllers[1];

  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      {/* Header */}
      <div className='bg-gray-900 p-4 flex justify-between items-center'>
        <div className='text-2xl font-bold'>
          Player 1: <span className='text-blue-400'>{player1?.score || 0}</span>
        </div>
        <div className='text-xl text-gray-400'>🏓 Ping Pong</div>
        <div className='text-2xl font-bold'>
          Player 2: <span className='text-red-400'>{player2?.score || 0}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className='flex-1 relative bg-green-900'>
        {/* Center Line */}
        <div className='absolute left-1/2 top-0 bottom-0 w-1 bg-white opacity-30'></div>

        {/* Player 1 Paddle (Left) */}
        <div
          className='absolute left-4 w-4 h-24 bg-blue-500 rounded transition-all duration-75'
          style={{ top: `${player1?.y}%`, transform: "translateY(-50%)" }}
        ></div>

        {/* Player 2 Paddle (Right) */}
        <div
          className='absolute right-4 w-4 h-24 bg-red-500 rounded transition-all duration-75'
          style={{ top: `${player2?.y}%`, transform: "translateY(-50%)" }}
        ></div>

        {/* Ball */}
        <div
          className='absolute w-6 h-6 bg-white rounded-full transition-all duration-75'
          style={{
            left: `${ball?.x}%`,
            top: `${ball?.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>

      {/* Footer */}
      <div className='bg-gray-900 p-2 text-center text-sm text-gray-500'>
        Room: {roomCode}
      </div>
    </div>
  );
}

export default GameScreen;
