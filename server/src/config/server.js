export const serverConfig = {
  port: process.env.PORT || 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  socketOptions: {
    transports: ["websocket", "polling"],
    allowEIO3: true,
  },
};
