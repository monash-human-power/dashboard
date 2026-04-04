# Overview

## What this codebase does (simple terms)

This project is a **web dashboard** for **Monash Human Power**’s **Data Acquisition System (DAS)** — the software stack that records and displays data from their human-powered vehicles (bikes).

Think of it as a **control room in the browser**:

- Operators see **live sensor readings** (speed, GPS, weather modules, cameras, and more — depending on bike version).
- They can **start and stop recording**, work with **boost** (performance prediction tooling), manage **camera** settings, and **download log files** stored on the server.

## What problem it solves

During runs and tests, the team needs:

1. **Visibility** — real-time telemetry without SSH-ing into every device.  
2. **Control** — trigger recording and related workflows from a familiar UI.  
3. **Data handoff** — CSV (or similar) logs land on the server under `server/data/` and can be listed and downloaded from the app.  
4. **Reliability signals** — a tiny **health endpoint** lets edge scripts poll until the server is online.

## Who it is for

- **Engineers and operators** working with the DAS on the bike or in the lab.  
- **Developers** extending dashboards per bike generation (**V2 Wombat**, **V3 Bilby**, **V4**).

The UI is **versioned by bike platform** (`/v2`, `/v3`, `/v4`). New users land on **V4** by default.

## Key features (high level)

| Area | What you get |
|------|----------------|
| **Versioned dashboards** | Different routes and components for V2 / V3 / V4. |
| **Live telemetry** | Browser connects via **Socket.IO**; server bridges **MQTT** messages into UI events. |
| **Charts and maps** | Speed/distance charts, Leaflet maps (exact widgets vary by version). |
| **Logs / files** | REST API to list, download, and delete files in `server/data/`. |
| **Boost & camera** | Flows shared across versions where applicable (`views/common`, Socket.IO topics). |
| **V2-only extras** | Power model, power map, calibration, options — see V2 routes. |
| **Deployment** | Production build is served by Express; CI deploys to Azure (see root README). |

## Tech snapshot

- **Frontend:** React (CRA + `react-app-rewired`), TypeScript and JavaScript, React Router v5.  
- **Backend:** Node.js, Express, Socket.IO, MQTT client.  
- **Shared constants:** Private npm package **`mhp`** (topic names and domain constants from the org’s `common` repo).

For detail, see [03_architecture.md](./03_architecture.md).
