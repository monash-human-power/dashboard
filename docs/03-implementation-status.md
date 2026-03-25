# Current implementation status

## Fully implemented and working (by inspection)

- **Production build serving:** Express serves `client/build` and SPA fallback (`server/server.js`).
- **File API:** List, download, delete, recent file (`getFiles` sorting by mtime).
- **Health:** `/server/status` returns `{ status: 'True' }`.
- **Socket.IO + MQTT bridge:** Large surface implemented in `server/js/sockets.js` (subscriptions, emits, client command handlers).
- **React app:** Routed views for V2, V3, V4; shared Boost, camera, logs; charts and maps for multiple versions.
- **Development proxy:** `setupProxy.js` routes API and WebSocket to port 5000.
- **Lint CI:** PR workflow runs eslint in `client` and `server`.
- **Deploy pipeline:** Master branch builds client, installs server deps, deploys to Azure (`deploy_to_azure.yaml`).
- **Storybook:** Scripts present for component development.

## Partially implemented / placeholders

- **`client/src/api/v3` and `client/src/api/v4`:** Only `README.md` files—no version-specific API modules; V3/V4 rely on **`api/common`** and components instead.
- **Root `README.md` TODO list** still lists “Add Map display”, “power model graph”, “Options page”—those features **exist in V2** in code; the root TODO is **stale**, not authoritative.
- **Heroku vs Azure:** Root README references Heroku URL and review apps; workflows target **Azure** `DashMHP`. Deployment story is **inconsistent** in documentation.
- **`retainedv4` in `sockets.js`:** Declared but the primary handling path uses `retained` for V4-relevant emissions in the shown branches—worth verifying full V4 parity with V3 retained state (needs deeper pass).

## Bugs and risky code (evidence-based)

1. **V3 start broadcast channel names (critical):** In `server/js/sockets.js`, `V3.start` handler uses:
   ```javascript
   socket.emit(`
     ${id}-start`, true)
   ```
   The template literal includes **newline and spaces** inside the event name. Clients listen for `wireless_module-${id}-start` (see `data.ts` / wireless module flows). This is very likely a **broken emit** until fixed to `socket.emit(\`wireless_module-${id}-start\`, true)` (or the intended channel name).

2. **Boost event naming inconsistency:** `BOOST.prev_trap_speed` emits `'boost_running'` while other cases use `'boost-running'` (`sockets.js`). Any UI listening for a single spelling may miss updates.

3. **`fs.unlink` callback in DELETE /files:** In `server/server.js`, on success the handler may still try to send after `res.status(200).send()` in some Node versions—classic **double-send** pattern if `unlink` error path vs success not structured with `return` (review `fs.unlink` callback).

4. **`getFiles` / recent file logic:** `getFiles` sorts by mtime descending; `/files/recent` then loops to find “latest” again—redundant and `/files/recent` uses async stat in a way that could be simplified (not necessarily wrong).

## TODOs in source (grep)

| Location | Text |
|----------|------|
| `server/js/sockets.js` | Move `Camera["base"]` into `mhp` topics.yml; remove legacy `get-status-payload`; “Fix up below socket.io handlers”; FIXME on `BOOST.predicted_max_speed` |
| `client/.../BoostConfigurator.tsx` | Add real component docs |
| `client/.../StatisticRow.tsx` (v3/v4) | Multiple sensor data |

## Missing pieces

- **Automated tests:** No `*.test.*` or `__tests__` hits under `client/src`; `yarn test` exists but there is no evidence of written tests in the tree searched.
- **Server runtime tests:** `server/package.json` `"test"` runs eslint only.
- **Environment documentation drift:** `HEROKU` branch in `sockets.js` vs Azure deploy; public MQTT env vars commented vs hardcoded `mqtt://localhost` in `connectToPublicMQTTBroker`.

## Technical debt / practices (visible)

- **Single giant `socket.on('message')` inside each connection** in `sockets.js`—registers duplicate MQTT listeners per browser connection (potential **listener leak** and duplicate processing unless `mqttClient` is shared and handler is registered once—here the handler is **per connection**, which is a serious scalability/correctness smell).
- **Mixed JS/TS** and forced casts for V2 views in router (`as unknown as React.Component`).
- **Node 14** and old CRA 3.x / React 16—security and maintenance backlog.
- **Dependency on private git SSH** for `mhp` complicates installs (documented in CI via SSH agent).
