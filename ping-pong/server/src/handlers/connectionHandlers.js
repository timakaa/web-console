import { getGameConfig } from "../config/game.js";

export function handleGetGameConfig(callback) {
  console.log("[Ping Pong Server] Sending game config");
  const config = getGameConfig();
  console.log("[Ping Pong Server] Config:", config);
  callback(config);
}

export function handleRoomStartGame(
  io,
  roomManager,
  { roomCode, controllers },
) {
  console.log(
    `[Ping Pong Server] Room ${roomCode} starting game with controllers:`,
    controllers,
  );

  const room = roomManager.createRoom(roomCode, controllers);

  // Send initial state
  io.to(roomCode).emit("game-state", room);
}

export function handleControllerJoin(
  socket,
  roomManager,
  { roomCode, playerId },
) {
  console.log(
    `[Ping Pong Server] Controller ${playerId} joined room ${roomCode}`,
  );
  socket.join(roomCode);

  const room = roomManager.getRoom(roomCode);
  if (room) {
    socket.emit("game-state", room);
  }
}

export function handleScreenJoin(socket, roomManager, { roomCode }) {
  console.log(`[Ping Pong Server] Screen joined room ${roomCode}`);
  socket.join(roomCode);

  const room = roomManager.getRoom(roomCode);
  if (room) {
    socket.emit("game-state", room);
  }
}

export function handleDisconnect(socket) {
  console.log("[Ping Pong Server] Client disconnected:", socket.id);
}
