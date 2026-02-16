import { useState } from "react";

function RoomCodeInput({ onJoinRoom }) {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleDigitPress = (digit) => {
    if (roomCode.length < 6) {
      setRoomCode(roomCode + digit);
      setError("");
    }
  };

  const handleBackspace = () => {
    setRoomCode(roomCode.slice(0, -1));
    setError("");
  };

  const handleSubmit = async () => {
    if (!roomCode || roomCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      await onJoinRoom(roomCode);
    } catch (err) {
      setError(err.message || "Failed to join room");
      setIsJoining(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-900'>
      <h1 className='text-4xl font-bold mb-4'>Connect Controller</h1>
      <p className='text-gray-400 mb-12'>Enter 6-digit room code</p>

      {/* Code Display */}
      <div className='mb-8 flex gap-2 justify-center'>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className='w-12 h-16 flex items-center justify-center text-3xl font-bold bg-gray-800 border-2 border-indigo-600 rounded-lg'
          >
            {roomCode[index] || ""}
          </div>
        ))}
      </div>

      {error && <p className='text-red-400 text-sm mb-4'>{error}</p>}

      {/* Numpad */}
      <div className='grid grid-cols-3 gap-4 max-w-xs w-full'>
        {/* Digits 1-9 */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigitPress(digit.toString())}
            disabled={isJoining || roomCode.length >= 6}
            className='h-16 text-2xl font-bold bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: X, 0, Checkmark */}
        <button
          onClick={handleBackspace}
          disabled={isJoining || roomCode.length === 0}
          className='h-16 text-2xl font-bold bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          ✕
        </button>

        <button
          onClick={() => handleDigitPress("0")}
          disabled={isJoining || roomCode.length >= 6}
          className='h-16 text-2xl font-bold bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          0
        </button>

        <button
          onClick={handleSubmit}
          disabled={isJoining || roomCode.length !== 6}
          className='h-16 text-2xl font-bold bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isJoining ? "..." : "✓"}
        </button>
      </div>
    </div>
  );
}

export default RoomCodeInput;
