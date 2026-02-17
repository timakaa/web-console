export function getGameConfig() {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5174";

  return {
    name: "Ping Pong",
    controllerUrl: `${CLIENT_URL}/controller.html`,
    screenUrl: `${CLIENT_URL}/screen.html`,
    minPlayers: 2,
    maxPlayers: 2,
  };
}

export const GAME_SETTINGS = {
  DEFAULT_WIN_SCORE: 5,
  DEFAULT_DIFFICULTY: "normal",
  WIN_SCORE_OPTIONS: [5, 10, 15],
  DIFFICULTY_OPTIONS: ["easy", "normal", "hard"],
  FRAME_RATE: 60,
};

export const PHYSICS = {
  BALL_INITIAL_VX: 0.5,
  BALL_INITIAL_VY: 0.6,
  PADDLE_SPEED: 1,
  PADDLE_MIN_Y: 10,
  PADDLE_MAX_Y: 90,
  BALL_SPEED_INCREASE: 1.05,
  PADDLE_HIT_RANGE: 10,
  LEFT_PADDLE_X: 2,
  RIGHT_PADDLE_X: 98,
};
