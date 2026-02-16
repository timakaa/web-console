import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useScreenSocket } from "../context/ScreenSocketContext";
import { QRCodeSVG } from "qrcode.react";

function Screen() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket, connect } = useScreenSocket();
  const [controllers, setControllers] = useState([]);

  useEffect(() => {
    console.log("Screen component mounted, roomCode:", roomCode);
    const activeSocket = socket || connect();

    const setupConnection = () => {
      console.log("Screen socket connected, ID:", activeSocket.id);
      console.log("Joining room:", roomCode);
      activeSocket.emit("create-room-with-code", { roomCode }, (response) => {
        console.log("Room joined response:", response);
      });
    };

    if (activeSocket.connected) {
      setupConnection();
    } else {
      activeSocket.once("connect", setupConnection);
    }

    activeSocket.on("controller-joined", (data) => {
      console.log("🎮 Controller joined event received:", data);
      setControllers((prev) => {
        const updated = [
          ...prev,
          { id: data.controllerId, joinedAt: Date.now() },
        ];
        console.log("Updated controllers list:", updated);
        return updated;
      });
    });

    activeSocket.on("controller-left", (data) => {
      console.log("❌ Controller left event received:", data);
      setControllers((prev) => {
        const updated = prev.filter((c) => c.id !== data.controllerId);
        console.log("Updated controllers after removal:", updated);
        return updated;
      });
    });

    activeSocket.on("controller-input", ({ controllerId, action, data }) => {
      console.log("Controller input:", { controllerId, action, data });
    });

    activeSocket.on("game-started", () => {
      console.log("Game started, navigating to game repository");
      navigate(`/game-repository/${roomCode}`);
    });

    // Screen waiting room should NOT close on room-empty
    // Players can still join

    return () => {
      // Don't close socket, just clean up listeners
      activeSocket.off("controller-joined");
      activeSocket.off("controller-left");
      activeSocket.off("controller-input");
      activeSocket.off("game-started");
    };
  }, [roomCode, navigate, socket, connect]);

  const controllerUrl = `${window.location.origin}/controller?room=${roomCode}`;

  return (
    <div className='min-h-screen p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Room: {roomCode}</h1>
        <p className='text-gray-400 text-lg'>
          {controllers.length} player{controllers.length !== 1 ? "s" : ""}{" "}
          connected
        </p>
      </div>

      {/* Main Content Grid */}
      <div className='grid md:grid-cols-2 gap-8 mb-8'>
        {/* QR Code Section */}
        <div className='bg-indigo-950/30 border-2 border-indigo-800/50 rounded-xl p-8 text-center'>
          <h2 className='text-2xl font-semibold mb-6'>Scan to Join</h2>
          <div className='inline-block p-4 bg-white rounded-lg mb-4'>
            <QRCodeSVG
              value={controllerUrl}
              size={200}
              level='M'
              bgColor='#ffffff'
              fgColor='#000000'
            />
          </div>
          <p className='text-gray-400'>
            Or enter code:{" "}
            <span className='text-white font-bold text-xl tracking-wider ml-2'>
              {roomCode}
            </span>
          </p>
        </div>

        {/* Controllers Section */}
        <div className='bg-indigo-950/20 border-2 border-indigo-800/30 rounded-xl p-8'>
          <h2 className='text-2xl font-semibold mb-6'>Connected Controllers</h2>
          <div className='space-y-3'>
            {controllers.length === 0 ? (
              <p className='text-gray-500 text-center py-8'>
                Waiting for players to join...
              </p>
            ) : (
              controllers.map((controller, index) => (
                <div
                  key={controller.id}
                  className='flex items-center gap-4 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-lg animate-fade-in'
                >
                  <div className='text-3xl'>🎮</div>
                  <div className='flex-1'>
                    <div className='font-semibold text-lg'>
                      Player {index + 1}
                    </div>
                    <div className='text-sm text-gray-500 font-mono'>
                      {controller.id.substring(0, 8)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Screen;
