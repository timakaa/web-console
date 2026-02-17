import { startGameLoop } from "../game/gameLoop.js";

export function handleStartGameRequest(io, roomManager, { roomCode }) {
  console.log(`[Ping Pong Server] Start game request for room ${roomCode}`);
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    console.log(`[Ping Pong Server] Room ${roomCode} not found`);
    return;
  }

  // Check if we have both players
  if (room.controllers.length < 2) {
    console.log(`[Ping Pong Server] Not enough players in room ${roomCode}`);
    return;
  }

  // Start game loop if not started
  if (!room.gameStarted) {
    room.gameStarted = true;
    io.to(roomCode).emit("game-started");
    startGameLoop(io, roomManager, roomCode);
  }
}
