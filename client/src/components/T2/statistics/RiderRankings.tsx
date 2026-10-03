import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChannel } from 'api/common/socket';
import { RiderRankingsData, useSessionHistory } from '../SessionHistory';
import styles from './RiderRankings.module.css';

export default function RiderRankings() {
  const { session, records, savedRiders } = useSessionHistory();
  const latest = records[records.length - 1];
  const id = session || (latest && latest.sessionId);
  const [ranking, setRanking] = useState<RiderRankingsData | undefined>(
    (latest && latest.riderRankings) || savedRiders,
  );
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const accept = useCallback(
    (value: RiderRankingsData) => {
      if (!value || value.sessionId !== id) return;
      setRanking((previous) =>
        !previous ||
        previous.sessionId !== id ||
        value.version >= previous.version
          ? value
          : previous,
      );
    },
    [id],
  );
  const receive = useCallback(
    (value: RiderRankingsData) => {
      if (!session) accept(value);
    },
    [session, accept],
  );
  useChannel('t2-riders', receive);
  useEffect(() => {
    if (session) {
      setRanking(savedRiders);
    } else if (latest && latest.riderRankings) accept(latest.riderRankings);
  }, [session, savedRiders, latest, accept]);
  // Fetch only small ranking totals, never automatically load telemetry history.
  useEffect(() => {
    if (!id || session) return undefined;
    const controller = new AbortController();
    fetch(`/api/t2/sessions/${encodeURIComponent(id)}/riders`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            'Could not load riders. Reopen the selector to retry.',
          );
        return response.json();
      })
      .then((value) => {
        if (!controller.signal.aborted) {
          accept(value);
          setError('');
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      });
    return () => controller.abort();
  }, [id, session, accept, open]);

  const choose = async (
    selection: { name: string } | { riderId: string | null },
  ) => {
    if (!id || session || busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(
        `/api/t2/sessions/${encodeURIComponent(id)}/riders`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selection),
        },
      );
      const value = await response.json();
      if (!response.ok)
        throw new Error(value.error || 'Could not save rider. Please retry.');
      if (mounted.current) {
        accept(value);
        setOpen(false);
        setName('');
      }
    } catch (failure) {
      if (mounted.current) setError(failure.message);
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const riders = ranking ? ranking.riders : [];
  const active = riders.find(
    (rider) => ranking && rider.id === ranking.activeRiderId,
  );
  const filtered = riders.filter((rider) =>
    rider.name.toLowerCase().includes(name.trim().toLowerCase()),
  );
  const ordered = riders
    .slice()
    .sort(
      (a, b) =>
        (b.scores ? b.scores.total : -1) - (a.scores ? a.scores.total : -1) ||
        a.name.localeCompare(b.name),
    );
  return (
    <section className={styles.card} aria-label="Rider rankings">
      <div className={styles.header}>
        <div>
          <h2>Rider rankings</h2>
          <p>
            {session
              ? 'Saved session scores'
              : 'Every stint counts. Returning riders keep their totals.'}
          </p>
        </div>
        <span className={styles.badge}>Score / 100</span>
      </div>
      <div className={styles.selector}>
        <span>{session ? 'Last selected rider' : 'Current rider'}</span>
        <button
          type="button"
          aria-expanded={open}
          disabled={!!session || !id || busy}
          onClick={() => setOpen(!open)}
        >
          {busy
            ? 'Saving…'
            : (active && active.name) || 'Select or add a rider'}{' '}
          ▾
        </button>
        {open && !session && (
          <div className={styles.menu}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim()) choose({ name });
              }}
            >
              <input
                aria-label="Find or add rider"
                placeholder="Type a rider’s name"
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={busy}
              />
              <button type="submit" disabled={busy || !name.trim()}>
                Add / select
              </button>
            </form>
            <div className={styles.options}>
              {filtered.map((rider) => (
                <button
                  key={rider.id}
                  type="button"
                  disabled={busy}
                  onClick={() => choose({ riderId: rider.id })}
                >
                  {rider.name}
                  {rider.id === (ranking && ranking.activeRiderId)
                    ? ' · riding'
                    : ''}
                </button>
              ))}
              <button
                type="button"
                disabled={busy}
                onClick={() => choose({ riderId: null })}
              >
                No rider — pause attribution
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {!id && <p>Waiting for session telemetry…</p>}
      {!riders.length && (
        <p className={styles.hint}>
          Choose a rider to start scoring new readings. Earlier readings stay
          unassigned.
        </p>
      )}
      {!!riders.length && (
        <div className={styles.scroll}>
          <table>
            <thead>
              <tr>
                <th>Rider</th>
                <th>Speed</th>
                <th>Efficiency</th>
                <th>Power</th>
                <th>Consistency</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((rider, index) => (
                <tr
                  key={rider.id}
                  className={
                    active && rider.id === active.id ? styles.active : ''
                  }
                >
                  <th scope="row">
                    <strong>
                      {rider.scores ? `${index + 1}. ` : ''}
                      {rider.name}
                    </strong>
                    <small>
                      {rider.samples.toLocaleString()} readings
                      {active && rider.id === active.id ? ' · selected' : ''}
                    </small>
                    <small>
                      {rider.averageSpeed.toFixed(1)} km/h ·{' '}
                      {rider.averagePower.toFixed(0)} W
                    </small>
                    {rider.excluded > 0 && (
                      <small>
                        {rider.excluded} invalid-unit / negative readings
                        excluded
                      </small>
                    )}
                  </th>
                  {([
                    'speed',
                    'efficiency',
                    'power',
                    'consistency',
                    'total',
                  ] as const).map((key) => (
                    <td
                      key={key}
                      className={key === 'total' ? styles.total : ''}
                    >
                      {rider.scores ? rider.scores[key].toFixed(1) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <details className={styles.hint}>
        <summary>How scores work</summary>
        <p>
          Equal weights: speed (45 km/h), efficiency (5.5 Wh/km), power (250 W),
          and power consistency (8% variation). Each score is capped at 100.
        </p>
        <p>
          All valid assigned readings in this session count, including earlier
          stints beyond the map’s 20,000-reading limit. Averages are per
          reading. Scores start after two readings. Zero speed earns zero
          efficiency; zero average power earns zero consistency. A constant
          positive power earns 100 consistency.
        </p>
      </details>
    </section>
  );
}
