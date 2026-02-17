function ErrorScreen() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white p-8'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-4 text-red-400'>Invalid URL</h2>
        <p className='text-gray-400'>
          Please access this screen through the game system
        </p>
      </div>
    </div>
  );
}

export default ErrorScreen;
