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

      newSocket.on("paddle-hit", () => {
        const sound = new Audio(pingPongSound);
        sound.volume = 0.5;
        sound.play().catch((err) => {
          console.error("Sound play failed:", err);
        });
      });

      newSocket.on("game-ended", () => {
        console.log("Game ended, returning to main menu");
        window.location.href = MAIN_CONSOLE_URL;
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
      <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
        <div className='text-center'>
          <div className='text-6xl mb-4 animate-pulse'>🏓</div>
          <p className='text-xl'>Connecting to game...</p>
        </div>
      </div>
    );
  }

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

export default Screen;
