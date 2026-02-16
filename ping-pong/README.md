# Ping Pong Game

A multiplayer ping pong game for the web-console platform.

## Structure

```
ping-pong/
├── client/          # React app (Vite) - Controller & Screen UI
│   ├── src/
│   │   ├── controller/  # Controller interface
│   │   └── screen/      # Game screen (TODO)
│   ├── controller.html
│   ├── screen.html
│   └── package.json
└── server/          # Socket.IO game server
    ├── index.js
    └── package.json
```

## Setup & Run

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Start the Game

You need to run both the client and server:

**Terminal 1 - Start the client (Vite dev server):**

```bash
cd client
npm run dev
```

This runs on `http://localhost:5174`

**Terminal 2 - Start the server (Socket.IO game server):**

```bash
cd server
npm run dev
```

This runs on `http://localhost:4001`

### 3. Play the Game

1. Start the main web-console server
2. Create a room and connect controllers
3. Navigate to Game Repository
4. Select "Ping Pong" 🏓
5. Controllers will redirect to the ping-pong controller
6. Screen will redirect to the ping-pong game screen

## How It Works

1. **Main server** connects to ping-pong server (port 4001)
2. **Ping-pong server** returns URLs for controller and screen
3. **Main server** redirects controllers/screen to ping-pong client (port 5174)
4. **Controllers/Screen** connect directly to ping-pong server for game logic
5. **Game runs independently** with its own Socket.IO connection

## Development

- **Client**: React + Vite + Tailwind CSS
- **Server**: Node.js + Socket.IO
- **Ports**:
  - Client: 5174
  - Server: 4001
