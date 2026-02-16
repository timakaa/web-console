import {
  handleCreateRoom,
  handleCreateRoomWithCode,
  handleJoinRoom,
} from "../handlers/roomHandlers.js";
import {
  handleControllerInput,
  handleStartGame,
  handleGameSelection,
} from "../handlers/gameHandlers.js";
import { handleDisconnect } from "../handlers/disconnectHandler.js";

export const setupSocketHandlers = (io, roomManager) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Room management
    socket.on("create-room", (callback) => {
      handleCreateRoom(socket, roomManager, callback);
    });

    socket.on("create-room-with-code", (data, callback) => {
      handleCreateRoomWithCode(socket, roomManager, data, callback);
    });

    socket.on("join-room", (data, callback) => {
      handleJoinRoom(socket, io, roomManager, data, callback);
    });

    // Game events
    socket.on("controller-input", (data) => {
      handleControllerInput(io, roomManager, data, socket.id);
    });

    socket.on("start-game", (data) => {
      console.log("[socketManager] start-game event received:", data);
      // Check if this is a game selection (has gameId) or just starting game mode
      if (data.gameId && data.gameServerUrl) {
        console.log("[socketManager] Routing to handleGameSelection");
        handleGameSelection(io, roomManager, data, socket.id);
      } else {
        console.log("[socketManager] Routing to handleStartGame");
        handleStartGame(io, roomManager, data);
      }
    });

    socket.on("get-room-state", ({ roomCode }, callback) => {
      const room = roomManager.getRoom(roomCode);
      if (room) {
        console.log(`Sending room state for ${roomCode} to ${socket.id}`);
        callback({
          success: true,
          controllers: room.controllers,
          totalControllers: room.controllers.length,
        });
      } else {
        console.log(`Room ${roomCode} not found for get-room-state`);
        callback({ success: false, error: "Room not found" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      handleDisconnect(socket, io, roomManager);
    });
  });
};
