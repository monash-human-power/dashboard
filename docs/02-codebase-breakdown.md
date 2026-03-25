# Codebase breakdown

## High-level architecture

**Pattern:** Monolithic **Node.js** server (Express + HTTP for REST + static SPA) with **Socket.IO** attached to the same HTTP server. **MQTT** is the system bus; the server is an MQTT client that **fan-outs** messages to connected browsers. The React app does not talk to MQTT directly—it uses Socket.IO and HTTP.

```
[Bike / sensors / services] --MQTT--> [Node server (sockets.js)] --Socket.IO--> [React SPA]
                                              |
                                         REST /files, /server/status
                                              |
                                         Static: client/build
```

Evidence: `server/server.js`, `server/js/sockets.js`, `client/src/api/common/socket.ts`.

## Folder structure

| Path | Role |
|------|------|
| **`/client`** | Create React App (rewired) frontend: `src/views` (pages), `src/components` (v2/v3/v4 + common), `src/api` (HTTP + socket helpers), `src/router`, `public/`. |
| **`/server`** | Express entry `server.js`, Socket/MQTT logic `js/sockets.js`, helpers `js/util.js`, optional Python `logger.py` (MQTT → CSV in `data/`), `examples/`, `service/` (systemd + install scripts). |
| **`/.github/workflows`** | `linter.yml` (client + server eslint on PR), `deploy_to_azure.yaml` (build client, install server, deploy to Azure `DashMHP`). |
| **Root `package.json`** | Orchestrates `client-start`, `server-start`, `build`, `start` (Heroku-style combined flow). |

## Key modules and responsibilities

### Server

- **`server/server.js`**  
  - `body-parser`, static files from `../client/build`.  
  - Ensures `server/data` exists.  
  - Initializes sockets via `require('./js/sockets.js').init(server)`.  
  - REST: file listing/download/delete, `/server/status`, catch-all SPA route.

- **`server/js/sockets.js`**  
  - Connects to `mqtt://localhost:1883` (or Heroku path via `connectToPublicMQTTBroker`).  
  - Imports `DAS`, `BOOST`, `Camera`, `WirelessModule`, `V3`, `V4` from **`mhp`**.  
  - Subscribes to DAS, Boost, camera, `status/#`, wireless module topics, V4 topics, etc.  
  - On MQTT messages: updates in-memory `retained` state, `socket.emit(...)` to clients.  
  - On client events: `mqttClient.publish(...)` (Boost, camera, power plan, V3/V4 start, wireless module start/stop, optional public broker relay for `DAS.data`).

- **`server/js/util.js`**  
  - `getPropWithPath` / `setPropWithPath` for nested retained state (referenced from `sockets.js`).

### Client

- **`client/src/App.js`**  
  - `react-router-dom` `Switch` over `routes` from `router/index.ts`; global `NavBarContainer`, `react-hot-toast`.

- **`client/src/router/index.ts`**  
  - `bikeVersions`: V2/V3/V4 metadata and per-version route arrays (`v2.ts`, `v3.ts`, `v4.ts`).

- **`client/src/api/common/socket.ts`**  
  - Single `socket.io-client` instance; `emit`, `useChannel`, `useChannelShaped` (Runtypes validation).

- **`client/src/api/common/data.ts`**  
  - Wireless module and V4 sensor hooks (`useModuleData`, battery/online, V3/V4 start/stop emits)—shared across V3/V4 UIs.

- **`client/src/api/common/files.ts`**  
  - Fetch `/files`, delete via REST.

- **`client/src/api/v2/sensors/`**  
  - V2-specific time series and sensor hooks (JS/TS mix).

- **`client/src/api/v3`**, **`client/src/api/v4`**  
  - Currently **README-only placeholders**; logic lives under `api/common` and version-specific components.

## Data flow

1. **Telemetry:** Device publishes to MQTT → `sockets.js` handler → parses JSON / query-string (V2 `DAS.data`) → `socket.emit` channel (e.g. `data`, `status-*`, `wireless_module-*`, `camera-*`, Boost topics).

2. **Commands:** React calls `emit('…')` → server `socket.on` → `mqttClient.publish(topic, payload)`.

3. **Retained snapshots:** Server keeps `retained`, `retainedv4`; clients can request slices via `get-status-payload`, `get-payload`, `get-boost-configs`, etc.

4. **Logs:** Python or other writers drop CSV into `server/data/`; UI lists/downloads via HTTP.

## Design patterns (observed)

- **Singleton socket** shared app-wide (`socket.ts`).
- **Custom hooks** for subscriptions (`useChannel`, `useModuleData`, `useFiles`).
- **Runtypes** for defensive parsing on some channels (`useChannelShaped`).
- **Versioned UI** (v2/v3/v4 folders) with **shared** Boost, camera, logs views.
- **Topic constants** centralized in external `mhp` package (not redefined in this repo).

## External dependencies

### Runtime (client) — from `client/package.json`

React 16, react-router-dom 5, react-bootstrap, bootstrap, chart.js + react-chartjs-2, leaflet + react-leaflet, socket.io-client, runtypes, lodash, react-hook-form, react-hot-toast, fontawesome, Storybook 6, testing-library (declared).

### Runtime (server) — from `server/package.json`

express, body-parser, socket.io, mqtt, dotenv, ejs, **`mhp`** (git+ssh `monash-human-power/common`), `path` (npm package—non-ideal duplicate of Node core).

### Infrastructure / tooling

- Yarn 1.x, Node 14 (root `package.json` engines; Azure workflow uses 14.x).
- Azure Web Apps deploy; SSH agent for private `mhp` clone in CI.

### Private / org

- **`mhp`**: MQTT topic strings and domain types; required for server install and topic alignment.
