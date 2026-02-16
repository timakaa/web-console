import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

function Home() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet/mobile breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleStartPlaying = async () => {
    setIsCreating(true);

    // Enter fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen request failed:", err);
    }

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      socket.emit("create-room", ({ roomCode }) => {
        navigate(`/screen/${roomCode}`);
      });
    });
  };

  const handleJoinAsController = async () => {
    // Enter fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen request failed:", err);
    }

    navigate("/controller");
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8 text-center'>
      <h1 className='text-5xl font-bold mb-2'>Web Console</h1>
      <p className='text-xl text-gray-400 mb-12'>
        {isMobile
          ? "Turn your phone into a game controller"
          : "Play games with your phone as a controller"}
      </p>

      <div className='flex flex-col gap-6 w-full max-w-xs'>
        {isMobile ? (
          // Mobile: Show only "Connect Controller" button
          <button
            className='px-8 py-4 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors'
            onClick={handleJoinAsController}
          >
            Connect Controller
          </button>
        ) : (
          // Desktop: Show only "Start Playing" button
          <button
            className='px-8 py-4 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed'
            onClick={handleStartPlaying}
            disabled={isCreating}
          >
            {isCreating ? "Creating Room..." : "Start Playing"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
