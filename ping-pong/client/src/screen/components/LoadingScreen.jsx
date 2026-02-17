function LoadingScreen() {
  return (
    <div className='min-h-screen overflow-hidden flex items-center justify-center bg-gray-900 text-white'>
      <div className='text-center'>
        <div className='text-6xl mb-4 animate-pulse'>🏓</div>
        <p className='text-xl'>Connecting to game...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
