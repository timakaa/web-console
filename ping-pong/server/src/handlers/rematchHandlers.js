import { PHYSICS, DIFFICULTY_MULTIPLIERS } from "../config/game.js";

export function handleRequestRematch(io, roomManager, { roomCode }) {
  console.log(`[Ping Pong Server] Rematch requested for room ${roomCode}`);
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    console.log(`[Ping Pong Server] Room ${roomCode} not found`);
    return;
  }

  // Reset game state
  resetGameState(room);

  // Notify all clients to return to lobby
  io.to(roomCode).emit("game-reset");

  // Send updated game state
  io.to(roomCode).emit("game-state", room);
}

function resetGameState(room) {
  const difficulty = room.settings.difficulty || "normal";
  const ballMultiplier = DIFFICULTY_MULTIPLIERS[difficulty]?.ballSpeed || 1.0;

  // Reset player scores and positions
  room.controllers.forEach((player) => {
    player.score = 0;
    player.y = 50;
    player.moving = null;
  });

  // Reset ball
  room.ball = {
    x: 50,
    y: 50,
    vx: PHYSICS.BALL_INITIAL_VX * ballMultiplier,
    vy: PHYSICS.BALL_INITIAL_VY * ballMultiplier,
  };

  // Reset game state flags
  room.gameStarted = false;
  room.gameEnded = false;
}
