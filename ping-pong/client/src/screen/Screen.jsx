import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import pingPongSound from "../assets/ping-pong.mp3";

const GAME_SERVER_URL =
  import.meta.env.VITE_GAME_SERVER_URL || "http://localhost:4001";
const MAIN_CONSOLE_URL =
  import.meta.env.VITE_MAIN_CONSOLE_URL || "http://localhost:3000";

function Screen() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [gameState, setGameState] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [settings, setSettings] = useState({
    winScore: 5,
    difficulty: "normal",
  });
  const connectionStableRef = useRef(false);

  useEffect(() => {
    // Get room code from URL params
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");

    if (room) {
      setRoomCode(room);

      // Connect to ping-pong game server
      const newSocket = io(GAME_SERVER_URL);

      newSocket.on("connect", () => {
        console.log("Screen connected to ping-pong server");
        setIsConnected(true);

        // Join the game room
        newSocket.emit("screen-join", { roomCode: room });

        // Mark connection as stable after 2 seconds
        setTimeout(() => {
          connectionStableRef.current = true;
          console.log("Screen connection marked as stable");
        }, 2000);
      });

      newSocket.on("disconnect", () => {
        console.log("Screen disconnected from ping-pong server");
        setIsConnected(false);

        // Only redirect if connection was stable (not an initial connection failure)
        if (connectionStableRef.current) {
          console.log("Redirecting to main console");
          window.location.href = MAIN_CONSOLE_URL;
        } else {
          console.log(
            "Connection failed during initial setup, not redirecting",
          );
        }
      });

      newSocket.on("game-state", (state) => {
        setGameState(state);
      });

      newSocket.on("game-started", () => {
        setGameStarted(true);
      });

      newSocket.on("settings-updated", (newSettings) => {
        console.log("Settings updated:", newSettings);
        setSettings(newSettings);
      });

      newSocket.on("paddle-hit", () => {
        const sound = new Audio(pingPongSound);
        sound.volume = 0.5;
        sound.play().catch((err) => {
          console.error("Sound play failed:", err);
        });
      });

      newSocket.on("game-ended", (result) => {
        console.log("Game ended:", result);
        setGameEnded(true);
        setGameResult(result);

        // Redirect to main menu after 5 seconds
        setTimeout(() => {
          window.location.href = MAIN_CONSOLE_URL;
        }, 5000);
      });

      setSocket(newSocket);

      return () => {
        connectionStableRef.current = false;
        newSocket.close();
      };
    }
  }, []);

  if (!roomCode) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold mb-4 text-red-400'>Invalid URL</h2>
          <p className='text-gray-400'>
            Please access this screen through the game system
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected || !gameState) {
    return (
      <div className='min-h-screen overflow-hidden flex items-center justify-center bg-gray-900 text-white'>
        <div className='text-center'>
          <div className='text-6xl mb-4 animate-pulse'>🏓</div>
          <p className='text-xl'>Connecting to game...</p>
        </div>
      </div>
    );
  }

  // Show lobby/settings screen before game starts
  if (!gameStarted) {
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

  const { controllers, ball } = gameState;
  const player1 = controllers[0];
  const player2 = controllers[1];

  // Show victory/defeat screen if game ended
  if (gameEnded && gameResult) {
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

          {/* Return message */}
          <div className='text-center mt-12'>
            <p className='text-gray-300 text-xl'>
              Returning to main menu in a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

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

export default Screen;
