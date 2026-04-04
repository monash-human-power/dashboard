# How to start contributing

## Day 0 checklist

1. Get **SSH access** to the private **`mhp`** (`common`) repo — otherwise `server` install fails.  
2. Follow [02_setup_and_run.md](./02_setup_and_run.md) until **V4 dashboard** loads.  
3. Skim [06_feature_mapping.md](./06_feature_mapping.md) so you know **which folder matches your ticket**.

## Suggested reading order (code files)

After the docs in [00_reading_guide.md](./00_reading_guide.md), open code in this order:

1. **`client/src/router/index.ts`** — how routes assemble; default version.  
2. **`client/src/router/v4.ts`** — smallest “current” route table.  
3. **`client/src/App.js`** — where routes render.  
4. **`client/src/views/v4/DashboardView.tsx`** — one screen end-to-end.  
5. **`client/src/api/common/socket.ts`** and **`api/common/data.ts`** — how live data enters React.  
6. **`server/server.js`** — HTTP surface and static hosting.  
7. **`server/js/sockets.js`** (first ~200 lines, then MQTT handler) — only when you work on telemetry.

## First small tasks to try

Pick tasks that **do not need MQTT** until you are comfortable:

- **UI copy or layout** on a single V4 component (e.g. spacing in `DashboardView.module.css`).  
- **Storybook:** run stories for a `components/v4` widget and adjust props/visuals.  
- **Logs page:** improve empty-state messaging in `LogsView` or `LogFileList` when `files` is empty.  
- **Types:** tighten a Runtype in `types/data.ts` if you are fixing a known payload shape (pair with hardware logs).  
- **Nav:** add or reorder a link in `NavBar` for V4 only (confirm with team).

## Safe-ish areas for beginners

| Area | Why it is safer |
|------|------------------|
| **CSS modules** next to one view | Visual change, easy to review. |
| **New Storybook story** | No runtime wiring. |
| **Docs in `docs/`** | You found this — keep them accurate. |
| **Pure `utils/` functions** | No MQTT; add tests if you introduce logic. |

## Areas to defer until you understand the bridge

- **`server/js/sockets.js`** — easy to break all live pages.  
- **Shared `api/common` hooks** — used by multiple versions.  
- **Bumping `mhp`** — coordinate with firmware/backend owners.

## Git / PR hygiene (brief)

- Run **`yarn lint`** in **client** and **server** before pushing (matches CI).  
- State **which bike version** you manually tested (**V2 / V3 / V4**).  
- If you change MQTT or Socket.IO behavior, describe **how you verified** (broker tool, hardware, or mock).

Welcome aboard — the fastest way to learn is **one vertical slice** (e.g. “V4 status page”) from **router → view → api → sockets topic**.
