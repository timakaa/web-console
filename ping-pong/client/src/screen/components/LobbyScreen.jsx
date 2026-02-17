import { useScreenSocketContext } from "../context/ScreenSocketContext";

function LobbyScreen() {
  const { roomCode, gameState, settings } = useScreenSocketContext();

  if (!gameState) return null;

  const { controllers } = gameState;
  const player1 = controllers[0];
  const player2 = controllers[1];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white flex flex-col items-center justify-center p-8'>
      <div className='max-w-4xl w-full'>
        {/* Title */}
        <div className='text-center mb-8'>
          <div className='text-8xl mb-4'>🏓</div>
          <h1 className='text-5xl font-bold mb-2'>Ping Pong</h1>
          <p className='text-gray-400'>Room: {roomCode}</p>
        </div>

        <div className='grid grid-cols-2 gap-8'>
          {/* Left Column - Players */}
          <div>
            <h2 className='text-2xl font-bold mb-4 text-center'>Players</h2>
            <div className='space-y-4'>
              <div className='bg-gray-800/50 rounded-xl p-6 text-center'>
                <div className='text-4xl mb-3'>👤</div>
                <h3 className='text-xl font-bold mb-2'>Player 1</h3>
                <div
                  className={`text-sm ${player1 ? "text-green-400" : "text-gray-500"}`}
                >
                  {player1 ? "✓ Connected" : "Waiting..."}
                </div>
              </div>
              <div className='bg-gray-800/50 rounded-xl p-6 text-center'>
                <div className='text-4xl mb-3'>👤</div>
                <h3 className='text-xl font-bold mb-2'>Player 2</h3>
                <div
                  className={`text-sm ${player2 ? "text-green-400" : "text-gray-500"}`}
                >
                  {player2 ? "✓ Connected" : "Waiting..."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div>
            <h2 className='text-2xl font-bold mb-4 text-center'>Settings</h2>
            <div className='space-y-6'>
              {/* Win Score */}
              <div className='bg-gray-800/50 rounded-xl p-6'>
                <h3 className='text-lg font-bold mb-4 text-center'>
                  Win Score
                </h3>
                <div className='flex gap-3 justify-center'>
                  {[5, 10, 15].map((score) => (
                    <div
                      key={score}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        settings.winScore === score
                          ? "bg-green-600 text-white scale-110"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {score}
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className='bg-gray-800/50 rounded-xl p-6'>
                <h3 className='text-lg font-bold mb-4 text-center'>
                  Difficulty
                </h3>
                <div className='flex flex-col gap-3'>
                  {["easy", "normal", "hard"].map((diff) => (
                    <div
                      key={diff}
                      className={`px-6 py-3 rounded-lg font-bold transition-all capitalize text-center ${
                        settings.difficulty === diff
                          ? "bg-blue-600 text-white scale-105"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {diff}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='bg-gray-800/30 rounded-xl p-6 mt-8 mb-6'>
          <h3 className='text-lg font-bold mb-3 text-center'>How to Play</h3>
          <ul className='space-y-2 text-gray-300 text-sm text-center'>
            <li>
              • Use UP and DOWN buttons on your controller to move your paddle
            </li>
            <li>• First player to reach {settings.winScore} points wins!</li>
            <li>• Ball speed increases with each paddle hit</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className='text-center'>
          {player1 && player2 ? (
            <div>
              <p className='text-gray-300 text-lg mb-2'>Ready to start!</p>
              <p className='text-gray-400 text-sm'>
                Use controller to change settings and press START
              </p>
            </div>
          ) : (
            <div className='text-gray-400'>
              Waiting for all players to connect...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LobbyScreen;
