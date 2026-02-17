import { useGameSocketContext } from "../context/GameSocketContext";

function ControllerHeader() {
  const { isConnected, roomCode, playerId } = useGameSocketContext();

  return (
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
  );
}

export default ControllerHeader;
