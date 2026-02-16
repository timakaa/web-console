import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

function Home() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

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
        Turn your phone into a game controller
      </p>

      <div className='flex flex-col gap-6 w-full max-w-xs'>
        <button
          className='px-8 py-4 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed'
          onClick={handleStartPlaying}
          disabled={isCreating}
        >
          {isCreating ? "Creating Room..." : "Start Playing"}
        </button>

        <div className='text-gray-500 text-sm'>or</div>

        <button
          className='px-6 py-3 font-medium bg-transparent border-2 border-indigo-600 hover:bg-indigo-600 rounded-lg transition-colors'
          onClick={handleJoinAsController}
        >
          Join as Controller
        </button>
      </div>
    </div>
  );
}

export default Home;
