import { startGameLoop } from "../game/gameLoop.js";
import {
  handleSettingsSwitch,
  handleSettingsAdjust,
} from "./settingsHandlers.js";
import { handleRequestRematch } from "./rematchHandlers.js";

export function handleControllerAction(
  io,
  roomManager,
  { roomCode, playerId, action },
) {
  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.controllers.find(
    (p) => p.playerId === parseInt(playerId),
  );
  if (!player) return;

  // If game has ended and player presses select, request rematch
  if (room.gameEnded && action === "select") {
    handleRequestRematch(io, roomManager, { roomCode });
    return;
  }

  // If game hasn't started, handle settings actions
  if (!room.gameStarted) {
    handleLobbyAction(io, roomManager, room, roomCode, action);
    return;
  }

  // Game is running - handle paddle movement
  handlePaddleMovement(player, action);
}

function handleLobbyAction(io, roomManager, room, roomCode, action) {
  if (action === "select") {
    // Start game
    if (room.controllers.length >= 2) {
      room.gameStarted = true;
      room.gameEnded = false; // Ensure gameEnded is false when starting
      io.to(roomCode).emit("game-started");
      startGameLoop(io, roomManager, roomCode);
    }
  } else if (action === "switch") {
    handleSettingsSwitch(io, room, roomCode);
  } else if (action === "decrease" || action === "increase") {
    handleSettingsAdjust(io, room, roomCode, action);
  }
}

function handlePaddleMovement(player, action) {
  if (action === "up-hold") {
    player.moving = "up";
  } else if (action === "down-hold") {
    player.moving = "down";
  } else if (action === "up-release" || action === "down-release") {
    player.moving = null;
  }
}
