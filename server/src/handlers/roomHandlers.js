export const handleCreateRoom = (socket, roomManager, callback) => {
  const roomCode = roomManager.generateRoomCode();
  roomManager.createRoom(roomCode, socket.id);
  socket.join(roomCode);
  callback({ roomCode });
};

export const handleCreateRoomWithCode = (
  socket,
  roomManager,
  { roomCode },
  callback,
) => {
  if (!roomManager.roomExists(roomCode)) {
    roomManager.createRoom(roomCode, socket.id);
  } else {
    // Room exists, update the screen socket ID
    const room = roomManager.getRoom(roomCode);
    room.screen = socket.id;
  }
  socket.join(roomCode);
  console.log(`Screen ${socket.id} joined room: ${roomCode}`);
  callback({ success: true, roomCode });
};

export const handleJoinRoom = (
  socket,
  io,
  roomManager,
  { roomCode },
  callback,
) => {
  const result = roomManager.addController(roomCode, socket.id);

  if (result.error) {
    console.log(`Room ${roomCode} not found`);
    callback({ error: result.error });
    return;
  }

  socket.join(roomCode);

  const room = roomManager.getRoom(roomCode);

  // Notify screen that controller joined
  io.to(room.screen).emit("controller-joined", {
    controllerId: socket.id,
    totalControllers: result.totalControllers,
  });

  // Notify all other controllers about player count update
  socket.to(roomCode).emit("player-count-updated", {
    totalControllers: result.totalControllers,
  });

  // If room is already in game mode, immediately send game-started event to new controller
  if (room.inGame) {
    console.log(
      `Room ${roomCode} is in game mode, sending game-started to new controller ${socket.id}`,
    );
    socket.emit("game-started", {
      totalControllers: result.totalControllers,
    });
  }

  // Include inGame status in the response
  callback({
    ...result,
    inGame: room.inGame,
  });
};
