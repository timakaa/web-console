import { useScreenSocketContext } from "../context/ScreenSocketContext";

function GameEndScreen() {
  const { roomCode, gameResult } = useScreenSocketContext();

  if (!gameResult) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-8'>
      <div className='max-w-6xl w-full'>
        {/* Title */}
        <div className='text-center mb-12'>
          <h1 className='text-6xl font-bold mb-4'>Game Over!</h1>
          <p className='text-gray-400'>Room: {roomCode}</p>
        </div>

        {/* Results Grid */}
        <div className='grid grid-cols-2 gap-8'>
          {/* Player 1 Result */}
          <div
            className={`rounded-3xl p-12 text-center transition-all ${
              gameResult.winner === 1
                ? "bg-gradient-to-br from-green-600 to-green-800 scale-105"
                : "bg-gradient-to-br from-red-600 to-red-800"
            }`}
          >
            <div className='text-8xl mb-6'>
              {gameResult.winner === 1 ? "🏆" : "😢"}
            </div>
            <h2 className='text-4xl font-bold mb-4'>Player 1</h2>
            <p className='text-6xl font-black mb-4'>
              {gameResult.winner === 1 ? "VICTORY" : "DEFEAT"}
            </p>
            <div className='text-3xl font-bold'>
              Score: {gameResult.player1Score}
            </div>
          </div>

          {/* Player 2 Result */}
          <div
            className={`rounded-3xl p-12 text-center transition-all ${
              gameResult.winner === 2
                ? "bg-gradient-to-br from-green-600 to-green-800 scale-105"
                : "bg-gradient-to-br from-red-600 to-red-800"
            }`}
          >
            <div className='text-8xl mb-6'>
              {gameResult.winner === 2 ? "🏆" : "😢"}
            </div>
            <h2 className='text-4xl font-bold mb-4'>Player 2</h2>
            <p className='text-6xl font-black mb-4'>
              {gameResult.winner === 2 ? "VICTORY" : "DEFEAT"}
            </p>
            <div className='text-3xl font-bold'>
              Score: {gameResult.player2Score}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='text-center mt-12'>
          <p className='text-gray-300 text-xl'>
            Press "Play Again" on any controller to start a new match
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameEndScreen;
