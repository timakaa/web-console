import {
  handleGetGameConfig,
  handleRoomStartGame,
  handleControllerJoin,
  handleScreenJoin,
  handleDisconnect,
} from "../handlers/connectionHandlers.js";
import { handleStartGameRequest } from "../handlers/gameHandlers.js";
import { handleControllerAction } from "../handlers/controllerHandlers.js";
import { handleRequestRematch } from "../handlers/rematchHandlers.js";

export function setupSocketHandlers(io, roomManager) {
  io.on("connection", (socket) => {
    console.log("[Ping Pong Server] Client connected:", socket.id);

    // Main server requests game config
    socket.on("get-game-config", (callback) => {
      handleGetGameConfig(callback);
    });

    // Main server notifies game that a room is starting
    socket.on("room-start-game", (data) => {
      handleRoomStartGame(io, roomManager, data);
    });

    // Controller joins the game
    socket.on("controller-join", (data) => {
      handleControllerJoin(socket, roomManager, data);
    });

    // Screen joins the game
    socket.on("screen-join", (data) => {
      handleScreenJoin(socket, roomManager, data);
    });

    // Start game request from screen or controller
    socket.on("start-game-request", (data) => {
      handleStartGameRequest(io, roomManager, data);
    });

    // Controller action
    socket.on("controller-action", (data) => {
      handleControllerAction(io, roomManager, data);
    });

    // Request rematch
    socket.on("request-rematch", (data) => {
      handleRequestRematch(io, roomManager, data);
    });

    // Disconnect
    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });
  });
}
