import { useGameSocketContext } from "../context/GameSocketContext";

function GameEndScreen() {
  const { playerId, gameResult, sendAction } = useGameSocketContext();

  if (!gameResult) return null;

  const playerNum = parseInt(playerId);
  const isWinner = gameResult.winner === playerNum;

  const handlePlayAgain = () => {
    sendAction("select");
  };

  return (
    <div
      className={`h-screen flex flex-col items-center justify-center text-white overflow-hidden fixed inset-0 ${
        isWinner
          ? "bg-gradient-to-br from-green-600 via-green-700 to-green-900"
          : "bg-gradient-to-br from-red-600 via-red-700 to-red-900"
      }`}
    >
      <div className='text-center px-6'>
        <div className='text-9xl mb-8 animate-bounce'>
          {isWinner ? "🏆" : "😢"}
        </div>
        <h1 className='text-7xl font-black mb-6'>
          {isWinner ? "VICTORY!" : "DEFEAT"}
        </h1>
        <p className='text-3xl mb-8'>
          Score:{" "}
          {playerNum === 1 ? gameResult.player1Score : gameResult.player2Score}
        </p>

        <button
          onClick={handlePlayAgain}
          onTouchStart={handlePlayAgain}
          className='bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl text-xl transition-all active:scale-95 border-2 border-white/30'
        >
          Play Again
        </button>
        <p className='text-sm text-white/70 mt-4'>
          Press to play another round
        </p>
      </div>
    </div>
  );
}

export default GameEndScreen;
