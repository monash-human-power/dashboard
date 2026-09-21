# T2 telemetry history

The backend subscribes to `t2/+/telemetry` when MQTT connects, even if no browser
is open. One server-level handler saves each received message and broadcasts the
original payload on the existing Socket.IO event `t2-telemetry`.

## Storage and retention

- Default location: `server/telemetry-data/`, excluded from Git. This is separate
  from the legacy CSV download/delete endpoints under `/files`.
- Optional server environment variable: `TELEMETRY_DATA_DIR` (prefer an absolute
  path to a persistent disk).
- One append-only JSON Lines (`.jsonl`) file per session, named
  `session-<sessionId>_<12-character hash>.jsonl`. The prefix avoids Windows
  reserved names and the suffix separates IDs differing only in case.
  Older hash-only files are renamed automatically when listed, read or appended
  by the updated backend. Restart the backend before using the new naming scheme.
- Each saved record includes the complete original payload, publisher
  `timestamp` and `sessionId`, plus server `receivedAt` in UTC and MQTT `topic`.
- Sessions survive ordinary backend restarts. Reusing a session ID appends to
  that same session; use a new ID for a new ride/test.
- **No automatic expiry or maximum session count is enabled.** All sessions are
  retained until the team decides its retention policy. Back up this directory
  and monitor available disk space. On ephemeral hosting, use a persistent volume.
- This implementation is for one backend process writing to the directory.
  Reads scan files and are serialized with writes; large archives/high throughput
  should move to an indexed database.
- MQTT delivery is not exactly-once: repeated deliveries are recorded separately.
  Browser connections do not multiply records. Identical readings are legitimate,
  so timestamp/value-based deduplication is deliberately not applied.
- Storage errors are logged as `Failed to save T2 telemetry`; live broadcasting
  continues. A live reading is not a durability acknowledgement. There is no
  offline MQTT replay or automatic repair of corrupted files. Power-loss durability
  and multi-process writes are outside this implementation's guarantees.

## Accepted message

Publish JSON to `t2/<sessionId>/telemetry`:

```json
{
  "type": "telemetry",
  "timestamp": "2026-09-21T01:00:00.000Z",
  "sessionId": "test-session-001",
  "data": {
    "speed": { "value": 25, "unit": "km/h" },
    "power": { "value": 300, "unit": "W" },
    "cadence": { "value": 91, "unit": "rpm" },
    "batteryVoltage": { "value": 48.2, "unit": "V" },
    "gps": { "latitude": -37.9105, "longitude": 145.1362, "altitude": 35.2, "speed": 25 }
  }
}
```

The topic and payload session IDs must match. IDs contain 1–128 ASCII letters,
digits, dots, hyphens or underscores, starting with a letter/digit. Timestamps
must include a timezone. All listed sensor readings and GPS numeric fields are
required, and zero values are valid. Extra payload fields are preserved.
Invalid messages and payloads above 1 MiB are rejected and logged. Publisher
timestamps are preserved, not replaced: ensure the publisher uses a real UTC
timestamp rather than a hard-coded date/local time labelled `Z`.

## REST API

The T2 dashboard includes a **Saved sessions** dropdown. Opening it refreshes
the archive list; choosing a session downloads its complete JSON Lines file via
`GET /api/t2/sessions/:sessionId/file`. Active sessions include data saved so far;
download again later to get additional readings. This does not stop recording.

Base URL for the local backend: `http://localhost:5000/api/t2`.

### List sessions

`GET /api/t2/sessions?offset=0&limit=100`

```json
{
  "sessions": [{
    "sessionId": "test-session-001",
    "count": 1,
    "firstTimestamp": "2026-09-21T01:00:00.000Z",
    "lastTimestamp": "2026-09-21T01:00:00.000Z",
    "firstReceivedAt": "2026-09-21T01:00:00.100Z",
    "lastReceivedAt": "2026-09-21T01:00:00.100Z"
  }],
  "total": 1,
  "offset": 0,
  "limit": 100
}
```

Sessions are ordered by most recent receipt, newest first. First/last publisher
timestamps are the minimum/maximum event times, including out-of-order messages.
Session-list pagination can shift while sessions are actively receiving data.

### Read a session

`GET /api/t2/sessions/test-session-001/telemetry?offset=0&limit=100`

Returns `{ sessionId, telemetry, total, offset, limit, nextOffset }`. Each entry
in `telemetry` is the original payload plus `topic` and `receivedAt`. Records
are in receipt order (append order), not sorted by publisher timestamps.
Use `nextOffset` for the next page; `null` means there were no more records at
query time. An active session can acquire more records later.

Both endpoints default to `offset=0&limit=100`; the maximum limit is 1000.
An offset past the end returns an empty page. Responses are JSON, including
errors: `400` for invalid IDs/pagination, `404` for unknown sessions/endpoints,
and `500` for storage/read failures. Do not poll history for live readings;
continue using `t2-telemetry` for those.

For the frontend development server on port 3000, a `/api/t2` proxy to port 5000
will be needed before using relative API URLs. No frontend files were changed
in this backend implementation. Opening the above backend URLs directly works.

## Verify

From `server/`, run `npm run test:telemetry`. It uses temporary storage and tests
restart persistence, concurrent appends, pagination, invalid payloads, REST
responses, recording without browsers, two browser listeners, and resubscription.

Restart the backend after updating the code (`yarn start` in `server/`), then run
your MQTT publisher. Open the session-list URL and use a returned `sessionId`
in the telemetry URL. Only messages received after this change are stored;
previous console output and browser chart history cannot be recovered.
