# MHP DAShboard

Web dashboard and API for **Monash Human Power**’s **Data Acquisition System (DAS)**. The stack is a **React** SPA, an **Express** server that serves the built UI and REST endpoints for log files, and a **Socket.IO** bridge to an **MQTT** broker for live sensor data and device control.

## Features

- **Versioned UIs** for bike platforms **V2 (Wombat)**, **V3 (Bilby)**, and **V4** (`/v2`, `/v3`, `/v4`); home redirects to `/v4`.
- **Live telemetry** via Socket.IO (MQTT topics from the shared `mhp` package).
- **Dashboards** with charts and maps (Chart.js, Leaflet) tailored by version.
- **Boost**, **camera**, **logs**, **status**, and **power-model** flows (coverage varies by version—see `client/src/router/`).
- **Log files**: list, download, delete CSV assets under `server/data/`.
- **Health check**: `GET /server/status` for edge devices polling until the server is online.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 16, TypeScript + JavaScript, react-router-dom 5, react-bootstrap, Chart.js, Leaflet, Socket.IO client, Runtypes |
| Backend | Node.js, Express, Socket.IO, MQTT.js |
| Shared constants | Private npm package `mhp` (`git+ssh://git@github.com:monash-human-power/common.git`) |
| Tooling | Yarn 1.x, ESLint, Prettier, Storybook (client) |

## Prerequisites

- **Node.js** 14.x and **Yarn** 1.x (see root `package.json` `engines`).
- A running **MQTT broker** (default in code: `mqtt://localhost:1883`) when exercising live data.
- **SSH access** to GitHub configured for cloning the private `mhp` dependency (`server/yarn install`).

## Installation

### 1. Clone and install the server

```bash
cd server
yarn install
```

Create `server/.env` when you need non-default MQTT or hosting flags (see below).

### 2. Install and build the client

```bash
cd client
yarn install
yarn build
```

The production server expects static files at `client/build` (see `server/server.js`).

### 3. Run the production server

From the `server` directory:

```bash
yarn start
```

The app listens on `PORT` or **5000** and serves the SPA plus API routes.

## Development workflow

Run **client** and **server** in separate terminals for hot reload and API proxying.

**Terminal 1 — React dev server (port 3000):**

```bash
cd client
yarn start
```

**Terminal 2 — API + Socket.IO + static (port 5000):**

```bash
cd server
yarn start
```

`client/src/setupProxy.js` forwards `/files`, `/server/status`, and `/socket.io` to `http://localhost:5000`.

Convenience scripts from the **repository root**:

```bash
yarn client-start   # dev client
yarn server-start   # server
yarn build          # client production build
yarn start          # server only (expects built client)
```

## Environment variables

Place a `.env` file in **`server/`** (ignored by git). Examples referenced in code and docs:

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default 5000) |
| `HEROKU` | When set, server uses alternate MQTT connection behavior for hosted instances |
| `MQTT_USERNAME`, `MQTT_PASSWORD`, `MQTT_SERVER`, `MQTT_PORT` | Used when public MQTT options are enabled (see `server/js/sockets.js`) |

Client `client/.env` currently contains development flags (e.g. `EXTEND_ESLINT`).

## HTTP API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/files` | GET | JSON list of filenames in `server/data/` |
| `/files/recent` | GET | Download the most recently modified file |
| `/files/:filename` | GET | Download a specific file |
| `/files/:filename` | DELETE | Delete a specific file |
| `/server/status` | GET | `{ "status": "True" }` when the server is up |

## Deployment

- **Azure Web App** (`DashMHP`): GitHub Actions on `master` builds the client, installs server dependencies, and deploys (`.github/workflows/deploy_to_azure.yaml`). Requires secrets for Azure publish profile and SSH key for the `mhp` dependency.
- **Lint CI**: Pull requests run ESLint in `client` and `server` (`.github/workflows/linter.yml`).

## Project structure (brief)

```
├── client/          # React app (src/views, src/components, src/api, src/router)
├── server/          # Express + Socket.IO + MQTT (server.js, js/sockets.js, data/)
├── docs/            # Engineering documentation and backlog
└── .github/workflows/
```

## Documentation

Detailed architecture, implementation status, backlog, and recommendations: **[docs/README.md](docs/README.md)**.

## Future improvements

See **[docs/06-improvement-recommendations.md](docs/06-improvement-recommendations.md)** and **[docs/04-product-backlog.md](docs/04-product-backlog.md)**. High-impact items include consolidating MQTT message handling, modernizing the Node/React toolchain, and adding automated tests.

## Contributors

Thanks to all [contributors](https://github.com/monash-human-power/dashboard/graphs/contributors) on the Monash Human Power project.

![eslint Checker](https://github.com/monash-human-power/dashboard/workflows/eslint%20Checker/badge.svg)
