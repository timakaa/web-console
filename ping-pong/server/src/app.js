import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import { setupSocketHandlers } from "./socket/socketManager.js";
import { RoomManager } from "./services/RoomManager.js";
import { getGameConfig } from "./config/game.js";

dotenv.config();

const PORT = process.env.PORT || 4001;

// Create HTTP server and Socket.IO instance
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize room manager
const roomManager = new RoomManager();

// Setup socket handlers
setupSocketHandlers(io, roomManager);

// Start server
httpServer.listen(PORT, () => {
  const gameConfig = getGameConfig();
  console.log(`[Ping Pong Server] Running on port ${PORT}`);
  console.log(`[Ping Pong Server] Controller URL: ${gameConfig.controllerUrl}`);
  console.log(`[Ping Pong Server] Screen URL: ${gameConfig.screenUrl}`);
});
