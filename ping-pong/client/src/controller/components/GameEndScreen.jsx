import { useGameSocketContext } from "../context/GameSocketContext";

function GameEndScreen() {
  const { playerId, gameResult } = useGameSocketContext();

  if (!gameResult) return null;

  const playerNum = parseInt(playerId);
  const isWinner = gameResult.winner === playerNum;

  return (
    <div
      className={`h-screen flex flex-col items-center justify-center text-white overflow-hidden fixed inset-0 ${
        isWinner
          ? "bg-gradient-to-br from-green-600 via-green-700 to-green-900"
          : "bg-gradient-to-br from-red-600 via-red-700 to-red-900"
      }`}
    >
      <div className='text-center'>
        <div className='text-9xl mb-8 animate-bounce'>
          {isWinner ? "🏆" : "😢"}
        </div>
        <h1 className='text-7xl font-black mb-6'>
          {isWinner ? "VICTORY!" : "DEFEAT"}
        </h1>
        <p className='text-3xl mb-4'>
          Score:{" "}
          {playerNum === 1 ? gameResult.player1Score : gameResult.player2Score}
        </p>
        <p className='text-xl text-white/70 mt-8'>Returning to main menu...</p>
      </div>
    </div>
  );
}

export default GameEndScreen;
