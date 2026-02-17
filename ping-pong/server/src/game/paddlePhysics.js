import { PHYSICS, DIFFICULTY_MULTIPLIERS } from "../config/game.js";

export function updatePaddles(controllers, difficulty = "normal") {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty]?.paddleSpeed || 1.0;
  const speed = PHYSICS.PADDLE_SPEED * multiplier;

  controllers.forEach((player) => {
    if (player.moving === "up") {
      player.y = Math.max(PHYSICS.PADDLE_MIN_Y, player.y - speed);
    } else if (player.moving === "down") {
      player.y = Math.min(PHYSICS.PADDLE_MAX_Y, player.y + speed);
    }
  });
}
