import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

interface Session {
  sessionId: string;
  count: number;
}

/** Display links to the backend's saved session files. */
export default function SavedSessions(): JSX.Element {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(false);
    try {
      const collected: Session[] = [];
      let total = 0;
      do {
        // Sequential pages include archives larger than the API page limit.
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(
          `/api/t2/sessions?offset=${collected.length}&limit=1000`,
        );
        if (!response.ok) throw new Error('Unable to load sessions');
        // eslint-disable-next-line no-await-in-loop
        const page = await response.json();
        collected.push(...page.sessions);
        total = page.total;
        if (!page.sessions.length) break;
      } while (collected.length < total);
      setSessions(collected);
    } catch (_) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dropdown
      onToggle={(open: boolean) => {
        if (open) refresh();
      }}
      className="mb-3"
    >
      <Dropdown.Toggle id="t2-saved-sessions" variant="outline-secondary">
        Saved sessions
      </Dropdown.Toggle>
      <Dropdown.Menu
        alignRight
        style={{ maxHeight: '320px', overflowY: 'auto', maxWidth: '90vw' }}
      >
        {loading && <Dropdown.Item disabled>Loading sessions…</Dropdown.Item>}
        {!loading && error && (
          <Dropdown.Item disabled>
            Could not load sessions. Check the backend and reopen.
          </Dropdown.Item>
        )}
        {!loading && !error && sessions.length === 0 && (
          <Dropdown.Item disabled>No saved sessions yet.</Dropdown.Item>
        )}
        {!loading &&
          !error &&
          sessions.map((session) => (
            <Dropdown.Item
              key={session.sessionId}
              href={`/api/t2/sessions/${encodeURIComponent(
                session.sessionId,
              )}/file`}
              style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
            >
              {session.sessionId} — {session.count} readings
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
