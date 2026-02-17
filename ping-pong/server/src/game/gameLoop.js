import { GAME_SETTINGS } from "../config/game.js";
import { updatePaddles } from "./paddlePhysics.js";
import { updateBall, checkBallCollisions } from "./ballPhysics.js";

export function startGameLoop(io, roomManager, roomCode) {
  const interval = setInterval(() => {
    const room = roomManager.getRoom(roomCode);
    if (!room) {
      clearInterval(interval);
      return;
    }

    // Check if we have both players
    const player1 = room.controllers[0];
    const player2 = room.controllers[1];

    if (!player1 || !player2) {
      // Not enough players, just broadcast current state
      io.to(roomCode).emit("game-state", room);
      return;
    }

    // Get difficulty from room settings
    const difficulty = room.settings.difficulty || "normal";

    // Update game state with difficulty
    updatePaddles(room.controllers, difficulty);
    updateBall(room.ball);

    // Check collisions with difficulty
    const collisionResult = checkBallCollisions(
      room.ball,
      player1,
      player2,
      room.settings.winScore,
      difficulty,
    );

    // Handle paddle hits
    if (collisionResult.paddleHit) {
      io.to(roomCode).emit("paddle-hit", {
        playerId: collisionResult.paddleHit,
      });
    }

    // Handle scoring
    if (collisionResult.scored) {
      if (collisionResult.scored === 1) {
        player2.score++;
      } else if (collisionResult.scored === 2) {
        player1.score++;
      }
    }

    // Check for win condition
    if (collisionResult.gameEnded) {
      io.to(roomCode).emit("game-ended", {
        winner: collisionResult.winner,
        player1Score: player1.score,
        player2Score: player2.score,
      });
      clearInterval(interval);
      return;
    }

    // Broadcast game state
    io.to(roomCode).emit("game-state", room);
  }, 1000 / GAME_SETTINGS.FRAME_RATE);
}
