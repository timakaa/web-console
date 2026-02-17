import {
  GAME_SETTINGS,
  PHYSICS,
  DIFFICULTY_MULTIPLIERS,
} from "../config/game.js";

export function handleSettingsSwitch(io, room, roomCode) {
  // Toggle between winScore and difficulty
  room.settings.selectedSetting =
    room.settings.selectedSetting === "winScore" ? "difficulty" : "winScore";
  io.to(roomCode).emit("settings-updated", room.settings);
}

export function handleSettingsAdjust(io, room, roomCode, action) {
  if (room.settings.selectedSetting === "winScore") {
    adjustWinScore(room, action);
  } else if (room.settings.selectedSetting === "difficulty") {
    adjustDifficulty(room, action);
    // Update ball velocity immediately when difficulty changes
    updateBallVelocityForDifficulty(room);
  }
  io.to(roomCode).emit("settings-updated", room.settings);
}

function adjustWinScore(room, action) {
  const scores = GAME_SETTINGS.WIN_SCORE_OPTIONS;
  const currentIndex = scores.indexOf(room.settings.winScore);
  let newIndex;

  if (action === "decrease") {
    newIndex = Math.max(0, currentIndex - 1);
  } else {
    newIndex = Math.min(scores.length - 1, currentIndex + 1);
  }

  room.settings.winScore = scores[newIndex];
}

function adjustDifficulty(room, action) {
  const difficulties = GAME_SETTINGS.DIFFICULTY_OPTIONS;
  const currentIndex = difficulties.indexOf(room.settings.difficulty);
  let newIndex;

  if (action === "decrease") {
    newIndex = Math.max(0, currentIndex - 1);
  } else {
    newIndex = Math.min(difficulties.length - 1, currentIndex + 1);
  }

  room.settings.difficulty = difficulties[newIndex];
}

function updateBallVelocityForDifficulty(room) {
  const difficulty = room.settings.difficulty;
  const ballMultiplier = DIFFICULTY_MULTIPLIERS[difficulty]?.ballSpeed || 1.0;

  // Preserve the direction of the ball velocity
  const vxDirection = room.ball.vx >= 0 ? 1 : -1;
  const vyDirection = room.ball.vy >= 0 ? 1 : -1;

  // Update ball velocity with new difficulty multiplier
  room.ball.vx = PHYSICS.BALL_INITIAL_VX * ballMultiplier * vxDirection;
  room.ball.vy = PHYSICS.BALL_INITIAL_VY * ballMultiplier * vyDirection;
}
