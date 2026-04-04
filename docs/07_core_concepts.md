# Core concepts

## Domain ideas

### DAS (Data Acquisition System)

The **DAS** is the recording stack on the bike. The dashboard is its **operator UI**: start/stop recording, watch sensors, pull logs. Topic constants like **`DAS.start`**, **`DAS.stop`**, **`DAS.data`** (from `mhp`) label MQTT traffic the server subscribes to.

### Bike versions (V2 / V3 / V4)

The team supports **multiple hardware generations**:

- **V2 — Wombat** — older UI (mostly `.js` files), extra **power model** pages.  
- **V3 — Bilby** — TypeScript dashboard + status + shared logs/boost/camera.  
- **V4** — current default landing; similar surface to V3 with V4-specific components and MQTT paths.

Routes live under **`/v2`**, **`/v3`**, **`/v4`**. Code is **duplicated by version folder** (`components/v3` vs `components/v4`) so each generation can evolve without breaking the others.

### MQTT topics

**MQTT** is a lightweight pub/sub protocol. Devices **publish** messages on **topics** (hierarchical strings). The Node server **subscribes** to those topics and **translates** them into Socket.IO events the React app understands.

**Mental model:** MQTT is the **raw radio**; Socket.IO is the **headline news** read to the browser.

### Socket.IO channels

The browser opens **one** Socket.IO connection (`api/common/socket.ts`: `io()`). The server **emits** on **channel names** such as:

- `data` — V2-style query-string payloads on `DAS.data`.  
- `status-<component>-<subcomponent>` — derived from `status/...` MQTT topics.  
- `wireless_module-<id>-<property>` — V3 wireless modules.  
- `V4-sensors-<property>` — V4 sensor stream.  
- `camera-<device>-<property>` — camera subsystem.  
- Various **boost**-related channels matching `BOOST.*` constants.

Hooks like **`useChannelShaped`** validate payloads with **Runtypes** before your callback runs.

### Log files

Runs produce files on the server under **`server/data/`**. The REST API exposes them as **`/files`**. This is **separate** from MQTT: logs are **HTTP download** territory.

### Boost

**Boost** refers to tooling around **performance prediction / optimization** (speed targets, configs, results). MQTT topics under **`BOOST`** (from `mhp`) feed UI state; Socket.IO events like `boost/configs` and `boost/generate_complete` appear in `sockets.js`.

### Camera

**Camera** topics (and a server-side patch `Camera["base"] = "camera"`) drive recording/overlay status. The UI uses shared **camera** views under `views/common` and `components/common/camera_settings`.

---

## Important patterns

### Container / presentation (partial)

Many status screens use **`*Container.tsx`** components that wire data hooks and pass props to presentational children (e.g. `WMStatusContainer` → `WMStatus`).

### Runtypes at the boundary

**Runtypes** describe expected JSON shapes for MQTT-derived payloads. Parsing failures are **logged** and dropped rather than crashing the UI (`useChannelShaped`).

### Retained state on the server

`sockets.js` keeps objects like **`retained`** / **`retainedv4`** so when a browser connects late, the server can answer **`socket.on('get-...')`** requests with the last known values (pattern used for status paths and boost payloads).

### Versioned API folders

`client/src/api/v2`, `v3`, `v4` hold **bike-specific** client logic; **`api/common`** holds shared REST + socket utilities.

---

## External dependency: `mhp`

The npm package **`mhp`** points at the org’s **`common`** repository. It exports **topic strings** and small domain constants the server and client rely on.

**If topics change upstream**, this dashboard and field software must stay **in sync**, or messages will look like “garbage” on the client or “Unhandled topic” in server logs.
