export const handleControllerInput = (
  io,
  roomManager,
  { roomCode, action, data },
  socketId,
) => {
  const room = roomManager.getRoom(roomCode);
  if (room && room.screen) {
    io.to(room.screen).emit("controller-input", {
      controllerId: socketId,
      action,
      data,
    });
  }
};

export const handleStartGame = (io, roomManager, { roomCode }) => {
  const room = roomManager.getRoom(roomCode);
  if (room) {
    // Set room to game mode
    roomManager.setGameMode(roomCode, true);

    // Notify screen and all controllers that game is starting
    io.to(roomCode).emit("game-started", {
      totalControllers: room.controllers.length,
    });
    console.log(`Game started in room ${roomCode}, game mode enabled`);
  }
};

export const handleGameSelection = async (
  io,
  roomManager,
  { roomCode, gameId, gameServerUrl },
  socketId,
) => {
  console.log(`[handleGameSelection] Called with:`, {
    roomCode,
    gameId,
    gameServerUrl,
    socketId,
  });

  const room = roomManager.getRoom(roomCode);
  if (!room) {
    console.error(`[handleGameSelection] Room ${roomCode} not found`);
    return;
  }

  console.log(`[handleGameSelection] Room found:`, {
    controllers: room.controllers.length,
    screen: room.screen,
  });

  // Import game config to validate player count
  const { getGameById } = await import("../config/games.js");
  const gameConfig = getGameById(gameId);

  if (!gameConfig) {
    console.error(`[handleGameSelection] Game ${gameId} not found in config`);
    io.to(room.screen).emit("game-error", {
      message: "Game not found",
    });
    return;
  }

  // Validate player count
  const playerCount = room.controllers.length;
  if (playerCount < gameConfig.minPlayers) {
    console.error(
      `[handleGameSelection] Not enough players: ${playerCount}/${gameConfig.minPlayers} required`,
    );
    io.to(room.screen).emit("game-error", {
      message: `Need at least ${gameConfig.minPlayers} players to start this game`,
    });
    return;
  }

  if (playerCount > gameConfig.maxPlayers) {
    console.error(
      `[handleGameSelection] Too many players: ${playerCount}/${gameConfig.maxPlayers} maximum`,
    );
    io.to(room.screen).emit("game-error", {
      message: `Maximum ${gameConfig.maxPlayers} players allowed for this game`,
    });
    return;
  }

  console.log(
    `[handleGameSelection] Starting game ${gameId} for room ${roomCode}`,
  );

  try {
    // Connect to game server
    const { io: ioClient } = await import("socket.io-client");
    console.log(
      `[handleGameSelection] Connecting to game server: ${gameServerUrl}`,
    );
    const gameSocket = ioClient(gameServerUrl);

    gameSocket.on("connect", () => {
      console.log(
        `[handleGameSelection] Connected to game server: ${gameServerUrl}`,
      );

      // Request game configuration
      gameSocket.emit("get-game-config", (config) => {
        console.log("[handleGameSelection] Received game config:", config);

        // Notify game server about the room
        gameSocket.emit("room-start-game", {
          roomCode,
          controllers: room.controllers,
        });

        // Redirect controllers to game controller URL
        room.controllers.forEach((controllerId, index) => {
          const playerNumber = index + 1;
          const controllerUrl = `${config.controllerUrl}?room=${roomCode}&player=${playerNumber}`;

          console.log(
            `[handleGameSelection] Sending load-game-controller to ${controllerId}:`,
            controllerUrl,
          );
          io.to(controllerId).emit("load-game-controller", {
            url: controllerUrl,
            gameId,
          });
        });

        // Redirect screen to game screen URL
        const screenUrl = `${config.screenUrl}?room=${roomCode}`;
        console.log(
          `[handleGameSelection] Sending load-game-screen to ${room.screen}:`,
          screenUrl,
        );
        io.to(room.screen).emit("load-game-screen", {
          url: screenUrl,
          gameId,
        });
      });
    });

    gameSocket.on("connect_error", (err) => {
      console.error(
        `[handleGameSelection] Failed to connect to game server: ${err.message}`,
      );
      io.to(room.screen).emit("game-error", {
        message: "Failed to connect to game server",
      });
    });
  } catch (error) {
    console.error("[handleGameSelection] Error starting game:", error);
    io.to(room.screen).emit("game-error", {
      message: "Failed to start game",
    });
  }
};
