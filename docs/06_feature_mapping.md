# Feature mapping

This ties **user-visible features** to **where they live in code**. Paths are under `client/src/` unless noted.

## Cross-version features

### Home / default route

| Item | Location | Notes |
|------|-----------|--------|
| Redirect `/` → `/v4` | `views/HomeView.js` | Single responsibility: default version choice. |

### Navigation

| Item | Location | Notes |
|------|-----------|--------|
| Top nav, version switch | `components/common/navbar/NavBar.tsx`, `NavBarContainer.tsx` | Uses `bikeVersions` and `useBikeVersion()` from `router/index.ts`. |

### Log files (list, download, delete)

| Item | Location | Notes |
|------|-----------|--------|
| Page | `views/common/LogsView.tsx` | Shared across V3/V4; V2 uses same view on a different path. |
| REST client | `api/common/files.ts` | `getFiles`, `deleteFile`, hooks `useFiles`, `useLatestFile`. |
| UI list / modals | `components/common/download_files/*` | List + delete confirmation. |
| Server API | `server/server.js` | `GET/DELETE /files`, `GET /files/recent`, `GET /files/:filename`. |

### Boost

| Item | Location | Notes |
|------|-----------|--------|
| Page | `views/common/BoostView.tsx` | Routed from V3 and V4. |
| API helpers | `api/common/boost.ts` | Socket / data integration for boost flows. |
| Config UI | `components/common/boost/BoostConfigurator.tsx` | Form-style configuration. |

### Camera system

| Item | Location | Notes |
|------|-----------|--------|
| Page | `views/common/CameraSystemView.tsx` | V2/V3/V4 routes. |
| Settings / status widgets | `components/common/camera_settings/*` | Shared camera UI pieces. |
| Real-time bridge | `server/js/sockets.js` | `Camera` topics, `camera-...` Socket.IO channels. |

---

## V4 (`/v4/...`)

| Feature | Route(s) | View | Typical components / API |
|---------|-----------|------|---------------------------|
| Dashboard | `/v4/` | `views/v4/DashboardView.tsx` | `components/v4/DASRecording`, `StatisticRow`, `V4SpeedDistanceChart`, `V4LocationMap` |
| Status | `/v4/status` | `views/v4/StatusView.tsx` | `components/v4/status/*` (camera, WM, anemometer containers) |
| Logs | `/v4/logs` | `views/common/LogsView.tsx` | `api/common/files.ts` |
| Boost | `/v4/boost` | `views/common/BoostView.tsx` | `api/common/boost.ts` |
| Camera | `/v4/camera-system` | `views/common/CameraSystemView.tsx` | `components/common/camera_settings/*` |

**Router definition:** `router/v4.ts`.

---

## V3 (`/v3/...`)

| Feature | Route(s) | View | Notes |
|---------|-----------|------|--------|
| Dashboard | `/v3/` | `views/v3/DashboardView.tsx` | Parallel structure to V4 under `components/v3/`. |
| Status | `/v3/status` | `views/v3/StatusView.tsx` | V3 status components. |
| Logs | `/v3/logs` | `views/common/LogsView.tsx` | Same as V4. |
| Boost | `/v3/boost` | `views/common/BoostView.tsx` | Same as V4. |
| Camera | `/v3/camera-system` | `views/common/CameraSystemView.tsx` | Same as V4. |

**Router definition:** `router/v3.ts`.

---

## V2 (`/v2/...`)

| Feature | Route(s) | View | Notes |
|---------|-----------|------|--------|
| Dashboard | `/v2/` | `views/v2/DashboardView.js` | Legacy JS implementation. |
| Files | `/v2/download-files` | `views/common/LogsView.tsx` | Labeled “Files” in router. |
| Sensors | `/v2/status` | `views/v2/SensorStatusView.js` | V2-specific status UX. |
| Power model | `/v2/power-model` | `views/v2/PowerModelView.js` | Not present on V3/V4 routes. |
| Power map | `/v2/power-zone` | `views/v2/PowerMapView.js` | |
| Calibration | `/v2/power-calibration` | `views/v2/PowerModelCalibrationView.js` | |
| Camera | `/v2/camera` | `views/common/CameraSystemView.tsx` | |
| Options | `/v2/options` | `views/v2/OptionsView.js` | |

**Router definition:** `router/v2.ts`.  
**API:** `api/v2/*` for V2-only client helpers.

---

## Server-side “features”

| Feature | Location |
|---------|-----------|
| Health check for edge scripts | `GET /server/status` in `server/server.js` |
| Log storage | `server/data/` + `/files` routes |
| Real-time hub | `server/js/sockets.js` (MQTT + Socket.IO) |

---

## How features connect (summary)

- **Screens** are chosen by **`router/v*.ts`** and rendered inside **`App.js`**.  
- **HTTP** features use **`fetch`** to Express (`api/common/files.ts`).  
- **Live** features use **`api/common/socket.ts`** plus domain hooks (`api/common/data.ts`, version folders).  
- **Topic names** align with **`mhp`** so firmware and dashboard speak the same “words.”

For vocabulary (DAS, MQTT, channels), see [07_core_concepts.md](./07_core_concepts.md).
