import { GAME_SETTINGS } from "../config/game.js";

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
