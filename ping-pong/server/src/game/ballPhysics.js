import { PHYSICS, DIFFICULTY_MULTIPLIERS } from "../config/game.js";

export function updateBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Ball collision with top/bottom
  if (ball.y <= 0 || ball.y >= 100) {
    ball.vy *= -1;
  }
}

export function checkBallCollisions(
  ball,
  player1,
  player2,
  winScore,
  difficulty = "normal",
) {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty]?.ballSpeed || 1.0;

  const result = {
    paddleHit: null,
    scored: null,
    gameEnded: false,
    winner: null,
  };

  // Left paddle (player 1) collision
  if (
    ball.x <= PHYSICS.LEFT_PADDLE_X &&
    Math.abs(ball.y - player1.y) < PHYSICS.PADDLE_HIT_RANGE
  ) {
    ball.vx *= -PHYSICS.BALL_SPEED_INCREASE;
    ball.x = PHYSICS.LEFT_PADDLE_X;
    result.paddleHit = 1;
  }

  // Right paddle (player 2) collision
  if (
    ball.x >= PHYSICS.RIGHT_PADDLE_X &&
    Math.abs(ball.y - player2.y) < PHYSICS.PADDLE_HIT_RANGE
  ) {
    ball.vx *= -PHYSICS.BALL_SPEED_INCREASE;
    ball.x = PHYSICS.RIGHT_PADDLE_X;
    result.paddleHit = 2;
  }

  // Left wall - player 2 scores
  if (ball.x <= 0) {
    result.scored = 1; // Player 2 scores
    ball.vx = PHYSICS.BALL_INITIAL_VX * multiplier; // Reset with difficulty multiplier
    ball.x = 0;

    // Check for win
    if (player2.score + 1 >= winScore) {
      result.gameEnded = true;
      result.winner = 2;
    }
  }

  // Right wall - player 1 scores
  if (ball.x >= 100) {
    result.scored = 2; // Player 1 scores
    ball.vx = -PHYSICS.BALL_INITIAL_VX * multiplier; // Reset with difficulty multiplier
    ball.x = 100;

    // Check for win
    if (player1.score + 1 >= winScore) {
      result.gameEnded = true;
      result.winner = 1;
    }
  }

  return result;
}
