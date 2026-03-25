# Project overview

## What the project does

This repository is a **web dashboard and API** for Monash Human Power’s **Data Acquisition System (DAS)**. It serves a React single-page application, exposes REST endpoints for log files and health checks, and bridges **MQTT** telemetry to browser clients via **Socket.IO** using topic constants from the private **`mhp`** npm package (`monash-human-power/common`).

Evidence: `server/package.json` description; `server/server.js` (Express + static `client/build`); `server/js/sockets.js` (MQTT + Socket.IO).

## Core problem it solves

- **Live visibility** into bike/sensor data during runs (charts, maps, status) without bespoke desktop tooling.
- **Unified control plane** for recording (DAS / wireless modules / V3/V4 start-stop), camera overlays/recording, and **Boost** (power/optimization workflows) by publishing commands over MQTT from the browser.
- **Log file management**: list, download, delete CSV logs stored under `server/data/`, and a **`/server/status`** endpoint so edge devices (e.g. Raspberry Pi scripts) can poll until the server is up (`server.js` comment references `DAS.py`).

## Key features (from code)

| Area | What exists |
|------|-------------|
| **Multi-bike UI** | Routes for **V2 (Wombat)**, **V3 (Bilby)**, **V4 (TBD)** under `/v2`, `/v3`, `/v4`; home redirects to `/v4` (`client/src/views/HomeView.js`, `client/src/router/index.ts`). |
| **V2** | Dashboard with velocity/power/cadence charts, text mode, location map; power model, power map, calibration; sensor status; camera; options; file downloads (`client/src/router/v2.ts`). |
| **V3 / V4** | Dashboard (speed/distance chart, map, DAS recording UI, statistics); status views; shared Boost and camera views; logs (`client/src/router/v3.ts`, `v4.ts`). |
| **Real-time transport** | Socket.IO client singleton + `useChannel` / `useChannelShaped` (`client/src/api/common/socket.ts`); server subscribes to MQTT topics and emits to sockets (`server/js/sockets.js`). |
| **REST** | `GET/DELETE /files...`, `GET /server/status`, SPA fallback (`server/server.js`). |
| **Dev proxy** | CRA dev server proxies `/files`, `/server/status`, `/socket.io` to port 5000 (`client/src/setupProxy.js`). |
| **Component docs** | Storybook configured (`client/package.json` scripts; `.storybook/`). |
| **CI/CD** | Lint on PR; deploy client+server to Azure Web App on `master` (`.github/workflows/`). |

## Target users (inferred)

- **Team operators / engineers** running human-powered vehicle experiments who need live plots and recording controls.
- **Embedded/edge maintainers** integrating with MQTT and the file API (e.g. Pi + `DAS.py`-style clients).
- **Developers** extending version-specific dashboards (V2–V4) and shared components.

No end-user marketing copy exists in-repo; inference is from naming (MHP, DAS, bike versions) and deployment targets.
