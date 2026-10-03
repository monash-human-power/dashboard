import React from 'react';
import { render, act } from '@testing-library/react';
import { SessionHistoryProvider, useSessionHistory } from '../SessionHistory';
import RiderRankings from './RiderRankings';

const { fireEvent, waitForElement } = require('@testing-library/react');
const mockChannels: { [name: string]: Function } = {};
jest.mock('api/common/socket', () => ({
  useChannel: (name: string, callback: Function) => {
    mockChannels[name] = callback;
  },
}));
const ranking = (version: number, samples: number) => ({
  sessionId: 'ride',
  version,
  activeRiderId: 'alice',
  riders: [
    {
      id: 'alice',
      name: 'Alice',
      samples,
      excluded: 0,
      averageSpeed: 45,
      averagePower: 250,
      efficiency: 250 / 45,
      cv: 0,
      scores: {
        speed: 100,
        efficiency: 99,
        power: 100,
        consistency: 100,
        total: 99.75,
      },
    },
  ],
});
const reading = (version: number, samples: number) => ({
  sessionId: 'ride',
  eventId: String(version),
  riderRankings: ranking(version, samples),
});
function Content() {
  const { select, session, revision } = useSessionHistory();
  return (
    <>
      <button onClick={() => select('ride')}>History</button>
      <RiderRankings key={`${session}-${revision}`} />
    </>
  );
}

test('selects a typed rider, ignores stale responses and restores a frozen snapshot before continuing live', async () => {
  const originalFetch = window.fetch;
  window.fetch = jest.fn(async (url, options) => ({
    ok: true,
    json: async () =>
      String(url).endsWith('/snapshot')
        ? { telemetry: [reading(2, 2)], riderRankings: ranking(2, 2) }
        : options && options.method === 'PUT'
        ? ranking(5, 5)
        : ranking(3, 3),
  })) as any;
  const view = render(
    <SessionHistoryProvider>
      <Content />
    </SessionHistoryProvider>,
  );
  act(() => mockChannels['t2-telemetry'](reading(3, 3)));
  await waitForElement(() => view.getByText('3 readings · selected'));
  fireEvent.click(view.getByText('Alice ▾'));
  fireEvent.change(view.getByLabelText('Find or add rider'), {
    target: { value: 'Alice' },
  });
  fireEvent.click(view.getByText('Add / select'));
  await waitForElement(() => view.getByText('5 readings · selected'));
  expect(window.fetch).toHaveBeenCalledWith(
    '/api/t2/sessions/ride/riders',
    expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ name: 'Alice' }),
    }),
  );
  act(() => mockChannels['t2-riders'](ranking(4, 4)));
  expect(view.container.textContent).toContain('5 readings · selected');
  fireEvent.click(view.getByText('History'));
  await waitForElement(() => view.getByText('2 readings · selected'));
  act(() => mockChannels['t2-riders'](ranking(6, 6)));
  act(() => mockChannels['t2-telemetry'](reading(6, 6)));
  expect(view.container.textContent).toContain('2 readings · selected');
  expect((view.getByText('Alice ▾') as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(view.getByText('Go to live'));
  await waitForElement(() => view.getByText('6 readings · selected'));
  expect(view.container.textContent).toContain('99.8');
  view.unmount();
  window.fetch = originalFetch;
});
