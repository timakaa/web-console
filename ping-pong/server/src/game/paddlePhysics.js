import { PHYSICS } from "../config/game.js";

export function updatePaddles(controllers) {
  controllers.forEach((player) => {
    if (player.moving === "up") {
      player.y = Math.max(
        PHYSICS.PADDLE_MIN_Y,
        player.y - PHYSICS.PADDLE_SPEED,
      );
    } else if (player.moving === "down") {
      player.y = Math.min(
        PHYSICS.PADDLE_MAX_Y,
        player.y + PHYSICS.PADDLE_SPEED,
      );
    }
  });
}
