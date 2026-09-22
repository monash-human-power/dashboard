const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function validateSessionId(sessionId) {
  if (
    typeof sessionId !== 'string' ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(sessionId)
  ) {
    throw badRequest(
      'sessionId must be 1–128 letters, digits, dots, underscores or hyphens, starting with a letter or digit',
    );
  }
}

function validateTelemetry(topic, payload) {
  const match = /^t2\/([^/]+)\/telemetry$/.exec(topic);
  if (!match) throw badRequest('Invalid T2 telemetry topic');
  if (Buffer.byteLength(payload) > 1024 * 1024)
    throw badRequest('Telemetry exceeds 1 MiB');
  let value;
  try {
    value = JSON.parse(payload.toString());
  } catch (error) {
    throw badRequest('Telemetry must be valid JSON');
  }
  if (!value || value.type !== 'telemetry')
    throw badRequest('type must be telemetry');
  validateSessionId(value.sessionId);
  if (value.sessionId !== match[1])
    throw badRequest('Topic and payload sessionId must match');
  if (
    typeof value.timestamp !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value.timestamp,
    ) ||
    !Number.isFinite(Date.parse(value.timestamp))
  ) {
    throw badRequest('timestamp must be an ISO 8601 timestamp with timezone');
  }
  const { data } = value;
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw badRequest('data must be an object');
  ['speed', 'power', 'cadence', 'batteryVoltage'].forEach((field) => {
    const reading = data[field];
    if (
      !reading ||
      !Number.isFinite(reading.value) ||
      typeof reading.unit !== 'string' ||
      !reading.unit.trim()
    ) {
      throw badRequest(`${field} requires a finite numeric value and a unit`);
    }
  });
  if (
    !data.gps ||
    !['latitude', 'longitude', 'altitude', 'speed'].every((field) =>
      Number.isFinite(data.gps[field]),
    )
  ) {
    throw badRequest(
      'gps requires numeric latitude, longitude, altitude and speed',
    );
  }
  return value;
}

// One queue serializes reads and appends so REST never observes a partial write.
// Files are streamed on reads; complete sessions are not loaded into memory.
class TelemetryStore {
  constructor(directory) {
    this.directory = path.resolve(directory);
    this.pending = Promise.resolve();
  }

  run(operation) {
    const result = this.pending.then(async () => {
      await fs.promises.mkdir(this.directory, { recursive: true });
      return operation();
    });
    this.pending = result.catch(() => {});
    return result;
  }

  filename(sessionId, legacy = false) {
    validateSessionId(sessionId);
    const key = crypto
      .createHash('sha256')
      .update(sessionId)
      .digest('hex');
    // Prefix avoids Windows device names such as CON; suffix separates case variants.
    return path.join(this.directory, legacy
      ? `${key}.jsonl`
      : `session-${sessionId}_${key.slice(0, 12)}.jsonl`);
  }

  async resolveFilename(sessionId) {
    const filename = this.filename(sessionId);
    const legacy = this.filename(sessionId, true);
    try {
      await fs.promises.access(legacy);
    } catch (error) {
      if (error.code === 'ENOENT') return filename;
      throw error;
    }
    // Never overwrite a destination if both naming formats already exist.
    try {
      await fs.promises.access(filename);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await fs.promises.rename(legacy, filename);
      return filename;
    }
    throw new Error(`Both old and new telemetry files exist for ${sessionId}`);
  }

  append(topic, payload) {
    const value = validateTelemetry(topic, payload);
    const record = { ...value, topic, receivedAt: new Date().toISOString(), eventId: crypto.randomBytes(16).toString('hex') };
    return this.run(async () => {
      await fs.promises.appendFile(
        await this.resolveFilename(value.sessionId),
        `${JSON.stringify(record)}\n`,
        'utf8',
      );
      return record;
    });
  }

  static async scan(filename, visit) {
    await fs.promises.access(filename, fs.constants.R_OK);
    const input = fs.createReadStream(filename, { encoding: 'utf8' });
    const lines = readline.createInterface({ input, crlfDelay: Infinity });
    let readError;
    input.on('error', (error) => {
      readError = error;
      lines.close();
    });
    try {
      // Streaming iteration deliberately avoids retaining the complete log.
      // eslint-disable-next-line no-restricted-syntax
      for await (const line of lines) {
        if (line.trim()) visit(JSON.parse(line));
      }
      if (readError) throw readError;
    } finally {
      lines.close();
      input.destroy();
    }
  }

  listSessions({ offset = 0, limit = 100 } = {}) {
    return this.run(async () => {
      const filenames = (
        await fs.promises.readdir(this.directory)
      ).filter((name) => /^(?:[a-f0-9]{64}|session-[A-Za-z0-9][A-Za-z0-9._-]{0,127}_[a-f0-9]{12})\.jsonl$/.test(name));
      const sessions = [];
      // Sequential scans keep open-file count bounded.
      // eslint-disable-next-line no-restricted-syntax
      for (const filename of filenames) {
        let summary;
        await TelemetryStore.scan(
          path.join(this.directory, filename),
          (record) => {
            if (!summary) {
              summary = {
                sessionId: record.sessionId,
                count: 0,
                firstTimestamp: record.timestamp,
                lastTimestamp: record.timestamp,
                firstReceivedAt: record.receivedAt,
                lastReceivedAt: record.receivedAt,
              };
            }
            summary.count += 1;
            if (
              Date.parse(record.timestamp) < Date.parse(summary.firstTimestamp)
            )
              summary.firstTimestamp = record.timestamp;
            if (
              Date.parse(record.timestamp) > Date.parse(summary.lastTimestamp)
            )
              summary.lastTimestamp = record.timestamp;
            summary.lastReceivedAt = record.receivedAt;
          },
        );
        if (summary) {
          await this.resolveFilename(summary.sessionId);
          sessions.push(summary);
        }
      }
      sessions.sort(
        (a, b) =>
          b.lastReceivedAt.localeCompare(a.lastReceivedAt) ||
          a.sessionId.localeCompare(b.sessionId),
      );
      return {
        sessions: sessions.slice(offset, offset + limit),
        total: sessions.length,
        offset,
        limit,
      };
    });
  }

  getTelemetry(sessionId, { offset = 0, limit = 100, latest = false } = {}) {
    validateSessionId(sessionId);
    return this.run(async () => {
      const filename = await this.resolveFilename(sessionId);
      let telemetry = [];
      let total = 0;
      try {
        await TelemetryStore.scan(filename, (record) => {
          if (latest) telemetry[total % limit] = record;
          else if (total >= offset && telemetry.length < limit)
            telemetry.push(record);
          total += 1;
        });
      } catch (error) {
        if (error.code === 'ENOENT') {
          error.status = 404;
          error.message = 'Session not found';
        }
        throw error;
      }
      if (latest) {
        if (total > limit) {
          const start = total % limit;
          telemetry = telemetry.slice(start).concat(telemetry.slice(0, start));
        }
        offset = Math.max(0, total - limit);
      }
      return {
        sessionId,
        telemetry,
        total,
        offset,
        limit,
        nextOffset:
          offset + telemetry.length < total ? offset + telemetry.length : null,
      };
    });
  }
}

module.exports = { TelemetryStore, validateTelemetry };
