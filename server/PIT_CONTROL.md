# T2 pit control — phone integration contract

The dashboard toolbar remains visible while scrolling and in the expanded map.
Expand/close keeps the same Leaflet map instance and its track/checkpoints.
The crew can request/cancel, start a pit, and mark completion. The phone can do
the same and explicitly acknowledge a crew request. Cancelling is allowed only
while preparing; once pitting, use completion. Labels accompany every colour.

## Shared state

- Green: `idle`, `cancelled`, or `completed`.
- Yellow: `preparing`.
- Red: `pitting`.
- Phone acknowledgement is separate from broker delivery acknowledgement.
- Use one authoritative dashboard backend for the shared race. All crew browsers
  connect to that backend. It validates commands, stores the official state, and
  publishes updates. MQTT topic permissions should separate command publishers
  from the backend's state publisher when deployed.

## MQTT for Manny's phone

Subscribe to `t2/<sessionId>/pit/state` at QoS 1. This is retained, so the phone
receives the current state after reconnecting. Read its `version` before sending
an action. Topic session ID and payload session ID must match.

Publish to `t2/<sessionId>/pit/command` at QoS 1 with **retain false**:

```json
{
  "sessionId": "mock-session-001",
  "commandId": "phone-unique-id-123",
  "action": "request",
  "expectedVersion": 0,
  "timestamp": "2026-10-09T10:00:00.000Z"
}
```

Use the current UTC timestamp, a new command ID per action, and the last observed
version. Retries reuse their original command ID. Commands older than 60 seconds,
more than 15 seconds in the future, mismatched session IDs, retained commands,
and stale versions are rejected. Keep phone/backend clocks synchronized.
Observe the resulting state before enabling another action.

Actions:

| Action | Allowed state | Result |
| --- | --- | --- |
| `request` | idle/cancelled/completed | preparing |
| `cancel` | preparing | cancelled |
| `acknowledge` | preparing; phone only | preparing; acknowledgedAt set |
| `start` | preparing | pitting |
| `complete` | pitting | completed |

For the phone's single request button: tap in green to request; tap again while
yellow to cancel. Use explicit Start pit/Pit complete controls for later stages.
A crew-originated yellow state should show the request on the phone, with a
separate acknowledgement control. No automatic GPS detection is implemented.

State includes `sessionId`, `state`, `version`, `requestedBy`, `acknowledgedAt`,
`timestamp`, `commandId`, `action`, and `source`. `source` and `requestedBy` are
`crew` or `rider`. The backend assigns source from the transport, not the payload.
Initial idle state has version 0 and no timestamp/command metadata.

## Dashboard and persistence

- `GET /api/t2/sessions/:sessionId/pit`: pitStatus, pitEvents, mqttConnected.
- `POST /api/t2/sessions/:sessionId/pit/commands`: same command JSON; source crew.
  Returns applied state, mqttConnected and deliveryError (null on broker ACK).
  A delivery error after persistence means the state changed but MQTT delivery
  was not confirmed. Do not resend as a new action; check current status first.
- Socket.IO `t2-pit-state` broadcasts state changes; `t2-pit-connection` reports
  broker connectivity. The UI disables actions while disconnected or in history.
- Sidecar `session-<id>_<hash>.jsonl.pit.jsonl` stores each event with UTC time.
  Keep it alongside telemetry, riders and checkpoint files in backups.
- REST snapshots include pitStatus and pitEvents. Saved views remain read-only
  and frozen until Reload session. Go to live fetches current status.
- On broker reconnect, the backend republishes current state, never old actions.

Restart the backend for these new subscriptions/routes. Restart the frontend if
needed. Test `node tests/pit-control.test.js`; it uses an isolated fake broker and
does not send commands to a real phone or the cloud broker.
