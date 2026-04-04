# Codebase structure

This is a **map of the repository**, not a file-by-file inventory. Use it to guess *where to look* before you search.

## Top level

| Path | Role |
|------|------|
| **`client/`** | React SPA — all UI, client-side API helpers, types. |
| **`server/`** | Node server — Express, Socket.IO, MQTT, log file storage. |
| **`docs/`** | Onboarding and engineering notes (this folder). |
| **`.github/workflows/`** | CI: ESLint on PRs; Azure deploy on `master`. |
| **`package.json` (root)** | Convenience scripts (`client-start`, `server-start`, `build`, `start`) and engine hints. |

## Client (`client/`)

| Path | Responsibility |
|------|----------------|
| **`src/index.js`** | React entry; mounts `App`. |
| **`src/App.js`** | Router + layout (navbar, page container). |
| **`src/router/`** | **`index.ts`** — merges home + V2/V3/V4 routes, exports `bikeVersions`, `useBikeVersion`. **`v2.ts` / `v3.ts` / `v4.ts`** — per-version path → view mapping. |
| **`src/views/`** | **Pages** — one default export per screen. Subfolders **`v2/`**, **`v3/`**, **`v4/`** hold version-specific screens; **`common/`** holds shared screens (logs, boost, camera). |
| **`src/components/`** | **Reusable pieces** — same split: `v2`, `v3`, `v4`, `common` (navbar, modals, charts, status tiles, …). |
| **`src/api/`** | **Data access** — `common/` for shared REST + Socket.IO; **`v2/` / `v3/` / `v4/`** for bike-specific helpers (see small READMEs in each). |
| **`src/types/`** | TypeScript types for routes, sensors, charts, boost, camera, etc. |
| **`src/utils/`** | Pure helpers (time series, strings, boost math, …). |
| **`public/`** | Static assets for CRA. |
| **`config-overrides.js`** | `react-app-rewired` tweaks (if present). |
| **`test_jsons/`** | Sample JSON for local/manual testing of config bundles. |

### Grouping by feature (mental model)

| Feature | Likely locations |
|---------|------------------|
| **Routing / “which URL shows what”** | `router/*.ts`, `views/*` |
| **Dashboard charts & map** | `views/v*/DashboardView*`, `components/v*/dashboard/*`, `api/v*/*` |
| **Device status** | `views/v*/StatusView*`, `components/v*/status/*` |
| **Log files** | `views/common/LogsView.tsx`, `api/common/files.ts`, `components/common/download_files/*` |
| **Boost** | `views/common/BoostView.tsx`, `api/common/boost.ts`, `components/common/boost/*` |
| **Camera** | `views/common/CameraSystemView.tsx`, `components/common/camera_settings/*`, server `sockets.js` camera topics |
| **Live socket plumbing** | `api/common/socket.ts`, `api/common/data.ts`, `server/js/sockets.js` |
| **Navigation** | `components/common/navbar/*`, `NavBarContainer.tsx` |

## Server (`server/`)

| Path | Responsibility |
|------|----------------|
| **`server.js`** | Express setup, `/files` CRUD-ish API, `/server/status`, static SPA, `http.Server` → `sockets.init`. |
| **`js/sockets.js`** | MQTT + Socket.IO bridge; large topic switch / emit logic. |
| **`js/util.js`** | Helpers (e.g. nested object get/set by path) used when parsing MQTT topics. |
| **`data/`** | Stored log files served via `/files` (auto-created if missing). |
| **`service/`** | systemd unit + install script for running the server as a Linux service (see `service/README.md`). |
| **`examples/`** | Python Pipenv example for talking to the system (not required for Node dashboard). |
| **`Pipfile`** | Optional Python tooling (e.g. `paho-mqtt`). |
| **`logger.py`** | Standalone logging utility (separate from Express). |

## How version folders relate

- **`v4`** is the **default** user path (`/` redirects to `/v4`).  
- **`v3`** mirrors many V4 concepts (dashboard, status, logs, boost, camera) with V3-specific components.  
- **`v2`** is the **older** UI set (JavaScript views, extra power-model screens).

When you add a feature, decide **which bike versions** need it, then touch the matching `router/v*.ts` + `views/` + `components/` + optionally `api/v*`.
