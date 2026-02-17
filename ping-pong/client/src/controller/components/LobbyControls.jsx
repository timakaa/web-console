import { useGameSocketContext } from "../context/GameSocketContext";

function LobbyControls() {
  const { sendAction } = useGameSocketContext();

  const handleStartGame = () => {
    sendAction("select");
  };

  return (
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
  );
}

export default LobbyControls;
