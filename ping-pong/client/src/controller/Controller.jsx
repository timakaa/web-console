import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const GAME_SERVER_URL =
  import.meta.env.VITE_GAME_SERVER_URL || "http://localhost:4001";
const MAIN_CONSOLE_URL =
  import.meta.env.VITE_MAIN_CONSOLE_URL || "http://localhost:3000";

function Controller() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const connectionStableRef = useRef(false);

  useEffect(() => {
    // Get room code from URL params
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    const player = params.get("player");

    if (room && player) {
      setRoomCode(room);
      setPlayerId(player);

      // Connect to ping-pong game server
      const newSocket = io(GAME_SERVER_URL);

      newSocket.on("connect", () => {
        console.log("Connected to ping-pong server");
        setIsConnected(true);

        // Join the game room
        newSocket.emit("controller-join", {
          roomCode: room,
          playerId: player,
        });

        // Mark connection as stable after 2 seconds
        setTimeout(() => {
          connectionStableRef.current = true;
          console.log("Connection marked as stable");
        }, 2000);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from ping-pong server");
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

      newSocket.on("game-ended", (result) => {
        console.log("Game ended:", result);
        setGameEnded(true);
        setGameResult(result);

        // Redirect to main menu after 5 seconds
        setTimeout(() => {
          window.location.href = MAIN_CONSOLE_URL;
        }, 5000);
      });

      newSocket.on("game-started", () => {
        console.log("Game started!");
        setGameStarted(true);
      });

      setSocket(newSocket);

      return () => {
        connectionStableRef.current = false;
        newSocket.close();
      };
    }
  }, []);

  const sendAction = (action) => {
    if (socket && isConnected) {
      socket.emit("controller-action", {
        roomCode,
        playerId,
        action,
      });
    }
  };

  const handleStartGame = () => {
    sendAction("select");
  };

  const handleTouchStart = (direction) => {
    sendAction(`${direction}-hold`);
  };

  const handleTouchEnd = (direction) => {
    sendAction(`${direction}-release`);
  };

  if (!roomCode || !playerId) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold mb-4 text-red-400'>Invalid URL</h2>
          <p className='text-gray-400'>
            Please access this controller through the game system
          </p>
        </div>
      </div>
    );
  }

  // Show victory/defeat screen if game ended
  if (gameEnded && gameResult) {
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
            {playerNum === 1
              ? gameResult.player1Score
              : gameResult.player2Score}
          </p>
          <p className='text-xl text-white/70 mt-8'>
            Returning to main menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white overflow-hidden fixed inset-0'>
      {/* Animated background effect */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col h-full'>
        {/* Header */}
        <div className='text-center py-8'>
          <h2 className='text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            🏓 PING PONG
          </h2>
          <div className='flex items-center justify-center gap-3 mb-2'>
            {isConnected ? (
              <span className='flex items-center gap-2 text-green-400 font-semibold'>
                <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
                Connected
              </span>
            ) : (
              <span className='flex items-center gap-2 text-red-400 font-semibold'>
                <span className='w-2 h-2 bg-red-400 rounded-full animate-pulse'></span>
                Disconnected
              </span>
            )}
          </div>
          <p className='text-sm text-gray-400 font-mono'>
            Room {roomCode} • Player {playerId}
          </p>
        </div>

        {/* Spacer */}
        <div className='flex-1'></div>

        {/* Controls - Show different UI based on game state */}
        {!gameStarted ? (
          // Lobby controls - settings adjustment
          <div className='flex flex-col gap-4 pb-8 px-6'>
            <div className='text-center mb-4'>
              <p className='text-lg text-gray-300 mb-2'>Game Settings</p>
              <p className='text-xs text-gray-400'>
                Use buttons to adjust settings on screen
              </p>
            </div>

            <button
              className='h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-xl flex items-center justify-center text-2xl font-black transition-all active:scale-95 border-2 border-blue-400/30 select-none'
              onTouchStart={() => sendAction("decrease")}
            >
              <span className='drop-shadow-lg'>▲ DECREASE</span>
            </button>

            <button
              className='h-20 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-xl flex items-center justify-center text-2xl font-black transition-all active:scale-95 border-2 border-red-400/30 select-none'
              onTouchStart={() => sendAction("increase")}
            >
              <span className='drop-shadow-lg'>▼ INCREASE</span>
            </button>

            <button
              className='h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-xl flex items-center justify-center text-xl font-black transition-all active:scale-95 border-2 border-purple-400/30 select-none'
              onTouchStart={() => sendAction("switch")}
            >
              <span className='drop-shadow-lg'>◄ ► SWITCH</span>
            </button>

            <button
              className='h-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl shadow-xl flex items-center justify-center text-2xl font-black transition-all active:scale-95 border-2 border-green-400/30 select-none mt-4'
              onClick={handleStartGame}
              onTouchStart={handleStartGame}
            >
              <span className='drop-shadow-lg'>START GAME</span>
            </button>
          </div>
        ) : (
          // Game controls - up/down buttons
          <div className='flex flex-col gap-4 pb-8 px-6'>
            <button
              className='h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 active:from-blue-700 active:via-blue-800 active:to-blue-900 rounded-2xl shadow-xl shadow-blue-900/50 flex flex-col items-center justify-center text-3xl font-black transition-all active:scale-95 border-2 border-blue-400/30 relative overflow-hidden select-none'
              onTouchStart={() => handleTouchStart("up")}
              onTouchEnd={() => handleTouchEnd("up")}
            >
              <div className='absolute inset-0 bg-gradient-to-t from-transparent to-white/20'></div>
              <span className='text-4xl drop-shadow-lg relative z-10'>▲</span>
            </button>

            <button
              className='h-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 active:from-red-700 active:via-red-800 active:to-red-900 rounded-2xl shadow-xl shadow-red-900/50 flex flex-col items-center justify-center text-3xl font-black transition-all active:scale-95 border-2 border-red-400/30 relative overflow-hidden select-none'
              onTouchStart={() => handleTouchStart("down")}
              onTouchEnd={() => handleTouchEnd("down")}
            >
              <div className='absolute inset-0 bg-gradient-to-t from-transparent to-white/20'></div>
              <span className='text-4xl drop-shadow-lg relative z-10'>▼</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Controller;
