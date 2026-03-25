# Product backlog

Priorities assume production use on rides and Azure-hosted dashboard reliability.

---

## Core features

| Title | Description | Priority | Effort | Dependencies |
|-------|-------------|----------|--------|----------------|
| Fix V3 wireless-module start Socket.IO events | Correct `V3.start` handler in `server/js/sockets.js` so emitted channel names match client listeners (e.g. `wireless_module-{id}-start`), removing stray whitespace/newlines in event names. | High | Small | None |
| Register MQTT message handler once | Move `mqttClient.on('message', …)` out of per-socket `connection` scope so each MQTT message is processed once; fan-out to all `io` sockets from a single handler. | High | Medium | None |
| Align Boost UI events | Standardize `boost-running` vs `boost_running` emissions in `sockets.js` and verify listeners in Boost components. | High | Small | None |
| Fix DELETE /files double response | In `server/server.js`, return after error response in `fs.unlink` callback to avoid sending 404 then 200. | High | Small | None |

---

## Enhancements

| Title | Description | Priority | Effort | Dependencies |
|-------|-------------|----------|--------|----------------|
| Populate `api/v3` and `api/v4` or remove stubs | Either add real version-specific APIs or delete placeholder README-only dirs to reduce confusion. | Medium | Small | None |
| Refresh root README deployment table | Replace Heroku-centric URLs with current Azure workflow reality; link to `docs/`. | Medium | Small | None |
| V4 retained state parity | Audit `retainedv4` vs `retained` usage for V4 MQTT topics and document intended behavior. | Medium | Medium | MQTT topic docs in `mhp` |
| Options persistence (V2) | Root README still mentions options in browser storage—verify `OptionsView` and either implement persistence or remove from backlog/TODO. | Low | Medium | None |

---

## Technical improvements

| Title | Description | Priority | Effort | Dependencies |
|-------|-------------|----------|--------|----------------|
| Upgrade Node and CRA stack | Move from Node 14 / CRA 3 / React 16 toward supported LTS and modern tooling (or document intentional freeze). | Medium | Large | CI, Azure runtime |
| Resolve `mhp` install story for contributors | Document SSH key / token flow for private package; consider npm registry or vendored types for read-only contributors. | High | Medium | Org infra |
| Refactor `sockets.js` | Split MQTT routing, retained state, and Socket.IO facades into modules; address TODOs for Camera base topic and legacy `get-status-payload`. | Medium | Large | Tests or staging MQTT |
| Type-safe routers | Convert remaining V2 views to TS and remove `as unknown as React.Component` casts. | Low | Large | None |

---

## Testing and QA

| Title | Description | Priority | Effort | Dependencies |
|-------|-------------|----------|--------|----------------|
| Add CI test step | Minimal smoke: build client, start server with timeout, curl `/server/status`. | High | Medium | GitHub Actions |
| Unit tests for `util.js` | Test `getPropWithPath` / `setPropWithPath` edge cases. | Medium | Small | Jest on server or extract package |
| Socket.IO integration tests | Mock MQTT client; assert correct `socket.emit` channels for a sample topic payload. | Medium | Large | Test harness |
| Client tests for `useChannelShaped` | Ensure malformed payloads are handled without breaking hooks. | Low | Small | RTL |

---

## DevOps / deployment

| Title | Description | Priority | Effort | Dependencies |
|-------|-------------|----------|--------|----------------|
| Align linter workflow Node version | `linter.yml` uses Node 13.x; root engines and Azure use 14.x—standardize to one version. | Medium | Small | None |
| Document Azure secrets | SSH key for `mhp`, `AzureAppService_PublishProfile`—what repo settings are required for fork CI. | Medium | Small | None |
| Environment matrix | Single doc for local dev (MQTT broker, ports 3000/5000/1883), Heroku flag usage vs Azure production. | Medium | Small | None |
| Client systemd README | `client/service/README.md` references install flow—ensure `serve` path matches Pi deployment. | Low | Small | Hardware team |
