import React from 'react';
import { render, act } from '@testing-library/react';
import {
  SessionHistoryProvider,
  useSessionHistory,
  useSessionChannel,
} from './SessionHistory';
const { fireEvent, waitForElement } = require('@testing-library/react');
let receive: Function;
jest.mock('api/common/socket', () => ({
  useChannel: (_name: string, callback: Function) => {
    receive = callback;
  },
}));
function Probe() {
  const { records, select } = useSessionHistory();
  return (
    <div>
      <span>Count {records.length}</span>
      <button type="button" onClick={() => select('active')}>
        History
      </button>
    </div>
  );
}
const record = (eventId: string, sessionId = 'active') => ({
  sessionId,
  eventId,
});
test('keeps delivering live readings after the 20,000 reading window fills', async () => {
  const originalFetch = window.fetch;
  const delivered = jest.fn();
  function LiveProbe() {
    useSessionChannel('t2-telemetry', delivered);
    return <Probe />;
  }
  window.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      telemetry: Array.from({ length: 20005 }, (_, i) => record(String(i))),
    }),
  })) as any;
  const view = render(
    <SessionHistoryProvider>
      <LiveProbe />
    </SessionHistoryProvider>,
  );
  fireEvent.click(view.getByText('History'));
  await waitForElement(() => view.getByText('Count 20000'));
  fireEvent.click(view.getByText('Go to live'));
  delivered.mockClear();
  act(() => receive(record('new-1')));
  act(() => receive(record('new-2')));
  act(() => receive(record('new-2')));
  expect(view.getByText('Count 20000')).toBeTruthy();
  expect(delivered.mock.calls.map((args) => args[0].eventId)).toEqual([
    'new-1',
    'new-2',
  ]);
  view.unmount();
  window.fetch = originalFetch;
});
test('fetches only on selection, continues the snapshot without refetch, and refresh starts fresh', async () => {
  window.history.replaceState({}, '', '/T2?session=old');
  const originalFetch = window.fetch;
  let finish: Function = () => {};
  const fetchMock = jest.fn(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  window.fetch = fetchMock as any;
  const view = render(
    <SessionHistoryProvider>
      <Probe />
    </SessionHistoryProvider>,
  );
  expect(view.getByText('Count 0')).toBeTruthy();
  expect(fetchMock).not.toHaveBeenCalled();
  act(() => receive(record('a')));
  expect(view.getByText('Count 1')).toBeTruthy();
  fireEvent.click(view.getByText('History'));
  act(() => receive(record('b')));
  act(() => receive(record('c')));
  await act(async () =>
    finish({
      ok: true,
      json: async () => ({ telemetry: [record('a'), record('b')] }),
    }),
  );
  await waitForElement(() => view.getByText('Count 2'));
  act(() => receive(record('d')));
  expect(view.getByText('Count 2')).toBeTruthy();
  fireEvent.click(view.getByText('Go to live'));
  expect(view.getByText('Count 4')).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  act(() => receive(record('d')));
  act(() => receive(record('other', 'other-session')));
  expect(view.getByText('Count 4')).toBeTruthy();
  act(() => receive(record('e')));
  expect(view.getByText('Count 5')).toBeTruthy();
  view.unmount();
  const refreshed = render(
    <SessionHistoryProvider>
      <Probe />
    </SessionHistoryProvider>,
  );
  expect(refreshed.getByText('Count 0')).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  refreshed.unmount();
  window.fetch = originalFetch;
});
