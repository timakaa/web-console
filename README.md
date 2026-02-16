# Web Console

AirConsole-like platform where phones become game controllers for browser-based games.

## Project Structure

```
web-console/
├── client/          # React + Vite frontend
└── server/          # Express + Socket.IO backend
```

## Getting Started

### Server Setup

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Client Setup

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:3000`

## How It Works

1. Open the app on your TV/computer and select "Screen" mode
2. A room code will be generated
3. Open the app on your phone and select "Controller" mode
4. Enter the room code to connect
5. Your phone is now a controller for the screen

## Architecture

- **Socket.IO** for real-time communication
- **Room-based system** with unique codes
- **Device roles**: Screen (TV) and Controller (Phone)
- **Event-driven**: Controllers send actions to screens

## Next Steps

- [ ] Implement Screen and Controller components
- [ ] Add QR code generation for easy joining
- [ ] Create controller UI builder API
- [ ] Build demo game
- [ ] Add custom controller layouts
