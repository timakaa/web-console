import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useScreenSocket } from "../context/ScreenSocketContext";

function GameRepository() {
  const { roomCode } = useParams();
  const { socket } = useScreenSocket();
  const [controllers, setControllers] = useState([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameUrl, setGameUrl] = useState(null);
  const isFirstRender = useRef(true);

  // Fetch games from backend
  useEffect(() => {
    fetch("http://localhost:3001/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch games:", err);
        setLoading(false);
      });
  }, []);

  // Play sound when game selection changes (but not on initial render)
  useEffect(() => {
    // Skip sound on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Don't play sound when games aren't loaded
    if (loading || games.length === 0) return;

    // Create a new audio instance each time so sounds can overlap
    const sound = new Audio("/switch.mp3");
    sound.volume = 0.5;
    sound.play().catch((err) => {
      console.log("Sound play failed:", err);
    });
  }, [selectedGameIndex]);

  useEffect(() => {
    if (!socket) {
      console.error("No socket available in GameRepository");
      return;
    }

    console.log("GameRepository mounted, roomCode:", roomCode);

    const setupConnection = () => {
      console.log("GameRepository socket connected");
      socket.emit("rejoin-room-as-screen", { roomCode }, (response) => {
        if (response.success) {
          console.log("Room state received:", response);
          // Initialize controllers from room state
          const controllerList = response.controllers.map((id) => ({ id }));
          setControllers(controllerList);
        } else {
          console.error("Failed to rejoin room:", response.error);
        }
      });
    };

    if (socket.connected) {
      setupConnection();
    } else {
      socket.once("connect", setupConnection);
    }

    socket.on("controller-input", ({ controllerId, action, data }) => {
      console.log("Controller input received:", { controllerId, action, data });
      handleControllerInput(action);
    });

    socket.on("controller-joined", ({ controllerId }) => {
      console.log("New controller joined:", controllerId);
      setControllers((prev) => [...prev, { id: controllerId }]);
    });

    socket.on("controller-left", ({ controllerId }) => {
      console.log("Controller left:", controllerId);
      setControllers((prev) => prev.filter((c) => c.id !== controllerId));
    });

    socket.on("room-empty", () => {
      console.log("Room is empty, redirecting to home");
      window.location.href = "/";
    });

    socket.on("load-game-screen", ({ url, gameId }) => {
      console.log(`Loading game screen: ${gameId} at ${url}`);
      setGameUrl(url);
    });

    socket.on("game-error", ({ message }) => {
      console.error("Game error:", message);
      alert(`Cannot start game: ${message}`);
    });

    return () => {
      // Clean up listeners but don't close socket
      socket.off("controller-input");
      socket.off("controller-joined");
      socket.off("controller-left");
      socket.off("room-empty");
      socket.off("load-game-screen");
      socket.off("game-error");
    };
  }, [socket, roomCode, games]);

  const handleGameSelect = () => {
    const selectedGame = games[selectedGameIndex];
    console.log("Game selected:", selectedGame);

    // Check if we have the right number of players
    const playerCount = controllers.length;
    if (playerCount < selectedGame.minPlayers) {
      console.log(
        `Not enough players: ${playerCount}/${selectedGame.minPlayers} required`,
      );
      // Could show an error message to the user here
      return;
    }

    if (playerCount > selectedGame.maxPlayers) {
      console.log(
        `Too many players: ${playerCount}/${selectedGame.maxPlayers} maximum`,
      );
      // Could show an error message to the user here
      return;
    }

    if (socket && selectedGame.gameServerUrl) {
      // Notify main server to start the game
      socket.emit("start-game", {
        roomCode,
        gameId: selectedGame.id,
        gameServerUrl: selectedGame.gameServerUrl,
      });
    }
  };

  const handleControllerInput = (action) => {
    if (games.length === 0) return; // Don't process input if games aren't loaded yet

    switch (action) {
      case "up":
        setSelectedGameIndex((prev) => {
          const newIndex = prev - 2;
          return newIndex >= 0 ? newIndex : prev;
        });
        break;
      case "down":
        setSelectedGameIndex((prev) => {
          const newIndex = prev + 2;
          return newIndex < games.length ? newIndex : prev;
        });
        break;
      case "left":
        setSelectedGameIndex((prev) => (prev % 2 === 1 ? prev - 1 : prev));
        break;
      case "right":
        setSelectedGameIndex((prev) =>
          prev % 2 === 0 && prev + 1 < games.length ? prev + 1 : prev,
        );
        break;
      case "select":
        handleGameSelect();
        break;
      default:
        break;
    }
  };

  // If game URL is loaded, show iframe
  if (gameUrl) {
    return (
      <iframe
        src={gameUrl}
        className='w-full h-screen border-0'
        title='Game Screen'
        allow='fullscreen'
      />
    );
  }

  return (
    <div className='min-h-screen p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold mb-4'>Game Repository</h1>
          <p className='text-gray-400'>
            {controllers.length} player{controllers.length !== 1 ? "s" : ""}{" "}
            connected
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='text-center py-20'>
            <div className='text-4xl mb-4 animate-pulse'>🎮</div>
            <p className='text-gray-400'>Loading games...</p>
          </div>
        )}

        {/* Games Grid - 2 Columns */}
        {!loading && (
          <div className='grid grid-cols-2 gap-6'>
            {games.map((game, index) => {
              const playerCount = controllers.length;
              const isPlayable =
                playerCount >= game.minPlayers &&
                playerCount <= game.maxPlayers;
              const needsMorePlayers = playerCount < game.minPlayers;
              const tooManyPlayers = playerCount > game.maxPlayers;

              return (
                <div
                  key={game.id}
                  className={`p-6 rounded-xl transition-all duration-150 ${
                    index === selectedGameIndex
                      ? isPlayable
                        ? "bg-indigo-600 shadow-2xl shadow-indigo-500/50"
                        : "bg-red-600/50 shadow-2xl shadow-red-500/50"
                      : isPlayable
                        ? "bg-gray-800/50"
                        : "bg-gray-800/30 opacity-50"
                  }`}
                >
                  <div className='flex flex-col items-center text-center gap-4'>
                    <div className='text-5xl'>{game.icon}</div>
                    <div>
                      <h2 className='text-2xl font-bold mb-1'>{game.name}</h2>
                      <p className='text-sm text-gray-400'>
                        {game.description}
                      </p>
                      {!isPlayable && (
                        <p className='text-xs text-red-400 mt-2'>
                          {needsMorePlayers &&
                            `Need ${game.minPlayers - playerCount} more player${game.minPlayers - playerCount > 1 ? "s" : ""}`}
                          {tooManyPlayers &&
                            `Max ${game.maxPlayers} players allowed`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        {!loading && (
          <div className='mt-12 text-center text-gray-500'>
            <p>Use your controller to navigate and select a game</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameRepository;
