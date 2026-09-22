import React from 'react';
import { render, act } from '@testing-library/react';
import { SessionHistoryProvider, useSessionHistory } from './SessionHistory';
import { LapProvider, useLapContext } from './LapContext';
import RiderAnalytics from './statistics/RiderRanker';

const { fireEvent, waitForElement } = require('@testing-library/react');
let receive: Function;
jest.mock('api/common/socket', () => ({
  useChannel: (_name: string, callback: Function) => {
    receive = callback;
  },
}));

function Controls() {
  const { select } = useSessionHistory();
  const { addCheckpoint } = useLapContext();
  return (
    <>
      <button onClick={() => select('ride')}>Load history</button>
      <button onClick={() => addCheckpoint(-38, 145)}>Set start</button>
    </>
  );
}
function Content() {
  const { session, revision } = useSessionHistory();
  return (
    <LapProvider key={`${session}-${revision}`}>
      <Controls />
      <RiderAnalytics />
    </LapProvider>
  );
}
const sample = (
  eventId: string,
  seconds: number,
  speed: number,
  sessionId = 'ride',
) => ({
  eventId,
  sessionId,
  type: 'telemetry',
  timestamp: new Date(1700000000000 + seconds * 1000).toISOString(),
  data: {
    speed: { value: speed, unit: 'km/h' },
    power: { value: 123, unit: 'W' },
    cadence: { value: 90, unit: 'rpm' },
    batteryVoltage: { value: 48, unit: 'V' },
    gps: { latitude: -38, longitude: 145, altitude: 0, speed },
  },
});

test('new styled cards show saved history then live data, with lap timing following the selected session', async () => {
  const originalFetch = window.fetch;
  window.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ telemetry: [sample('saved', 0, 24)] }),
  })) as any;
  const view = render(
    <SessionHistoryProvider>
      <Content />
    </SessionHistoryProvider>,
  );
  fireEvent.click(view.getByText('Load history'));
  await waitForElement(() => view.getByText('Session Averages'));
  expect(view.container.textContent).toContain('24.0km/h');
  fireEvent.click(view.getByText('Set start'));
  act(() => receive(sample('buffered', 1, 36)));
  expect(view.container.textContent).not.toContain('36.0km/h');
  fireEvent.click(view.getByText('Go to live'));
  expect(view.container.textContent).toContain('36.0km/h');
  fireEvent.click(view.getByText('Set start'));
  act(() => receive(sample('start', 2, 40)));
  act(() => receive(sample('foreign', 20, 99, 'another-ride')));
  expect(view.container.textContent).toContain('0 laps');
  act(() => receive(sample('finish', 8, 42)));
  expect(view.container.textContent).toContain('1 laps');
  expect(view.container.textContent).toContain('42.0km/h');
  expect(window.fetch).toHaveBeenCalledTimes(1);
  view.unmount();
  window.fetch = originalFetch;
});
