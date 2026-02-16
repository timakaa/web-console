import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import RoomCodeInput from "../components/controller/RoomCodeInput";
import FirstPlayerWaiting from "../components/controller/FirstPlayerWaiting";
import WaitingForStart from "../components/controller/WaitingForStart";

// Active Controller View Component
function ActiveControllerView({ socket, roomCode }) {
  const [activeButton, setActiveButton] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const setupConnection = () => {
      socket.emit("rejoin-room-as-controller", { roomCode }, (response) => {
        if (response.success) {
          setIsConnected(true);
        }
      });
    };

    if (socket.connected) {
      setupConnection();
    } else {
      socket.once("connect", setupConnection);
    }

    return () => {
      socket.off("connect", setupConnection);
    };
  }, [socket, roomCode]);

  const sendAction = (action) => {
    if (socket && isConnected) {
      setActiveButton(action);
      socket.emit("controller-input", {
        roomCode,
        action,
        data: {},
      });
    }
  };

  if (!isConnected) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-4xl mb-4 animate-pulse'>🎮</div>
          <p className='text-gray-400'>Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      <div className='text-center py-6'>
        <p className='text-xs text-gray-500 uppercase tracking-wider'>
          Room: {roomCode}
        </p>
      </div>
      <div className='flex-1'></div>
      <div className='flex items-center justify-center pb-20'>
        <div className='relative w-80 h-80'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none'>
            <img
              src={
                activeButton === "up"
                  ? "/controller-up-active.png"
                  : "/controller-up.png"
              }
              alt='Up'
              className='absolute inset-0 w-full h-full object-contain'
            />
            <img
              src={
                activeButton === "down"
                  ? "/controller-down-active.png"
                  : "/controller-down.png"
              }
              alt='Down'
              className='absolute inset-0 w-full h-full object-contain'
            />
            <img
              src={
                activeButton === "left"
                  ? "/controller-left-active.png"
                  : "/controller-left.png"
              }
              alt='Left'
              className='absolute inset-0 w-full h-full object-contain'
            />
            <img
              src={
                activeButton === "right"
                  ? "/controller-right-active.png"
                  : "/controller-right.png"
              }
              alt='Right'
              className='absolute inset-0 w-full h-full object-contain'
            />
            <img
              src='/controller-enter.png'
              alt='Select'
              className='absolute inset-0 w-full h-full object-contain'
            />
          </div>
          <button
            onTouchStart={() => sendAction("up")}
            onTouchEnd={() => setActiveButton(null)}
            className='absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-transparent'
          />
          <button
            onTouchStart={() => sendAction("down")}
            onTouchEnd={() => setActiveButton(null)}
            className='absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-transparent'
          />
          <button
            onTouchStart={() => sendAction("left")}
            onTouchEnd={() => setActiveButton(null)}
            className='absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-transparent'
          />
          <button
            onTouchStart={() => sendAction("right")}
            onTouchEnd={() => setActiveButton(null)}
            className='absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-transparent'
          />
          <button
            onTouchStart={() => sendAction("select")}
            onTouchEnd={() => setActiveButton(null)}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-transparent rounded-full'
          />
        </div>
      </div>
    </div>
  );
}

function Controller() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomFromUrl = searchParams.get("room");
  const { socket, connect } = useSocket();

  const [currentView, setCurrentView] = useState("input"); // 'input', 'first-player', 'waiting', 'active-controller', 'game'
  const [roomCode, setRoomCode] = useState("");
  const [gameUrl, setGameUrl] = useState(null);

  useEffect(() => {
    if (roomFromUrl) {
      handleJoinRoom(roomFromUrl);
    }
  }, [roomFromUrl]);

  useEffect(() => {
    if (!socket) return;

    // Listen for game start
    socket.on("game-started", () => {
      console.log("Game started, showing active controller");
      setCurrentView("active-controller");
    });

    // Listen for game controller load
    socket.on("load-game-controller", ({ url, gameId }) => {
      console.log(`Loading game controller: ${gameId} at ${url}`);
      setGameUrl(url);
      setCurrentView("game");
    });

    return () => {
      socket.off("game-started");
      socket.off("load-game-controller");
    };
  }, [socket]);

  const handleJoinRoom = async (code) => {
    return new Promise((resolve, reject) => {
      console.log("Joining room:", code);
      const activeSocket = socket || connect();

      const setupListeners = () => {
        activeSocket.emit("join-room", { roomCode: code }, (response) => {
          console.log("Join room response:", response);
          if (response.error) {
            reject(new Error(response.error));
          } else {
            setRoomCode(code);
            setCurrentView(response.isFirstPlayer ? "first-player" : "waiting");
            resolve();
          }
        });
      };

      if (activeSocket.connected) {
        setupListeners();
      } else {
        activeSocket.once("connect", setupListeners);
      }

      activeSocket.on("connect_error", (err) => {
        console.error("Connection error:", err);
        reject(err);
      });

      activeSocket.on("screen-disconnected", () => {
        reject(new Error("Screen disconnected"));
        setCurrentView("input");
      });
    });
  };

  const handleGameStart = () => {
    console.log("Game started, showing active controller");
    setCurrentView("active-controller");
  };

  // Show game iframe
  if (currentView === "game" && gameUrl) {
    return (
      <iframe
        src={gameUrl}
        className='w-full h-screen border-0'
        title='Game Controller'
        allow='fullscreen'
      />
    );
  }

  // Show active controller (D-pad)
  if (currentView === "active-controller") {
    return <ActiveControllerView socket={socket} roomCode={roomCode} />;
  }

  if (currentView === "first-player") {
    return (
      <FirstPlayerWaiting
        socket={socket}
        roomCode={roomCode}
        onGameStart={handleGameStart}
      />
    );
  }

  if (currentView === "waiting") {
    return (
      <WaitingForStart
        socket={socket}
        roomCode={roomCode}
        onGameStart={handleGameStart}
      />
    );
  }

  return <RoomCodeInput onJoinRoom={handleJoinRoom} />;
}

export default Controller;
