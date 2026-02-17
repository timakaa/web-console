import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5174";
const rooms = new Map();

// Game configuration
const GAME_CONFIG = {
  name: "Ping Pong",
  controllerUrl: `${CLIENT_URL}/controller.html`,
  screenUrl: `${CLIENT_URL}/screen.html`,
  minPlayers: 2,
  maxPlayers: 2,
};

io.on("connection", (socket) => {
  console.log("[Ping Pong Server] Client connected:", socket.id);

  // Main server requests game config
  socket.on("get-game-config", (callback) => {
    console.log("[Ping Pong Server] Sending game config");
    callback(GAME_CONFIG);
  });

  // Main server notifies game that a room is starting
  socket.on("room-start-game", ({ roomCode, controllers }) => {
    console.log(
      `[Ping Pong Server] Room ${roomCode} starting game with controllers:`,
      controllers,
    );

    rooms.set(roomCode, {
      controllers: controllers.map((id, index) => ({
        id,
        playerId: index + 1,
        y: 50,
        score: 0,
        moving: null, // null, 'up', or 'down'
      })),
      ball: { x: 50, y: 50, vx: 0.5, vy: 0.6 },
      gameStarted: false,
    });

    // Send initial state
    io.to(roomCode).emit("game-state", rooms.get(roomCode));
  });

  // Controller joins the game
  socket.on("controller-join", ({ roomCode, playerId }) => {
    console.log(
      `[Ping Pong Server] Controller ${playerId} joined room ${roomCode}`,
    );
    socket.join(roomCode);

    const room = rooms.get(roomCode);
    if (room) {
      socket.emit("game-state", room);
    }
  });

  // Screen joins the game
  socket.on("screen-join", ({ roomCode }) => {
    console.log(`[Ping Pong Server] Screen joined room ${roomCode}`);
    socket.join(roomCode);

    const room = rooms.get(roomCode);
    if (room) {
      socket.emit("game-state", room);

      // Start game loop if not started
      if (!room.gameStarted) {
        room.gameStarted = true;
        startGameLoop(roomCode);
      }
    }
  });

  // Controller action
  socket.on("controller-action", ({ roomCode, playerId, action }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.controllers.find(
      (p) => p.playerId === parseInt(playerId),
    );
    if (!player) return;

    // Update paddle movement state based on hold/release
    if (action === "up-hold") {
      player.moving = "up";
    } else if (action === "down-hold") {
      player.moving = "down";
    } else if (action === "up-release" || action === "down-release") {
      player.moving = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("[Ping Pong Server] Client disconnected:", socket.id);
  });
});

function startGameLoop(roomCode) {
  const interval = setInterval(() => {
    const room = rooms.get(roomCode);
    if (!room) {
      clearInterval(interval);
      return;
    }

    // Check if we have both players
    const player1 = room.controllers[0];
    const player2 = room.controllers[1];

    if (!player1 || !player2) {
      // Not enough players, just broadcast current state
      io.to(roomCode).emit("game-state", room);
      return;
    }

    // Update paddle positions based on movement state
    room.controllers.forEach((player) => {
      if (player.moving === "up") {
        player.y = Math.max(10, player.y - 1);
      } else if (player.moving === "down") {
        player.y = Math.min(90, player.y + 1);
      }
    });

    // Update ball position
    room.ball.x += room.ball.vx;
    room.ball.y += room.ball.vy;

    // Ball collision with top/bottom
    if (room.ball.y <= 0 || room.ball.y >= 100) {
      room.ball.vy *= -1;
    }

    // Ball collision with paddles
    // Left paddle (player 1) - paddle is at ~1% from left edge
    if (room.ball.x <= 2 && Math.abs(room.ball.y - player1.y) < 10) {
      room.ball.vx *= -1.05; // Reverse direction and increase speed by 5%
      room.ball.x = 2;
      io.to(roomCode).emit("paddle-hit", { playerId: 1 });
    }

    // Right paddle (player 2) - paddle is at ~99% from left edge
    if (room.ball.x >= 98 && Math.abs(room.ball.y - player2.y) < 10) {
      room.ball.vx *= -1.05; // Reverse direction and increase speed by 5%
      room.ball.x = 98;
      io.to(roomCode).emit("paddle-hit", { playerId: 2 });
    }

    // Score points and bounce off walls
    if (room.ball.x <= 0) {
      player2.score++;
      // Bounce off left wall with reset velocity
      room.ball.vx = 0.5; // Reset to default speed going right
      room.ball.x = 0;
    } else if (room.ball.x >= 100) {
      player1.score++;
      // Bounce off right wall with reset velocity
      room.ball.vx = -0.5; // Reset to default speed going left
      room.ball.x = 100;
    }

    // Broadcast game state
    io.to(roomCode).emit("game-state", room);
  }, 1000 / 60); // 60 FPS
}

httpServer.listen(PORT, () => {
  console.log(`[Ping Pong Server] Running on port ${PORT}`);
  console.log(
    `[Ping Pong Server] Controller URL: ${GAME_CONFIG.controllerUrl}`,
  );
  console.log(`[Ping Pong Server] Screen URL: ${GAME_CONFIG.screenUrl}`);
});
