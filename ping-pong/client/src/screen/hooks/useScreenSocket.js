import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import pingPongSound from "../../assets/ping-pong.mp3";

const GAME_SERVER_URL =
  import.meta.env.VITE_GAME_SERVER_URL || "http://localhost:4001";
const MAIN_CONSOLE_URL =
  import.meta.env.VITE_MAIN_CONSOLE_URL || "http://localhost:3000";

export function useScreenSocket() {
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

  return {
    socket,
    isConnected,
    roomCode,
    gameState,
    gameStarted,
    gameEnded,
    gameResult,
    settings,
  };
}
