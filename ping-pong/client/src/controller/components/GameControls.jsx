import { useGameSocketContext } from "../context/GameSocketContext";

function GameControls() {
  const { sendAction } = useGameSocketContext();

  const handleTouchStart = (direction) => {
    sendAction(`${direction}-hold`);
  };

  const handleTouchEnd = (direction) => {
    sendAction(`${direction}-release`);
  };

  return (
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
  );
}

export default GameControls;
