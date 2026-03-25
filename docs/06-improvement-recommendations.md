# Improvement recommendations

Grounded in the current repository state (`server/js/sockets.js`, `server/server.js`, `client/` layout, CI workflows).

## Architectural

1. **Isolate MQTT from Socket.IO connection lifecycle**  
   Today, `mqttClient.on('message', …)` is registered inside each Socket.IO `connection` handler. That multiplies MQTT handlers per connected user and duplicates work. Register **one** global MQTT listener that updates shared state and broadcasts to Socket.IO namespaces or `io.emit`.

2. **Explicit channel contract**  
   Document or generate Socket.IO event names from the same source as MQTT topics (the `mhp` package). Reduces drift like `boost-running` vs `boost_running` and the V3 `emit` formatting bug.

3. **API layer consistency**  
   Either implement `client/src/api/v3` and `v4` modules or collapse documentation to “common + components” so new contributors are not misled.

## Performance

1. **MQTT → socket fan-out**  
   After consolidating handlers, measure CPU with multiple clients; consider binary payloads or throttled updates for high-rate `DAS.data` if needed (not measured in-repo).

2. **`getFiles` implementation**  
   Uses `fs.statSync` inside `map`—blocking. For large `data/` directories, switch to async stat or cache listing.

## Scalability

1. **Single Node process**  
   Architecture assumes one server instance with in-memory `retained` state. Horizontal scaling (multiple Azure instances) would require shared state (Redis) or sticky sessions + MQTT shard—out of scope today but a ceiling for growth.

2. **Public MQTT bridge**  
   `publish-data-on` connects an extra broker; document rate limits and failure modes for long rides.

## Code quality

1. **Gradual TypeScript migration for V2**  
   Router workarounds (`as unknown as React.Component`) hide type errors; migrating views removes tech debt.

2. **Tests**  
   No unit/integration tests in tree; highest ROI: `util.js`, REST handlers, and one MQTT→emit golden path.

3. **Dependency hygiene**  
   Remove redundant npm `path` package if possible; audit `mhp` git dependency for lockfile reproducibility.

4. **Security**  
   No authentication on `/files` or Socket.IO in reviewed code—acceptable only on trusted networks; if dashboard is internet-exposed, add authn/z and TLS termination review.
