function AnimatedBackground() {
  return (
    <div className='absolute inset-0 opacity-20'>
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000'></div>
    </div>
  );
}

export default AnimatedBackground;
