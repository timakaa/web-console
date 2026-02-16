class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomCode, screenSocketId) {
    this.rooms.set(roomCode, {
      screen: screenSocketId,
      controllers: [],
      createdAt: Date.now(),
      inGame: false, // Track if room is in game mode
    });
    console.log(`Room created: ${roomCode} by screen ${screenSocketId}`);
    return roomCode;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  roomExists(roomCode) {
    return this.rooms.has(roomCode);
  }

  addController(roomCode, controllerSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) {
      return { error: "Room not found" };
    }

    room.controllers.push(controllerSocketId);
    const isFirstPlayer = room.controllers.length === 1;

    console.log(
      `Controller ${controllerSocketId} joined room ${roomCode} (${room.controllers.length} total, first: ${isFirstPlayer})`,
    );

    return {
      success: true,
      isFirstPlayer,
      totalControllers: room.controllers.length,
    };
  }

  removeController(roomCode, controllerSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) return false;

    const index = room.controllers.indexOf(controllerSocketId);
    if (index > -1) {
      room.controllers.splice(index, 1);
      console.log(
        `Controller ${controllerSocketId} removed from room ${roomCode}`,
      );
      return {
        removed: true,
        remainingControllers: room.controllers.length,
        screenSocketId: room.screen,
      };
    }

    return { removed: false };
  }

  deleteRoom(roomCode) {
    const deleted = this.rooms.delete(roomCode);
    if (deleted) {
      console.log(`Room ${roomCode} deleted`);
    }
    return deleted;
  }

  findRoomBySocket(socketId) {
    for (const [roomCode, room] of this.rooms.entries()) {
      if (room.screen === socketId || room.controllers.includes(socketId)) {
        return { roomCode, room };
      }
    }
    return null;
  }

  setGameMode(roomCode, inGame) {
    const room = this.getRoom(roomCode);
    if (room) {
      room.inGame = inGame;
      console.log(`Room ${roomCode} game mode set to: ${inGame}`);
    }
  }

  generateRoomCode() {
    // Generate 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export default RoomManager;
