import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const GAME_SERVER_URL =
  import.meta.env.VITE_GAME_SERVER_URL || "http://localhost:4001";
const MAIN_CONSOLE_URL =
  import.meta.env.VITE_MAIN_CONSOLE_URL || "http://localhost:3000";

export function useGameSocket() {
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
      });

      newSocket.on("game-reset", () => {
        console.log("Game reset, returning to lobby");
        setGameStarted(false);
        setGameEnded(false);
        setGameResult(null);
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

  return {
    socket,
    isConnected,
    roomCode,
    playerId,
    gameStarted,
    gameEnded,
    gameResult,
    sendAction,
  };
}
