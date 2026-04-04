# Testing and debugging

## How to run tests

### Client

```bash
cd client
yarn test
```

This runs **Create React App’s** Jest runner (`react-app-rewired test`). It is **interactive by default** (watch mode). In CI you would use `CI=true yarn test` for a single run.

**Reality check:** There are **no `*.test.*` / `*.spec.*` files** under `client/src` in this repository today, so the suite may run **zero tests** unless you add them. `setupTests.js` only imports `@testing-library/jest-dom`.

### Server

```bash
cd server
yarn test
```

The server `package.json` maps this to **ESLint**, not unit tests:

```json
"test": "npm run eslint ."
```

So **`yarn test` on the server = lint check**.

### Linting (explicit)

```bash
cd client && yarn lint
cd server && yarn lint
```

### CI

Pull requests run **`.github/workflows/linter.yml`**: `yarn` + `yarn lint` in **client** and **server** (with SSH agent for private `mhp`).

## Where tests would live

- **Client unit tests:** Colocate as `*.test.tsx` / `*.test.ts` next to components, or under `client/src/__tests__/` (CRA convention).  
- **Server unit tests:** Typically `server/**/*.test.js` with Jest or another runner — **not set up** in this repo today.

## How to debug locally

### React (Chrome / Edge DevTools)

1. Run `yarn start` in `client/`.  
2. Open DevTools → **Sources** → set breakpoints in bundled code, or use **`debugger;`** statements.  
3. **React DevTools** extension helps inspect props and state.

### Network tab

- Watch **`/files`** and **`/server/status`** XHRs.  
- Watch **WebSocket** frames for **`socket.io`** (dev: proxied through port 3000).

### Server (Node)

1. Run the server with Chrome inspector, e.g.  
   `node --inspect server.js`  
   from `server/`, then open `chrome://inspect`.  
2. **`console.log`** in `server.js` and `js/sockets.js` is still widely used — follow MQTT connect logs and “Unhandled topic” errors.

### MQTT

Use **mosquitto_sub** / **MQTT Explorer** / similar to **subscribe to the same topics** the server uses. If messages appear in the broker but not the UI, the bug is likely in **`sockets.js`** mapping or client channel names.

## Common debugging entry points

| Symptom | First places to look |
|---------|----------------------|
| UI loads, no live data | MQTT broker running? `server/js/sockets.js` connect + subscribe; client `api/common/socket.ts` |
| Files list empty | `server/data/` contents; `GET /files` response |
| Wrong bike UI | `router/v*.ts` paths; `NavBar` version links |
| Boost / camera stuck | MQTT topics vs `mhp` constants; `sockets.js` switch cases; Runtype mismatch (console “sending garbage”) |
| CORS / 404 on API in dev | `setupProxy.js` paths; ensure server on **5000** and client on **3000** |

## Storybook

For **isolated UI** work:

```bash
cd client
yarn storybook
```

Several `*.stories.tsx` files exist under `components/` (e.g. status tiles, statistics).
