import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { serverConfig } from "./config/server.js";
import { setupSocketHandlers } from "./socket/socketManager.js";
import RoomManager from "./services/RoomManager.js";
import { getAllGames } from "./config/games.js";

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: serverConfig.cors,
  ...serverConfig.socketOptions,
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const roomManager = new RoomManager();

// Setup Socket.IO handlers
setupSocketHandlers(io, roomManager);

// API Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", rooms: roomManager.rooms.size });
});

app.get("/api/games", (req, res) => {
  res.json(getAllGames());
});

// Start server
httpServer.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
});

export { app, httpServer, io };
