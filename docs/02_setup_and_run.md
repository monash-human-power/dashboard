# Setup and run

## Prerequisites

| Requirement | Why |
|-------------|-----|
| **Node.js 14.x** | Declared in the root `package.json` `engines` field. |
| **Yarn 1.x** | Package manager for both `client/` and `server/`. |
| **Git** (for Yarn’s git dependency) | The server pulls `mhp` from `https://github.com/monash-human-power/common.git`. SSH is not required; if that repo were private, you would need GitHub auth (HTTPS token or SSH). |
| **MQTT broker on `localhost:1883`** (development) | Live telemetry flows from MQTT → server → Socket.IO → browser. Without it, the UI may load but live data will not update. |

**Optional:**

- **Python 3.6+** — only if you use the server’s `Pipfile` examples (e.g. MQTT scripts under `server/examples/`). The main app does not require Python to run.

**CI note:** The lint workflow (`.github/workflows/linter.yml`) uses Node **13.x**; local **14.x** matches the root engines and Azure deploy workflow.

## Installation

### 1. Server

```bash
cd server
yarn install
```

Create `server/.env` only when you need non-default behavior (see below).

### 2. Client

```bash
cd client
yarn install
```

For **production-style** runs (single server serving the built SPA):

```bash
cd client
yarn build
```

The Express app serves static files from `client/build/` (see `server/server.js`).

## Environment variables

Put **`server/.env`** in the `server/` folder (git-ignored). Typical variables:

| Variable | What it means |
|----------|----------------|
| `PORT` | HTTP port for Express. If unset, the server uses **5000**. |
| `HEROKU` | When set, the server uses alternate MQTT connection logic (historically for hosted environments). Local dev usually leaves this unset so the app uses `mqtt://localhost:1883`. |
| `MQTT_USERNAME`, `MQTT_PASSWORD`, `MQTT_SERVER`, `MQTT_PORT` | Intended for **public/cloud MQTT** setups. Parts of `server/js/sockets.js` reference this pattern; your local file may use hardcoded `localhost` — check the file if you need cloud brokers. |

**Client:** `client/.env` is mainly for Create React App tooling (e.g. `EXTEND_ESLINT`). It does not drive the MQTT host; that is server-side.

## How to run locally

### Development (recommended): two terminals

**Terminal 1 — React dev server (port 3000, hot reload):**

```bash
cd client
yarn start
```

**Terminal 2 — API + Socket.IO + static hosting (port 5000):**

```bash
cd server
yarn start
```

`client/src/setupProxy.js` proxies these paths to `http://localhost:5000`:

- `/files` and `/server/status`
- `/socket.io` (WebSocket)

So the browser talks to **one origin** (3000) while the backend stays on 5000.

### From repository root (shortcuts)

```bash
yarn client-start   # client dev server
yarn server-start   # server
yarn build          # production build of client only
yarn start          # server only — expects `client/build` to exist
```

### Production-like single port

1. `cd client && yarn build`  
2. `cd server && yarn start`  
3. Open `http://localhost:5000` (or your `PORT`).

## How to verify it is working

1. **Server up:** Visit `http://localhost:5000/server/status` — you should see JSON like `{ "status": "True" }`.  
2. **UI:** With dev setup, open `http://localhost:3000` — you should be redirected toward **`/v4`**.  
3. **Files API:** With the server running, `GET http://localhost:5000/files` returns `{ "files": [ ... ] }` (may be empty if `server/data/` has no files).  
4. **Live data:** With an MQTT broker and publishers on the expected topics, open the dashboard/status pages and confirm values or connection indicators change (exact behavior depends on your MQTT traffic).

## Optional: Storybook (component playground)

From `client/`:

```bash
yarn storybook
```

Useful when changing presentational components without full app wiring.

## Troubleshooting quick hits

- **`yarn install` fails on `mhp`:** The dependency uses HTTPS (`github.com/monash-human-power/common`); if it is private, authenticate with GitHub.  
- **`error:0308010C` / `ERR_OSSL_EVP_UNSUPPORTED` when running `yarn start` in `client/`:** Node 17+ (OpenSSL 3) with Webpack 4 (react-scripts 3.x). The client uses `scripts/run-with-legacy-openssl.js` so child Node processes get `--openssl-legacy-provider`. Alternatively use Node **14.x** or **16.x** (see root `engines`).  
- **Blank live data:** Start Mosquitto (or your broker) on port **1883** and confirm publishers use the topics your UI subscribes to (see [07_core_concepts.md](./07_core_concepts.md)).  
- **404 on refresh in production:** Usually a hosting config issue; this repo’s Express fallback serves `index.html` for non-API routes when run as documented.
