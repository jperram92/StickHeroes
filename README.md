# 3D Multiplayer Web Game

A real-time 3D multiplayer web game built with React, Three.js, and WebSocket where players can create customizable characters and interact in a shared 3D world.

## Features

- **User Authentication**
  - Secure login and registration system
  - Session management

- **Character Customization**
  - Adjustable character color
  - Configurable height and width
  - Preview before entering the game world

- **3D Game World**
  - Interactive environment with obstacles and decorations
  - Real-time character movement and physics
  - Dynamic camera controls

- **Controls**
  - WASD keys for movement
  - Space bar for jumping
  - Mouse drag for camera rotation

- **Real-time Chat**
  - In-game chat system
  - Join/leave notifications

## Tech Stack

- React with TypeScript
- Three.js for 3D rendering
- WebSocket for real-time communication
- Express.js backend
- Authentication with Passport.js

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open `http://localhost:5000` in your browser

## Environment Variables

The following environment variables are required:

- `SESSION_SECRET`: Secret key for session management

## License

MIT
