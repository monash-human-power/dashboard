# Execution flow

## Entry points

| Layer | File | What starts |
|-------|------|-------------|
| **Browser** | `client/src/index.js` | `ReactDOM.render(<App />, …)`. |
| **React app** | `client/src/App.js` | `BrowserRouter`, `NavBarContainer`, `Switch` over `routes` from `router/index.ts`. |
| **Node server** | `server/server.js` | Express app, HTTP server `listen`, `require('./js/sockets.js').init(server)`. |

## What happens when the app starts

### Production / single-server mode

1. Node runs `server/server.js`.  
2. Express serves **static files** from `client/build/`.  
3. HTTP server is shared with **Socket.IO** (`sockets.init`).  
4. **`sockets.js`** connects an **MQTT** client (local broker unless `HEROKU` or other config applies).  
5. On MQTT `connect`, the server **subscribes** to DAS, boost, camera, status, wireless module, V4, etc. (see `mqttClient.subscribe(...)` in `sockets.js`).  
6. User requests `https://host/` → Express serves `index.html` → React loads → client Socket.IO connects to the **same host**.

### Local development (two processes)

1. **Port 5000:** Same as above, but you often skip serving a fresh `client/build` if you only use the dev client.  
2. **Port 3000:** CRA dev server serves the SPA; **`setupProxy.js`** forwards `/files`, `/server/status`, and `/socket.io` to **5000**.  
3. Browser tab origin is **3000**; API and WebSocket traffic still hit the Node app.

## Example flows

### A) Open the home page

1. User navigates to `/`.  
2. **`HomeView`** immediately **redirects** to `/v4`.  
3. Router renders **`DashboardView`** for `/v4/` (see `router/v4.ts`).  
4. Dashboard pulls in child components (recording control, stats row, chart, map).

### B) List and download log files

1. User opens **Logs** (`/v4/logs`, `/v3/logs`, or V2’s download path).  
2. **`LogsView`** calls **`getFiles()`** in `api/common/files.ts` → `fetch('/files')`.  
3. Proxy (dev) or Express (prod) handles **`GET /files`** → reads `server/data/` → returns `{ files: [...] }`.  
4. Download links point to **`/files/:filename`** or **`/files/recent`**.

### C) Live telemetry (MQTT → UI)

**Simplified pipeline:**

1. A device publishes to an MQTT topic (names come from **`mhp`** constants).  
2. **`server/js/sockets.js`** `mqttClient.on('message', …)` runs.  
3. Code parses **topic + payload** and may update **in-memory retained** objects (`retained`, `retainedv4`, …).  
4. Server calls **`socket.emit('<channel>', payload)`** for connected browsers.  
5. React code uses **`useChannel` / `useChannelShaped`** (`api/common/socket.ts`) or higher hooks in **`api/common/data.ts`** to update component state.

**Concrete client hook chain:** Component → `useModuleDataCallback` / status hooks → `useChannelShaped` → Socket.IO listener.

### D) Start / stop recording (conceptual)

1. UI button calls something like **`emit(...)`** or a helper that publishes/requests via Socket.IO (implementation varies by version; V4 uses `api/common/data` `startV4` / `stopV4` and related callbacks).  
2. Server-side **`socket.on(...)`** handlers in `sockets.js` may **publish** to MQTT or relay state so hardware/DAS reacts.  
3. Confirmation often comes back as **MQTT messages** that re-hit the bridge and emit to the UI.

For which UI maps to which files, see [06_feature_mapping.md](./06_feature_mapping.md).

## Catch-all SPA route

After API routes, **`server.js`** registers `app.get('*', …)` to send `client/build/index.html`. That makes client-side routes work when users deep-link or refresh — as long as the request is not matched by `/files` or `/server/status` first.
