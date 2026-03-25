# Suggested 2-week sprint plan

**Theme:** Stabilize real-time behavior and production edge cases before feature work.

## Week 1 — Correctness and safety

| Days | Focus | Outcomes |
|------|-------|----------|
| 1–2 | **V3.start emit fix** + **DELETE /files** fix | Verified wireless module start behavior; no double HTTP responses on failed deletes. |
| 3–4 | **MQTT handler architecture** | One `message` listener on `mqttClient`; broadcast to `io.sockets` or room pattern; manual test with 2+ browser tabs. |
| 5 | **Boost event name alignment** | Grep client for `boost-running` / `boost_running`; pick one; update server and UI. |

**Why first:** The V3 emit bug and duplicate MQTT handlers directly affect live operation and scale; file delete bug affects data integrity UX.

## Week 2 — Quality and documentation

| Days | Focus | Outcomes |
|------|-------|----------|
| 6–7 | **CI smoke test** (build + `/server/status`) | Regression net for deploys. |
| 8 | **Node version alignment** in `linter.yml` | Same Node as production (14.x). |
| 9 | **README + deployment** | Root README matches Azure; link `docs/`; remove obsolete TODO bullets that contradict code. |
| 10 | **Tech debt triage** | Ticket for `sockets.js` split; confirm `retainedv4` plan with stakeholders. |

**Why this order:** After week 1 fixes, CI and docs reduce repeat incidents; defer large refactors until telemetry confirms stable behavior.

## Not in this sprint (explicitly)

- Full React/Node upgrade (large blast radius).
- Comprehensive Socket.IO integration tests (schedule after MQTT handler refactor).
