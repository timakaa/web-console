// Game registry - all available games
export const GAMES = [
  {
    id: "ping-pong",
    name: "Ping Pong",
    icon: "🏓",
    description: "2 players",
    minPlayers: 2,
    maxPlayers: 2,
    gameServerUrl: process.env.PING_PONG_SERVER_URL || "http://localhost:4001",
  },
  // Add more games here as they're developed
  {
    id: "racing-game",
    name: "Racing Game",
    icon: "🏎️",
    description: "2-4 players",
    minPlayers: 2,
    maxPlayers: 4,
    gameServerUrl:
      process.env.RACING_GAME_SERVER_URL || "http://localhost:4002",
  },
];

export const getGameById = (gameId) => {
  return GAMES.find((game) => game.id === gameId);
};

export const getAllGames = () => {
  return GAMES;
};
