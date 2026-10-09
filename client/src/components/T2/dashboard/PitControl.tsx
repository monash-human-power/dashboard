import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChannel, useSocketConnected } from 'api/common/socket';
import { useSessionHistory } from '../SessionHistory';
import styles from './PitControl.module.css';

import { PitStatus } from '../PitStatus';

const labels = {
  idle: 'No request',
  preparing: 'Preparing to pit',
  pitting: 'Pitting',
  completed: 'Pit completed',
  cancelled: 'Request cancelled',
};

export default function PitControl() {
  const { session, records, savedPit, savedPitEvents } = useSessionHistory();
  const id =
    session || (records.length ? records[records.length - 1].sessionId : null);
  const online = useSocketConnected();
  const [status, setStatus] = useState<PitStatus | null>(null);
  const [events, setEvents] = useState<PitStatus[]>([]);
  const [broker, setBroker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const locked = useRef(false);
  const current = useRef(id);
  current.current = id;
  const accept = useCallback(
    (value: PitStatus) => {
      if (!session && value.sessionId === id)
        setStatus((previous) =>
          !previous ||
          previous.sessionId !== id ||
          value.version >= previous.version
            ? value
            : previous,
        );
    },
    [id, session],
  );
  useChannel('t2-pit-state', accept);
  useChannel(
    't2-pit-connection',
    useCallback(
      (value: { connected: boolean }) => setBroker(value.connected),
      [],
    ),
  );

  useEffect(() => {
    setStatus(session ? savedPit || null : null);
    setEvents(session ? savedPitEvents || [] : []);
    setError('');
    if (!id || session || !online) return undefined;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch(
          `/api/t2/sessions/${encodeURIComponent(id)}/pit`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Could not load pit status');
        const value = await response.json();
        if (!controller.signal.aborted) {
          accept(value.pitStatus);
          setBroker(value.mqttConnected);
          setEvents(value.pitEvents || []);
          setError((previous) =>
            previous === 'Could not load pit status' ? '' : previous,
          );
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          setBroker(false);
          setError(failure.message);
        }
      }
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [id, session, savedPit, savedPitEvents, online, accept]);

  const send = async (action: string) => {
    if (
      !id ||
      !status ||
      status.sessionId !== id ||
      session ||
      !online ||
      !broker ||
      locked.current
    )
      return;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(
        `/api/t2/sessions/${encodeURIComponent(id)}/pit/commands`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: id,
            commandId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            action,
            expectedVersion: status.version,
            timestamp: new Date().toISOString(),
          }),
        },
      );
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || 'Pit command failed');
      if (mounted.current && current.current === id) {
        accept(value);
        setBroker(value.mqttConnected);
        setError(value.deliveryError || '');
      }
    } catch (failure) {
      if (mounted.current && current.current === id) setError(failure.message);
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const activeStatus = status && status.sessionId === id ? status : null;
  const state = activeStatus ? activeStatus.state : 'idle';
  const disabled = busy || !!session || !online || !broker || !activeStatus;
  let hint = 'Live pit control';
  if (state === 'preparing')
    hint =
      activeStatus && activeStatus.acknowledgedAt
        ? 'Rider acknowledged'
        : 'Awaiting rider acknowledgement';
  if (!online || !broker) hint = 'Connection unavailable';
  if (busy) hint = 'Sending...';
  if (session) hint = 'Saved history - controls disabled';
  let buttons;
  if (state === 'preparing')
    buttons = (
      <>
        <button
          type="button"
          disabled={disabled}
          onClick={() => send('cancel')}
        >
          Cancel request
        </button>
        <button type="button" disabled={disabled} onClick={() => send('start')}>
          Start pit
        </button>
      </>
    );
  else if (state === 'pitting')
    buttons = (
      <button
        type="button"
        disabled={disabled}
        onClick={() => send('complete')}
      >
        Pit complete
      </button>
    );
  else
    buttons = (
      <button type="button" disabled={disabled} onClick={() => send('request')}>
        Request pit
      </button>
    );
  return (
    <div className={`${styles.control} ${styles[state]}`}>
      <div className={styles.status} role="status" aria-live="polite">
        <strong>
          Pit: {activeStatus ? labels[state] : 'Waiting for session'}
        </strong>
        <small>{hint}</small>
      </div>
      {buttons}
      {!!events.length && (
        <details className={styles.history}>
          <summary>Pit history</summary>
          <div>
            {events
              .slice(-20)
              .reverse()
              .map((event) => (
                <p key={event.version}>
                  <strong>{labels[event.state]}</strong> -{' '}
                  {event.requestedBy || 'crew'}
                  <small>
                    {event.timestamp
                      ? new Date(event.timestamp).toLocaleString()
                      : ''}
                  </small>
                </p>
              ))}
          </div>
        </details>
      )}
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}
