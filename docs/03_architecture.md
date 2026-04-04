# Architecture

## High-level shape

This is a **small monolith**, not microservices:

- One **Express** HTTP server process.
- One **React** single-page application (SPA) for the UI.
- **Socket.IO** on the same Node process for real-time events.
- An **MQTT client** inside that process that **subscribes** to topics and **forwards** messages to connected browsers.

```
┌─────────────┐     HTTP / WS      ┌──────────────────────────────┐
│   Browser   │ ◄─────────────────►│  Express + Socket.IO (Node)   │
│  (React SPA)│                    │  • REST: /files, /server/...  │
└─────────────┘                    │  • socket.io bridge           │
                                   └──────────────┬───────────────┘
                                                  │ MQTT subscribe/publish
                                                  ▼
                                         ┌─────────────────┐
                                         │  MQTT broker    │
                                         │  (e.g. :1883)   │
                                         └─────────────────┘
                                         ▲
                                         │ publishers (DAS, sensors, etc.)
                                         └ field devices / services
```

**Analogy:** Express is the **front desk** (pages + file API). Socket.IO is the **PA system** to every open browser tab. MQTT is the **radio channel** the desk listens to and repeats in a shape the UI understands.

## Tech stack

| Layer | Technologies |
|--------|----------------|
| UI | React 16, TypeScript + JavaScript, React Router 5, react-bootstrap, Chart.js, Leaflet, Runtypes |
| Real-time | socket.io-client ↔ Socket.IO server |
| HTTP API | Express, `body-parser` |
| Messaging | mqtt.js; topic names from **`mhp`** package |
| Build | Create React App + `react-app-rewired`, Yarn 1.x |

## Major components

### Client (`client/`)

- **`src/index.js`** — boots React, global CSS.  
- **`src/App.js`** — router shell, navbar, toast host.  
- **`src/router/`** — route tables per bike version (`v2`, `v3`, `v4`) merged in `index.ts`.  
- **`src/views/`** — full pages (dashboard, status, logs, …).  
- **`src/components/`** — reusable UI (versioned under `v2` / `v3` / `v4` / `common`).  
- **`src/api/`** — fetch helpers, Socket.IO hooks (`api/common/socket.ts`), version-specific data glue.

### Server (`server/`)

- **`server.js`** — Express app, static files from `../client/build`, REST routes for files and health, catch-all SPA route, HTTP server passed into sockets.  
- **`js/sockets.js`** — MQTT connect/subscribe, Socket.IO `connection` handler, topic → `socket.emit` mapping, retained state for some domains.  
- **`data/`** — log files exposed via `/files` (created on first run if missing).

### Shared package

- **`mhp`** (private) — DAS topic constants (`DAS`, `BOOST`, `Camera`, `WirelessModule`, `V3`, `V4`, …). Both server and client logic assume these names match what hardware/software publishes.

## How components interact (simple)

1. User opens the SPA → React Router picks a **versioned** view.  
2. View uses **`api/`** modules → **REST** `fetch('/files')` or **Socket.IO** `emit` / `on`.  
3. Dev: CRA proxy sends `/files` and `/socket.io` to port 5000. Prod: same host serves both.  
4. Server **MQTT** client receives messages → **`sockets.js`** parses topic/payload → emits named Socket.IO events → React hooks update state.

## Deployment (conceptual)

- **Azure Web App:** GitHub Action builds the client, installs server deps, deploys (see `.github/workflows/deploy_to_azure.yaml`).  
- **Heroku-style prebuild:** Root `package.json` has a `heroku-prebuild` script that installs/builds client then server.

For folder-level detail, see [04_codebase_structure.md](./04_codebase_structure.md).
