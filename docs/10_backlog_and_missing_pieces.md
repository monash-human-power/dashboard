# Backlog and missing pieces

High-level only — useful for **roadmaps**, not as a complete issue tracker.

## Features that appear incomplete or uneven

- **Automated tests:** Client Jest is configured but **no unit/integration tests** ship under `src`; server `yarn test` is **lint-only**.  
- **V4 naming:** Router labels V4 as **“TBD”** in `router/index.ts` — product naming may still be open.  
- **Multi-sensor rows:** `StatisticRow` in V3/V4 carries a **TODO** about supporting multiple sensor data streams.  
- **Boost / socket cleanup:** `sockets.js` contains **TODO/FIXME** comments about legacy handlers and unclear emits (e.g. around `predicted_max_speed`).  
- **Camera topic source:** Comment suggests moving `Camera["base"]` into **`mhp`’s topics.yml** instead of patching in `sockets.js`.

## Likely improvement themes (feature-level)

- **Consolidate real-time handling** — reduce duplication between V3 wireless module paths and V4 sensor paths where the domain allows.  
- **Toolchain modernization** — Node 14 / CRA 3 / older Socket.IO and MQTT are stable but dated; upgrading is a **project-level** task (affects deploy and CI).  
- **Test coverage for the bridge** — integration tests that spin up MQTT + server + a fake Socket.IO client would guard `sockets.js` regressions.  
- **Documentation in-repo** — this `docs/` set replaces ad-hoc reading; keep it updated when routes or env vars change.

## TODOs (summarized from code comments)

| Area | Hint from codebase |
|------|---------------------|
| `server/js/sockets.js` | Move camera base topic into `mhp`; refactor legacy `get-status-payload`; clarify/fix boost-related emits; tidy socket.io handlers. |
| `client/.../StatisticRow.tsx` | Support multiple sensor data (V3 and V4 copies). |
| `BoostConfigurator.tsx` | Add real component documentation. |

Search the repo for **`TODO`** / **`FIXME`** when you need the **full** list — comments will drift over time.

## Things this doc is not

- Not a substitute for **GitHub Issues** or team sprint plans.  
- Not an exhaustive security or dependency audit.
