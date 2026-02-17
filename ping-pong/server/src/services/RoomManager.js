import {
  GAME_SETTINGS,
  PHYSICS,
  DIFFICULTY_MULTIPLIERS,
} from "../config/game.js";

export class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomCode, controllers) {
    const difficulty = GAME_SETTINGS.DEFAULT_DIFFICULTY;
    const ballMultiplier = DIFFICULTY_MULTIPLIERS[difficulty]?.ballSpeed || 1.0;

    const room = {
      controllers: controllers.map((id, index) => ({
        id,
        playerId: index + 1,
        y: 50,
        score: 0,
        moving: null, // null, 'up', or 'down'
      })),
      ball: {
        x: 50,
        y: 50,
        vx: PHYSICS.BALL_INITIAL_VX * ballMultiplier,
        vy: PHYSICS.BALL_INITIAL_VY * ballMultiplier,
      },
      gameStarted: false,
      settings: {
        winScore: GAME_SETTINGS.DEFAULT_WIN_SCORE,
        difficulty: difficulty,
        selectedSetting: "winScore", // "winScore" or "difficulty"
      },
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  deleteRoom(roomCode) {
    this.rooms.delete(roomCode);
  }

  roomExists(roomCode) {
    return this.rooms.has(roomCode);
  }
}
