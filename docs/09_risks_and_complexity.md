# Risks and complexity (light touch)

Use this as a **practical “look twice” list**, not a code-quality audit.

## Complex areas

### `server/js/sockets.js`

- **Large, branching logic** — one MQTT `message` handler dispatches on topic prefixes and exact topic matches.  
- **Side effects** — registers `mqttClient.on('message', …)` **inside** each Socket.IO connection handler (unusual pattern; worth reading before changing).  
- **Multiple retained-state bags** — `retained`, `retainedv4`, boost fields, etc. Easy to fix one path and break **late joiners** who rely on `get-*` socket handlers.

**Caution:** Small edits can cause **duplicate listeners**, **missed topics**, or **wrong emit channel names** that are hard to spot without MQTT traffic.

### Version duplication (`v2` / `v3` / `v4`)

- Features that look “the same” (dashboard, status) are **implemented separately**.  
- A fix in **V4** does **not** automatically apply to **V3** or **V2**.

**Caution:** Confirm **which versions** your stakeholders care about before assuming one PR covers all bikes.

### Private `mhp` package

- Topic strings and constants are **external** to this repo.  
- Mismatch between **`mhp` version** and firmware is a common source of “nothing updates” bugs.

**Caution:** Coordinate dependency bumps with whoever owns **`common`**.

## Tightly coupled spots

| Area | Coupling |
|------|-----------|
| MQTT topic layout ↔ `sockets.js` | Topic shape changes require server updates (and often client channel names). |
| Socket.IO event names ↔ `api/common/*.ts` | Renaming emits without updating hooks breaks UI silently. |
| Express static path ↔ `client/build` | Production assumes build output location; moving folders breaks deploy scripts. |

## When modifying safely vs carefully

- **Relatively localized:** A new **presentational** component under `components/v4` if you only change one view; **Storybook** stories; **CSS modules** next to a single screen.  
- **Use extra care:** Anything in **`sockets.js`**, new **MQTT** subscriptions, changes to **`mhp`** imports, or **shared** `views/common` / `api/common` used by multiple versions.

If you must touch the bridge, **test with a real or mocked MQTT publisher** and one browser tab on the target route.
